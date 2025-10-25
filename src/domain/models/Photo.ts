/**
 * Photo Domain Model
 *
 * Represents a single photo entity with strategic placement capabilities.
 * Photos can be moved between galleries while maintaining metadata.
 *
 * Single Responsibility: Photo entity and related types
 */

/**
 * Photo entity
 */
export interface Photo {
  readonly id: string;
  readonly galleryId: string;
  readonly title: string;
  readonly description: string | null;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly storageKey: string; // Supabase storage key
  readonly width: number;
  readonly height: number;
  readonly fileSize: number; // in bytes
  readonly mimeType: string;
  readonly displayOrder: number;
  readonly isPublished: boolean;
  readonly metadata: PhotoMetadata;
  readonly uploadedAt: Date;
  readonly updatedAt: Date;
}

/**
 * Photo metadata (EXIF and custom data)
 */
export interface PhotoMetadata {
  readonly camera?: string;
  readonly lens?: string;
  readonly focalLength?: string;
  readonly aperture?: string;
  readonly shutterSpeed?: string;
  readonly iso?: number;
  readonly capturedAt?: Date;
  readonly location?: string;
  readonly tags?: ReadonlyArray<string>;
  readonly altText?: string; // For accessibility
}

/**
 * Input for uploading a new photo
 */
export interface UploadPhotoInput {
  galleryId: string;
  file: File;
  title: string;
  description?: string;
  displayOrder?: number;
  metadata?: Partial<PhotoMetadata>;
}

/**
 * Input for updating photo details
 */
export interface UpdatePhotoInput {
  title?: string;
  description?: string | null;
  displayOrder?: number;
  isPublished?: boolean;
  metadata?: Partial<PhotoMetadata>;
}

/**
 * Input for moving photo to different gallery
 */
export interface MovePhotoInput {
  photoId: string;
  targetGalleryId: string;
  displayOrder?: number;
}

/**
 * Supported image formats
 */
export enum ImageFormat {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  HEIC = 'image/heic'
}

/**
 * Photo upload progress
 */
export interface UploadProgress {
  readonly photoId: string;
  readonly fileName: string;
  readonly bytesUploaded: number;
  readonly totalBytes: number;
  readonly percentage: number;
  readonly status: UploadStatus;
}

/**
 * Upload status enum
 */
export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
