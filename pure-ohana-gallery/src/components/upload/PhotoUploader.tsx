'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PhotoUploaderProps {
  galleryId: string
}

export default function PhotoUploader({ galleryId }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploadStats, setUploadStats] = useState({ completed: 0, failed: 0, total: 0 })
  const [optimizeImages, setOptimizeImages] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    setError(null)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    setSelectedFiles(files)
    setError(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setError(null)
    setProgress(0)
    setUploadStats({ completed: 0, failed: 0, total: selectedFiles.length })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let completed = 0
      let failed = 0
      const failedFiles: string[] = []

      // Process in batches of 10 for parallel upload
      const BATCH_SIZE = 10
      
      for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
        const batch = selectedFiles.slice(i, i + BATCH_SIZE)
        
        // Upload batch in parallel
        const results = await Promise.allSettled(
          batch.map(async (file) => {
            try {
              // Generate unique filename
              const fileExt = file.name.split('.').pop()
              const timestamp = Date.now()
              const randomStr = Math.random().toString(36).substring(2)
              
              let thumbnailUrl: string
              let webUrl: string
              let originalUrl: string

              if (optimizeImages) {
                // Optimize image using API
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/photos/optimize', {
                  method: 'POST',
                  body: formData
                })

                if (!response.ok) {
                  throw new Error('Image optimization failed')
                }

                const { thumbnail, web, original } = await response.json()

                // Upload optimized versions
                const thumbPath = `${user.id}/${galleryId}/thumb_${timestamp}_${randomStr}.webp`
                const webPath = `${user.id}/${galleryId}/web_${timestamp}_${randomStr}.webp`
                const origPath = `${user.id}/${galleryId}/orig_${timestamp}_${randomStr}.${fileExt}`

                // Upload thumbnail
                await supabase.storage
                  .from('gallery-photos')
                  .upload(thumbPath, Buffer.from(thumbnail.data, 'base64'), {
                    contentType: 'image/webp',
                    cacheControl: '3600'
                  })

                // Upload web version
                await supabase.storage
                  .from('gallery-photos')
                  .upload(webPath, Buffer.from(web.data, 'base64'), {
                    contentType: 'image/webp',
                    cacheControl: '3600'
                  })

                // Upload original
                await supabase.storage
                  .from('gallery-photos')
                  .upload(origPath, Buffer.from(original.data, 'base64'), {
                    contentType: file.type,
                    cacheControl: '3600'
                  })

                // Get public URLs
                thumbnailUrl = supabase.storage.from('gallery-photos').getPublicUrl(thumbPath).data.publicUrl
                webUrl = supabase.storage.from('gallery-photos').getPublicUrl(webPath).data.publicUrl
                originalUrl = supabase.storage.from('gallery-photos').getPublicUrl(origPath).data.publicUrl
              } else {
                // Upload original without optimization
                const filePath = `${user.id}/${galleryId}/${timestamp}_${randomStr}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                  .from('gallery-photos')
                  .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                  })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                  .from('gallery-photos')
                  .getPublicUrl(filePath)

                thumbnailUrl = publicUrl
                webUrl = publicUrl
                originalUrl = publicUrl
              }

              // Insert into database
              const { error: dbError } = await supabase.from('photos').insert({
                gallery_id: galleryId,
                filename: file.name,
                thumbnail_url: thumbnailUrl,
                web_url: webUrl,
                original_url: originalUrl,
                file_size: file.size,
              })

              if (dbError) throw dbError

              return { success: true, filename: file.name }
            } catch (error: any) {
              return { success: false, filename: file.name, error: error.message }
            }
          })
        )

        // Update progress
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.success) {
            completed++
          } else {
            failed++
            const filename = result.status === 'fulfilled' ? result.value.filename : 'unknown'
            failedFiles.push(filename)
          }
        })

        setUploadStats({ completed, failed, total: selectedFiles.length })
        setProgress(Math.round((completed / selectedFiles.length) * 100))
      }

      // Show results
      if (failed > 0) {
        setError(`Uploaded ${completed} photos successfully. ${failed} failed: ${failedFiles.slice(0, 5).join(', ')}${failedFiles.length > 5 ? '...' : ''}`)
      } else {
        setSelectedFiles([])
      }
      
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to upload photos')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 p-8">
      <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">Upload Photos</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-200 p-12 text-center hover:border-gray-300 transition"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-base font-light text-gray-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              PNG, JPG, GIF up to 10MB each • Upload 300-500+ photos at once
            </p>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Selected: {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="optimize"
                checked={optimizeImages}
                onChange={(e) => setOptimizeImages(e.target.checked)}
                disabled={uploading}
                className="w-4 h-4 border-gray-300 rounded"
              />
              <label htmlFor="optimize" className="text-xs text-gray-600">
                Optimize images (slower, better quality)
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={uploadPhotos}
              disabled={uploading}
              className="flex-1 bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
            >
              {uploading ? `Uploading... ${progress}%` : 'Upload Photos'}
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="bg-white text-gray-700 px-6 py-3 font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{uploadStats.completed} of {uploadStats.total} completed</span>
            {uploadStats.failed > 0 && (
              <span className="text-red-600">{uploadStats.failed} failed</span>
            )}
          </div>
          <div className="bg-gray-100 h-2 overflow-hidden rounded">
            <div
              className="bg-gray-900 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Uploading in batches of 10... This may take a few minutes for large uploads.
          </p>
        </div>
      )}
    </div>
  )
}
