'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  password_hash: string | null
  is_public: boolean
}

interface GallerySettingsFormProps {
  gallery: Gallery
}

export default function GallerySettingsForm({ gallery }: GallerySettingsFormProps) {
  const [formData, setFormData] = useState({
    title: gallery.title,
    description: gallery.description || '',
    password: '',
    is_public: gallery.is_public
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const updates: any = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public,
        updated_at: new Date().toISOString()
      }

      // Only update password if a new one was provided
      if (formData.password.trim()) {
        updates.password_hash = formData.password.trim()
      }

      const { error } = await supabase
        .from('galleries')
        .update(updates)
        .eq('id', gallery.id)

      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('Gallery updated successfully!')
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating gallery:', error)
      alert('Failed to update gallery')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Get current user ID for storage path
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch all photos to get their storage paths
      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('id, filename')
        .eq('gallery_id', gallery.id)

      if (photosError) throw photosError

      // Delete all photos from storage
      if (photos && photos.length > 0) {
        const filePaths = photos.map(photo => {
          // Extract the actual filename from the photo record
          // Storage path is: {user_id}/{gallery_id}/{filename}
          const fileExt = photo.filename.split('.').pop()
          return `${user.id}/${gallery.id}`
        })

        // Delete the entire gallery folder from storage
        const { data: storageFiles } = await supabase.storage
          .from('gallery-photos')
          .list(`${user.id}/${gallery.id}`)

        if (storageFiles && storageFiles.length > 0) {
          const filesToDelete = storageFiles.map(file => 
            `${user.id}/${gallery.id}/${file.name}`
          )
          
          const { error: storageError } = await supabase.storage
            .from('gallery-photos')
            .remove(filesToDelete)

          if (storageError) {
            console.error('Storage deletion error:', storageError)
            // Continue with gallery deletion even if storage fails
          }
        }
      }

      // Delete gallery (cascade will delete photos, comments, favorites from DB)
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', gallery.id)

      if (error) {
        alert(`Error: ${error.message}`)
        setIsDeleting(false)
      } else {
        alert('Gallery deleted successfully')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
      alert('Failed to delete gallery')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-gray-50 border border-gray-100 p-8">
        <h2 className="text-xl font-serif font-light text-gray-900 mb-6">
          Gallery Information
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
              style={{ color: '#1a1a1a', fontSize: '14px' }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors resize-none bg-white"
              style={{ color: '#1a1a1a', fontSize: '14px' }}
              rows={4}
              placeholder="Add a description for this gallery..."
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
              Password {gallery.password_hash ? '(Leave blank to keep current)' : '(Optional)'}
            </label>
            <input
              type="text"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
              style={{ color: '#1a1a1a', fontSize: '14px' }}
              placeholder={gallery.password_hash ? "Enter new password to change" : "Leave empty for no password"}
            />
            {gallery.password_hash && (
              <p className="text-xs text-gray-500 mt-2">
                This gallery currently has a password. Enter a new one to change it, or leave blank to keep current.
              </p>
            )}
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="w-5 h-5 border-gray-300"
            />
            <label htmlFor="is_public" className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
              Make this gallery public (visible without password)
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving || !formData.title.trim()}
            className="w-full bg-gray-900 px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider text-xs"
            style={{ color: '#ffffff' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 p-8">
        <h2 className="text-xl font-serif font-light text-red-900 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-red-700 mb-6">
          Once you delete a gallery, there is no going back. All photos and comments will be permanently deleted.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-white border-2 border-red-600 px-6 py-3 hover:bg-red-50 transition-colors font-bold uppercase tracking-wider text-sm"
            style={{ color: '#dc2626' }}
          >
            🗑️ DELETE GALLERY
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border border-red-300 p-4">
              <p className="text-sm font-medium text-red-900 mb-2">
                Are you absolutely sure?
              </p>
              <p className="text-sm text-red-700">
                This will permanently delete <strong>{gallery.title}</strong> and all of its photos.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 px-6 py-3 hover:bg-red-700 transition-colors disabled:opacity-50 font-medium uppercase tracking-wider text-xs"
                style={{ color: '#ffffff' }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-gray-200 px-6 py-3 hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium uppercase tracking-wider text-xs"
                style={{ color: '#1a1a1a' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
