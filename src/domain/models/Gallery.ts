/**
 * Gallery Domain Model
 *
 * Represents a photo gallery collection with strategic photo management.
 * Owner can swap photos strategically without changing gallery structure.
 *
 * Single Responsibility: Gallery entity and related types
 */

/**
 * Gallery entity representing a collection of photos
 */
export interface Gallery {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly category: GalleryCategory;
  readonly coverPhotoId: string | null;
  readonly displayOrder: number;
  readonly isPublished: boolean;
  readonly photoCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Gallery categories for organization
 */
export enum GalleryCategory {
  WEDDING = 'wedding',
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  EVENT = 'event',
  COMMERCIAL = 'commercial',
  PERSONAL = 'personal'
}

/**
 * Input for creating a new gallery
 */
export interface CreateGalleryInput {
  title: string;
  slug: string;
  description: string;
  category: GalleryCategory;
  displayOrder?: number;
  isPublished?: boolean;
}

/**
 * Input for updating an existing gallery
 */
export interface UpdateGalleryInput {
  title?: string;
  slug?: string;
  description?: string;
  category?: GalleryCategory;
  coverPhotoId?: string | null;
  displayOrder?: number;
  isPublished?: boolean;
}

/**
 * Gallery with populated photos (for display)
 */
export interface GalleryWithPhotos extends Gallery {
  readonly photos: ReadonlyArray<{
    id: string;
    url: string;
    thumbnailUrl: string;
    title: string;
    displayOrder: number;
  }>;
}

/**
 * Gallery summary for list views
 */
export interface GallerySummary {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly category: GalleryCategory;
  readonly coverPhotoUrl: string | null;
  readonly photoCount: number;
  readonly isPublished: boolean;
}
