/**
 * Gallery Repository Interface
 *
 * Abstraction for gallery data access operations.
 * Implementations can use Supabase, REST API, or mock data.
 *
 * Single Responsibility: Gallery data access contract
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */

import { Result } from '../core/Result';
import { AppError } from '../core/errors';
import {
  Gallery,
  GalleryWithPhotos,
  GallerySummary,
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryCategory
} from '../models/Gallery';

/**
 * Gallery repository interface
 */
export interface IGalleryRepository {
  /**
   * Find gallery by ID
   */
  findById(id: string): Promise<Result<Gallery, AppError>>;

  /**
   * Find gallery by slug
   */
  findBySlug(slug: string): Promise<Result<Gallery, AppError>>;

  /**
   * Find gallery with all photos populated
   */
  findByIdWithPhotos(id: string): Promise<Result<GalleryWithPhotos, AppError>>;

  /**
   * Find all galleries (with optional filters)
   */
  findAll(filters?: GalleryFilters): Promise<Result<Gallery[], AppError>>;

  /**
   * Find all gallery summaries (optimized for list views)
   */
  findAllSummaries(filters?: GalleryFilters): Promise<Result<GallerySummary[], AppError>>;

  /**
   * Find galleries by category
   */
  findByCategory(category: GalleryCategory): Promise<Result<Gallery[], AppError>>;

  /**
   * Create a new gallery
   */
  create(input: CreateGalleryInput): Promise<Result<Gallery, AppError>>;

  /**
   * Update an existing gallery
   */
  update(id: string, input: UpdateGalleryInput): Promise<Result<Gallery, AppError>>;

  /**
   * Delete a gallery (and optionally its photos)
   */
  delete(id: string, deletePhotos?: boolean): Promise<Result<void, AppError>>;

  /**
   * Check if slug is available
   */
  isSlugAvailable(slug: string, excludeId?: string): Promise<Result<boolean, AppError>>;

  /**
   * Update gallery photo count (internal use)
   */
  updatePhotoCount(id: string): Promise<Result<void, AppError>>;

  /**
   * Reorder galleries
   */
  reorder(galleryIds: string[]): Promise<Result<void, AppError>>;
}

/**
 * Gallery query filters
 */
export interface GalleryFilters {
  category?: GalleryCategory;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'title' | 'display_order';
  orderDirection?: 'asc' | 'desc';
}
