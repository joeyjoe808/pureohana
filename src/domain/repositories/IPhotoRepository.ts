/**
 * Photo Repository Interface
 *
 * Abstraction for photo data access and storage operations.
 * Handles both metadata (database) and file storage (Supabase Storage).
 *
 * Single Responsibility: Photo data access contract
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */

import { Result } from '../core/Result';
import { AppError } from '../core/errors';
import {
  Photo,
  UploadPhotoInput,
  UpdatePhotoInput,
  MovePhotoInput,
  UploadProgress
} from '../models/Photo';

/**
 * Photo repository interface
 */
export interface IPhotoRepository {
  /**
   * Find photo by ID
   */
  findById(id: string): Promise<Result<Photo, AppError>>;

  /**
   * Find all photos in a gallery
   */
  findByGallery(galleryId: string, filters?: PhotoFilters): Promise<Result<Photo[], AppError>>;

  /**
   * Find all photos (with optional filters)
   */
  findAll(filters?: PhotoFilters): Promise<Result<Photo[], AppError>>;

  /**
   * Upload a new photo
   * Handles both file upload and metadata creation
   */
  upload(
    input: UploadPhotoInput,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Result<Photo, AppError>>;

  /**
   * Update photo metadata
   */
  update(id: string, input: UpdatePhotoInput): Promise<Result<Photo, AppError>>;

  /**
   * Move photo to different gallery
   */
  move(input: MovePhotoInput): Promise<Result<Photo, AppError>>;

  /**
   * Delete photo (removes both metadata and file)
   */
  delete(id: string): Promise<Result<void, AppError>>;

  /**
   * Delete multiple photos in batch
   */
  deleteBatch(ids: string[]): Promise<Result<void, AppError>>;

  /**
   * Reorder photos within a gallery
   */
  reorder(galleryId: string, photoIds: string[]): Promise<Result<void, AppError>>;

  /**
   * Get photo URL (signed URL for private photos)
   */
  getPhotoUrl(storageKey: string, expiresIn?: number): Promise<Result<string, AppError>>;

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(storageKey: string, expiresIn?: number): Promise<Result<string, AppError>>;

  /**
   * Generate thumbnail from original photo
   */
  generateThumbnail(photoId: string): Promise<Result<void, AppError>>;
}

/**
 * Photo query filters
 */
export interface PhotoFilters {
  isPublished?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'uploaded_at' | 'updated_at' | 'title' | 'display_order';
  orderDirection?: 'asc' | 'desc';
  tags?: string[];
}
