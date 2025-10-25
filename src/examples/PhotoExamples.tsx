/**
 * Photo Repository Usage Examples
 *
 * Demonstrates photo upload, management, and strategic photo swapping.
 */

import React, { useState } from 'react';
import {
  Photo,
  UploadPhotoInput,
  UpdatePhotoInput,
  MovePhotoInput,
  UploadProgress,
  isSuccess,
  validateImageFile,
  UpdatePhotoSchema,
  validate
} from '../domain';
import { usePhotoRepository, useGalleryRepository } from '../infrastructure/container';

/**
 * Example 1: Photo Upload with Progress
 */
export const PhotoUploadForm: React.FC<{ galleryId: string }> = ({ galleryId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<Photo | null>(null);

  const photoRepo = usePhotoRepository();
  const galleryRepo = useGalleryRepository();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setFile(selectedFile);
    // Auto-populate title from filename
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    const input: UploadPhotoInput = {
      galleryId,
      file,
      title,
      description: description || undefined
    };

    const result = await photoRepo.upload(input, (progress) => {
      setProgress(progress);
    });

    if (isSuccess(result)) {
      setUploadedPhoto(result.value);
      alert('Photo uploaded successfully!');

      // Update gallery photo count
      await galleryRepo.updatePhotoCount(galleryId);

      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
    } else {
      alert(`Upload failed: ${result.error.message}`);
    }

    setUploading(false);
    setProgress(null);
  };

  return (
    <form onSubmit={handleUpload}>
      <div>
        <label>Select Photo</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {file && <p>Selected: {file.name}</p>}
      </div>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {progress && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          >
            {progress.percentage.toFixed(0)}%
          </div>
          <p>{progress.status}</p>
        </div>
      )}

      <button type="submit" disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>

      {uploadedPhoto && (
        <div className="success">
          <p>Photo uploaded!</p>
          <img src={uploadedPhoto.thumbnailUrl} alt={uploadedPhoto.title} />
        </div>
      )}
    </form>
  );
};

/**
 * Example 2: Update Photo Metadata
 */
export const PhotoEditForm: React.FC<{ photoId: string }> = ({ photoId }) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [updateData, setUpdateData] = useState<UpdatePhotoInput>({});
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const photoRepo = usePhotoRepository();

  React.useEffect(() => {
    const fetchPhoto = async () => {
      const result = await photoRepo.findById(photoId);
      if (isSuccess(result)) {
        setPhoto(result.value);
        setUpdateData({
          title: result.value.title,
          description: result.value.description || '',
          isPublished: result.value.isPublished
        });
      }
    };

    fetchPhoto();
  }, [photoId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validation = validate(UpdatePhotoSchema, updateData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    const result = await photoRepo.update(photoId, validation.data);

    if (isSuccess(result)) {
      setPhoto(result.value);
      alert('Photo updated successfully!');
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setSubmitting(false);
  };

  if (!photo) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate}>
      <div>
        <img src={photo.thumbnailUrl} alt={photo.title} style={{ maxWidth: '300px' }} />
      </div>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={updateData.title || ''}
          onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
        />
        {errors.title && <span className="error">{errors.title[0]}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={updateData.description || ''}
          onChange={(e) =>
            setUpdateData({ ...updateData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={updateData.isPublished || false}
            onChange={(e) =>
              setUpdateData({ ...updateData, isPublished: e.target.checked })
            }
          />
          Published
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Updating...' : 'Update Photo'}
      </button>
    </form>
  );
};

/**
 * Example 3: Strategic Photo Swapping - Move Photo Between Galleries
 */
export const MovePhotoForm: React.FC<{
  photoId: string;
  currentGalleryId: string;
  onMoved: () => void;
}> = ({ photoId, currentGalleryId, onMoved }) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [targetGalleryId, setTargetGalleryId] = useState('');
  const [moving, setMoving] = useState(false);

  const photoRepo = usePhotoRepository();
  const galleryRepo = useGalleryRepository();

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch photo
      const photoResult = await photoRepo.findById(photoId);
      if (isSuccess(photoResult)) {
        setPhoto(photoResult.value);
      }

      // Fetch available galleries
      const galleriesResult = await galleryRepo.findAll();
      if (isSuccess(galleriesResult)) {
        // Filter out current gallery
        const available = galleriesResult.value.filter(
          (g) => g.id !== currentGalleryId
        );
        setGalleries(available);
      }
    };

    fetchData();
  }, [photoId, currentGalleryId]);

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetGalleryId) {
      alert('Please select a target gallery');
      return;
    }

    setMoving(true);

    const input: MovePhotoInput = {
      photoId,
      targetGalleryId
    };

    const result = await photoRepo.move(input);

    if (isSuccess(result)) {
      // Update photo counts for both galleries
      await galleryRepo.updatePhotoCount(currentGalleryId);
      await galleryRepo.updatePhotoCount(targetGalleryId);

      alert('Photo moved successfully!');
      onMoved();
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setMoving(false);
  };

  if (!photo) return <div>Loading...</div>;

  return (
    <form onSubmit={handleMove}>
      <h3>Move Photo</h3>

      <div>
        <img src={photo.thumbnailUrl} alt={photo.title} style={{ maxWidth: '200px' }} />
        <p>{photo.title}</p>
      </div>

      <div>
        <label>Move to Gallery:</label>
        <select
          value={targetGalleryId}
          onChange={(e) => setTargetGalleryId(e.target.value)}
          required
        >
          <option value="">-- Select Gallery --</option>
          {galleries.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.title} ({gallery.photoCount} photos)
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={moving || !targetGalleryId}>
        {moving ? 'Moving...' : 'Move Photo'}
      </button>
    </form>
  );
};

