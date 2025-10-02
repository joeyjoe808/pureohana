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

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let completed = 0

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${galleryId}/${fileName}`

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

        await supabase.from('photos').insert({
          gallery_id: galleryId,
          filename: file.name,
          thumbnail_url: publicUrl,
          web_url: publicUrl,
          original_url: publicUrl,
          file_size: file.size,
        })

        completed++
        setProgress(Math.round((completed / selectedFiles.length) * 100))
      }

      setSelectedFiles([])
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to upload photos')
    } finally {
      setUploading(false)
      setProgress(0)
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
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-2">
            Selected: {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
          </p>
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
        <div className="mt-4">
          <div className="bg-gray-100 h-1 overflow-hidden">
            <div
              className="bg-gray-900 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
