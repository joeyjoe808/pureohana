/**
 * Gallery Repository Usage Examples
 *
 * Demonstrates how to use the gallery repository in React components
 * following clean architecture principles.
 */

import React, { useEffect, useState } from 'react';
import {
  Gallery,
  GallerySummary,
  GalleryCategory,
  CreateGalleryInput,
  UpdateGalleryInput,
  isSuccess,
  isFailure,
  ValidationError,
  NotFoundError,
  CreateGallerySchema,
  validate
} from '../domain';
import { useGalleryRepository } from '../infrastructure/container';

/**
 * Example 1: Fetch and Display Gallery List
 */
export const GalleryList: React.FC = () => {
  const [galleries, setGalleries] = useState<GallerySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const galleryRepo = useGalleryRepository();

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      setError(null);

      // Fetch only published galleries, ordered by display order
      const result = await galleryRepo.findAllSummaries({
        isPublished: true,
        orderBy: 'display_order',
        orderDirection: 'asc'
      });

      if (isSuccess(result)) {
        setGalleries(result.value);
      } else {
        setError(result.error.message);
        console.error('Failed to fetch galleries:', result.error);
      }

      setLoading(false);
    };

    fetchGalleries();
  }, []);

  if (loading) return <div>Loading galleries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gallery-grid">
      {galleries.map((gallery) => (
        <div key={gallery.id} className="gallery-card">
          <h3>{gallery.title}</h3>
          <p>{gallery.category}</p>
          <p>{gallery.photoCount} photos</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 2: Fetch Gallery with Photos
 */
export const GalleryDetail: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const galleryRepo = useGalleryRepository();

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      setError(null);

      // First get gallery by slug
      const galleryResult = await galleryRepo.findBySlug(gallerySlug);

      if (isFailure(galleryResult)) {
        if (galleryResult.error instanceof NotFoundError) {
          setError('Gallery not found');
        } else {
          setError(galleryResult.error.message);
        }
        setLoading(false);
        return;
      }

      // Then fetch with photos
      const withPhotosResult = await galleryRepo.findByIdWithPhotos(
        galleryResult.value.id
      );

      if (isSuccess(withPhotosResult)) {
        setGallery(withPhotosResult.value);
      } else {
        setError(withPhotosResult.error.message);
      }

      setLoading(false);
    };

    fetchGallery();
  }, [gallerySlug]);

  if (loading) return <div>Loading gallery...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gallery) return null;

  return (
    <div>
      <h1>{gallery.title}</h1>
      <p>{gallery.description}</p>
      <div className="photo-grid">
        {gallery.photos.map((photo: any) => (
          <img
            key={photo.id}
            src={photo.thumbnailUrl}
            alt={photo.title}
            className="gallery-photo"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Example 3: Create New Gallery (Admin)
 */
export const CreateGalleryForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateGalleryInput>({
    title: '',
    slug: '',
    description: '',
    category: GalleryCategory.WEDDING,
    isPublished: false
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const galleryRepo = useGalleryRepository();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input using Zod schema
    const validation = validate(CreateGallerySchema, formData);

    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    setSubmitting(true);

    // Create gallery
    const result = await galleryRepo.create(validation.data);

    if (isSuccess(result)) {
      setSuccess(true);
      console.log('Gallery created:', result.value);

      // Reset form
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: GalleryCategory.WEDDING,
        isPublished: false
      });
    } else {
      // Handle error
      if (result.error instanceof ValidationError) {
        setValidationErrors(result.error.fields || {});
      } else {
        alert(`Error: ${result.error.message}`);
      }
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="success">Gallery created successfully!</div>}

      <div>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {validationErrors.title && (
          <span className="error">{validationErrors.title[0]}</span>
        )}
      </div>

      <div>
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
        {validationErrors.slug && (
          <span className="error">{validationErrors.slug[0]}</span>
        )}
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        {validationErrors.description && (
          <span className="error">{validationErrors.description[0]}</span>
        )}
      </div>

      <div>
        <label>Category</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as GalleryCategory })
          }
        >
          {Object.values(GalleryCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
          />
          Published
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Gallery'}
      </button>
    </form>
  );
};

/**
 * Example 4: Update Gallery (Admin)
 */
export const UpdateGalleryForm: React.FC<{ galleryId: string }> = ({ galleryId }) => {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [updateData, setUpdateData] = useState<UpdateGalleryInput>({});
  const [submitting, setSubmitting] = useState(false);

  const galleryRepo = useGalleryRepository();

  useEffect(() => {
    // Fetch current gallery data
    const fetchGallery = async () => {
      const result = await galleryRepo.findById(galleryId);
      if (isSuccess(result)) {
        setGallery(result.value);
        setUpdateData({
          title: result.value.title,
          description: result.value.description,
          isPublished: result.value.isPublished
        });
      }
    };

    fetchGallery();
  }, [galleryId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await galleryRepo.update(galleryId, updateData);

    if (isSuccess(result)) {
      setGallery(result.value);
      alert('Gallery updated successfully!');
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setSubmitting(false);
  };

  if (!gallery) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={updateData.title || ''}
          onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
        />
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
        {submitting ? 'Updating...' : 'Update Gallery'}
      </button>
    </form>
  );
};

/**
 * Example 5: Delete Gallery with Confirmation (Admin)
 */
export const DeleteGalleryButton: React.FC<{
  galleryId: string;
  onDeleted: () => void;
}> = ({ galleryId, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const galleryRepo = useGalleryRepository();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gallery?')) {
      return;
    }

    const deletePhotos = confirm(
      'Do you also want to delete all photos in this gallery?'
    );

    setDeleting(true);

    const result = await galleryRepo.delete(galleryId, deletePhotos);

    if (isSuccess(result)) {
      alert('Gallery deleted successfully!');
      onDeleted();
    } else {
      alert(`Error: ${result.error.message}`);
    }

    setDeleting(false);
  };

  return (
    <button onClick={handleDelete} disabled={deleting} className="btn-danger">
      {deleting ? 'Deleting...' : 'Delete Gallery'}
    </button>
  );
};
