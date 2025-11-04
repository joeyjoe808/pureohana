'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface UploadFile {
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress: number
}

interface Gallery {
  id: string
  title: string
}

export default function AdminUploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const galleryId = searchParams.get('gallery')

  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState(galleryId || '')
  const [loadingGalleries, setLoadingGalleries] = useState(true)

  // Fetch galleries on mount
  useEffect(() => {
    const fetchGalleries = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('galleries')
        .select('id, title')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setGalleries(data)
        // If only one gallery, auto-select it
        if (data.length === 1 && !selectedGallery) {
          setSelectedGallery(data[0].id)
        }
      }
      setLoadingGalleries(false)
    }

    fetchGalleries()
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: UploadFile[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadPhotos = async () => {
    if (!selectedGallery) {
      alert('Please select a gallery')
      return
    }

    console.log('🚀 Starting upload...', { gallery: selectedGallery, fileCount: files.length })
    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i]

      if (uploadFile.status !== 'pending') {
        continue
      }

      console.log(`📤 Uploading file ${i + 1}/${files.length}:`, uploadFile.file.name)

      setFiles(prev => {
        const updated = [...prev]
        updated[i].status = 'uploading'
        return updated
      })

      try {
        // Upload to Supabase Storage
        const timestamp = Date.now()
        const filename = `${timestamp}-${uploadFile.file.name}`

        // Set initial progress
        setFiles(prev => {
          const updated = [...prev]
          updated[i].progress = 50
          return updated
        })

        console.log('📁 Uploading to storage bucket:', filename)
        const { data: storageData, error: storageError } = await supabase.storage
          .from('gallery-photos')
          .upload(filename, uploadFile.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (storageError) {
          console.error('❌ Storage error:', storageError)
          throw new Error(`Storage upload failed: ${storageError.message}`)
        }

        console.log('✅ Storage upload successful:', storageData)

        // Get public URLs
        console.log('🔗 Getting public URL...')
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-photos')
          .getPublicUrl(filename)

        console.log('📝 Inserting into database...', { gallery_id: selectedGallery, publicUrl })

        // Create photo record in database
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            gallery_id: selectedGallery,
            filename: uploadFile.file.name,
            thumbnail_url: publicUrl,
            web_url: publicUrl,
            original_url: publicUrl,
            position: i + 1,
            is_public_portfolio: false
          })

        if (dbError) {
          console.error('❌ Database error:', dbError)
          throw new Error(`Database insert failed: ${dbError.message}`)
        }

        console.log('✅ Photo saved to database!')

        setFiles(prev => {
          const updated = [...prev]
          updated[i].status = 'success'
          updated[i].progress = 100
          return updated
        })
      } catch (error: any) {
        console.error('❌ Upload failed:', error)
        setFiles(prev => {
          const updated = [...prev]
          updated[i].status = 'error'
          updated[i].error = error.message || 'Upload failed'
          return updated
        })

        // Show alert for first error
        if (i === 0) {
          alert(`Upload Error: ${error.message}\n\nCheck browser console for details.`)
        }
      }
    }

    console.log('🏁 Upload complete!')
    setUploading(false)
  }

  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length
  const pendingCount = files.filter(f => f.status === 'pending').length
  const allUploaded = files.length > 0 && pendingCount === 0 && !uploading

  return (
    <Container className="py-12">
      <Heading level={1} className="mb-8">
        Upload Photos
      </Heading>

      {/* Success Message */}
      {allUploaded && successCount > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-luxury p-6 mb-8">
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-display text-lg text-green-900 mb-2">
                ✅ {successCount} photo{successCount !== 1 ? 's' : ''} uploaded successfully!
              </h3>
              <p className="font-serif text-green-800 mb-4">
                Your photos are now in the library. Assign them to website sections to make them visible.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/admin/photo-library"
                  className="inline-flex items-center gap-2 bg-sunset-600 text-white px-6 py-3 rounded-luxury font-serif hover:bg-sunset-700 transition-colors"
                >
                  <ImageIcon size={16} />
                  Go to Photo Library
                </Link>
                <button
                  onClick={() => {
                    setFiles([])
                    setSelectedGallery('')
                  }}
                  className="inline-flex items-center gap-2 bg-white text-charcoal-900 px-6 py-3 rounded-luxury font-serif border-2 border-charcoal-200 hover:border-charcoal-300 transition-colors"
                >
                  Upload More Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Selection */}
      <div className={`bg-white rounded-luxury-lg shadow-luxury p-6 mb-8 transition-all ${
        files.length > 0 && !selectedGallery ? 'ring-4 ring-yellow-400 animate-pulse' : ''
      }`}>
        <label className="block font-serif text-sm font-medium text-charcoal-700 mb-2">
          Select Gallery {files.length > 0 && !selectedGallery && <span className="text-yellow-600">⚠️ Required to upload</span>}
        </label>
        {loadingGalleries ? (
          <div className="py-3 text-center text-charcoal-600 font-serif">
            Loading galleries...
          </div>
        ) : galleries.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-charcoal-600 font-serif mb-4">
              No galleries found. Create one first!
            </p>
            <Link
              href="/admin/galleries"
              className="inline-flex items-center gap-2 bg-sunset-600 text-white px-6 py-3 rounded-luxury font-serif hover:bg-sunset-700 transition-colors"
            >
              Go to Galleries
              <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <select
            value={selectedGallery}
            onChange={(e) => setSelectedGallery(e.target.value)}
            className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
            disabled={uploading}
          >
            <option value="">Choose a gallery...</option>
            {galleries.map(gallery => (
              <option key={gallery.id} value={gallery.id}>
                {gallery.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-luxury-lg shadow-luxury p-8 mb-8">
        <div className="border-2 border-dashed border-charcoal-300 rounded-luxury p-12 text-center">
          <Upload size={48} className="mx-auto text-charcoal-400 mb-4" />
          <Heading level={3} className="mb-2">
            Drop photos here or click to browse
          </Heading>
          <p className="font-serif text-charcoal-600 mb-6">
            Upload multiple photos at once (up to 500 photos)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors cursor-pointer"
          >
            Select Photos
          </label>
        </div>
      </div>

      {/* Upload Stats */}
      {files.length > 0 && (
        <div className="bg-white rounded-luxury-lg shadow-luxury p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <p className="font-serif text-sm text-charcoal-600">Total</p>
                <p className="font-display text-2xl text-charcoal-900">{files.length}</p>
              </div>
              <div>
                <p className="font-serif text-sm text-charcoal-600">Success</p>
                <p className="font-display text-2xl text-green-600">{successCount}</p>
              </div>
              <div>
                <p className="font-serif text-sm text-charcoal-600">Errors</p>
                <p className="font-display text-2xl text-red-600">{errorCount}</p>
              </div>
              <div>
                <p className="font-serif text-sm text-charcoal-600">Pending</p>
                <p className="font-display text-2xl text-charcoal-600">{pendingCount}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {!selectedGallery && pendingCount > 0 && (
                <p className="text-sm text-yellow-600 font-serif">
                  ⚠️ Select a gallery first
                </p>
              )}
              <button
                onClick={uploadPhotos}
                disabled={uploading || !selectedGallery || pendingCount === 0}
                className="bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : `Upload ${pendingCount} Photos`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((uploadFile, index) => (
            <div key={index} className="relative bg-white rounded-luxury shadow-luxury overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={uploadFile.preview}
                  alt={uploadFile.file.name}
                  fill
                  className="object-cover"
                />

                {/* Status Overlay */}
                {uploadFile.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mx-auto mb-2" />
                      <p className="text-sm font-serif">{Math.round(uploadFile.progress)}%</p>
                    </div>
                  </div>
                )}

                {uploadFile.status === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                )}

                {uploadFile.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <AlertCircle size={32} className="text-red-600" />
                  </div>
                )}
              </div>

              {/* Remove button (only for pending) */}
              {uploadFile.status === 'pending' && (
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              <div className="p-2">
                <p className="font-serif text-xs text-charcoal-600 truncate">
                  {uploadFile.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