/**
 * Example 4: Drag-and-Drop Photo Reordering
 */
export const PhotoReorderList: React.FC<{ galleryId: string }> = ({ galleryId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [saving, setSaving] = useState(false);

  const photoRepo = usePhotoRepository();

  React.useEffect(() => {
    const fetchPhotos = async () => {
      const result = await photoRepo.findByGallery(galleryId, {
        orderBy: 'display_order',
        orderDirection: 'asc'
      });

      if (isSuccess(result)) {
        setPhotos(result.value);
      }
    };

    fetchPhotos();
  }, [galleryId]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, removed);
    setPhotos(newPhotos);
  };

  const saveOrder = async () => {
    setSaving(true);

    const photoIds = photos.map((p) => p.id);
    const result = await photoRepo.reorder(galleryId, photoIds);

    if (isSuccess(result)) {
      alert('Photo order saved!');
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setSaving(false);
  };

  return (
    <div>
      <h3>Reorder Photos</h3>

      <div className="photo-list">
        {photos.map((photo, index) => (
          <div key={photo.id} className="photo-item" draggable>
            <span>{index + 1}</span>
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>

      <button onClick={saveOrder} disabled={saving}>
        {saving ? 'Saving...' : 'Save Order'}
      </button>
    </div>
  );
};

/**
 * Example 5: Batch Photo Delete
 */
export const BatchPhotoDelete: React.FC<{
  galleryId: string;
  onDeleted: () => void;
}> = ({ galleryId, onDeleted }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const photoRepo = usePhotoRepository();
  const galleryRepo = useGalleryRepository();

  React.useEffect(() => {
    const fetchPhotos = async () => {
      const result = await photoRepo.findByGallery(galleryId);
      if (isSuccess(result)) {
        setPhotos(result.value);
      }
    };

    fetchPhotos();
  }, [galleryId]);

  const toggleSelection = (photoId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) {
      alert('No photos selected');
      return;
    }

    if (!confirm(`Delete ${selectedIds.size} photos?`)) {
      return;
    }

    setDeleting(true);

    const result = await photoRepo.deleteBatch(Array.from(selectedIds));

    if (isSuccess(result)) {
      // Update gallery photo count
      await galleryRepo.updatePhotoCount(galleryId);

      alert('Photos deleted successfully!');
      setSelectedIds(new Set());
      onDeleted();
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setDeleting(false);
  };

  return (
    <div>
      <h3>Select Photos to Delete</h3>

      <div className="photo-grid">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`photo-item ${selectedIds.has(photo.id) ? 'selected' : ''}`}
            onClick={() => toggleSelection(photo.id)}
          >
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
            {selectedIds.has(photo.id) && <span className="checkmark">✓</span>}
          </div>
        ))}
      </div>

      <button
        onClick={handleBatchDelete}
        disabled={deleting || selectedIds.size === 0}
        className="btn-danger"
      >
        {deleting ? 'Deleting...' : `Delete ${selectedIds.size} Photos`}
      </button>
    </div>
  );
};
