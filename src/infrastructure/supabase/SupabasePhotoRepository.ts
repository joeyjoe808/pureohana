/**
 * Supabase Photo Repository Implementation
 *
 * Concrete implementation of IPhotoRepository using Supabase.
 * Handles both database operations and file storage.
 *
 * Single Responsibility: Supabase-specific photo data access and storage
 * Dependency Inversion: Implements abstract interface
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  IPhotoRepository,
  PhotoFilters,
  Photo,
  UploadPhotoInput,
  UpdatePhotoInput,
  MovePhotoInput,
  UploadProgress,
  UploadStatus,
  Result,
  tryCatch,
  DatabaseError,
  NotFoundError,
  StorageError,
  FileUploadError
} from '../../domain';

/**
 * Supabase implementation of photo repository
 */
export class SupabasePhotoRepository implements IPhotoRepository {
  private readonly TABLE = 'photos';
  private readonly BUCKET = 'photos';
  private readonly THUMBNAIL_BUCKET = 'thumbnails';

  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Result<Photo, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw new DatabaseError('Failed to fetch photo', error);
        if (!data) throw new NotFoundError('Photo', id);

        return this.mapToPhoto(data);
      },
      (error) => error as any
    );
  }

  async findByGallery(galleryId: string, filters?: PhotoFilters): Promise<Result<Photo[], any>> {
    return tryCatch(
      async () => {
        let query = this.supabase.from(this.TABLE).select('*').eq('gallery_id', galleryId);

        if (filters?.isPublished !== undefined) {
          query = query.eq('is_published', filters.isPublished);
        }

        const orderBy = filters?.orderBy || 'display_order';
        const orderDirection = filters?.orderDirection || 'asc';
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });

        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to fetch photos', error);

        return (data || []).map(this.mapToPhoto);
      },
      (error) => error as any
    );
  }

  async findAll(filters?: PhotoFilters): Promise<Result<Photo[], any>> {
    return tryCatch(
      async () => {
        let query = this.supabase.from(this.TABLE).select('*');

        if (filters?.isPublished !== undefined) {
          query = query.eq('is_published', filters.isPublished);
        }

        const orderBy = filters?.orderBy || 'uploaded_at';
        const orderDirection = filters?.orderDirection || 'desc';
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });

        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to fetch photos', error);

        return (data || []).map(this.mapToPhoto);
      },
      (error) => error as any
    );
  }

  async upload(
    input: UploadPhotoInput,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Result<Photo, any>> {
    return tryCatch(
      async () => {
        const { file, galleryId, title, description, displayOrder, metadata } = input;

        // Generate unique storage key
        const timestamp = Date.now();
        const storageKey = `${galleryId}/${timestamp}_${file.name}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await this.supabase.storage
          .from(this.BUCKET)
          .upload(storageKey, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new StorageError('upload', 'Failed to upload photo', uploadError);

        // Get public URL
        const { data: urlData } = this.supabase.storage
          .from(this.BUCKET)
          .getPublicUrl(storageKey);

        // Create photo record
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .insert([
            {
              gallery_id: galleryId,
              title,
              description: description || null,
              url: urlData.publicUrl,
              thumbnail_url: urlData.publicUrl, // Will be replaced by actual thumbnail
              storage_key: storageKey,
              width: 0, // To be updated by image processing
              height: 0,
              file_size: file.size,
              mime_type: file.type,
              display_order: displayOrder || 0,
              is_published: false,
              metadata: metadata || {}
            }
          ])
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to create photo record', error);

        return this.mapToPhoto(data);
      },
      (error) => error as any
    );
  }

  async update(id: string, input: UpdatePhotoInput): Promise<Result<Photo, any>> {
    return tryCatch(
      async () => {
        const updateData: any = {};
        if (input.title !== undefined) updateData.title = input.title;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;
        if (input.isPublished !== undefined) updateData.is_published = input.isPublished;
        if (input.metadata !== undefined) updateData.metadata = input.metadata;

        const { data, error } = await this.supabase
          .from(this.TABLE)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to update photo', error);
        if (!data) throw new NotFoundError('Photo', id);

        return this.mapToPhoto(data);
      },
      (error) => error as any
    );
  }

  async move(input: MovePhotoInput): Promise<Result<Photo, any>> {
    return tryCatch(
      async () => {
        const { photoId, targetGalleryId, displayOrder } = input;

        const updateData: any = {
          gallery_id: targetGalleryId
        };

        if (displayOrder !== undefined) {
          updateData.display_order = displayOrder;
        }

        const { data, error } = await this.supabase
          .from(this.TABLE)
          .update(updateData)
          .eq('id', photoId)
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to move photo', error);
        if (!data) throw new NotFoundError('Photo', photoId);

        return this.mapToPhoto(data);
      },
      (error) => error as any
    );
  }

  async delete(id: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        // Get photo to retrieve storage key
        const { data: photo, error: fetchError } = await this.supabase
          .from(this.TABLE)
          .select('storage_key')
          .eq('id', id)
          .single();

        if (fetchError) throw new DatabaseError('Failed to fetch photo', fetchError);
        if (!photo) throw new NotFoundError('Photo', id);

        // Delete from storage
        const { error: storageError } = await this.supabase.storage
          .from(this.BUCKET)
          .remove([photo.storage_key]);

        if (storageError) {
          console.error('Failed to delete photo from storage:', storageError);
          // Continue anyway - database cleanup is more important
        }

        // Delete from database
        const { error: dbError } = await this.supabase.from(this.TABLE).delete().eq('id', id);

        if (dbError) throw new DatabaseError('Failed to delete photo', dbError);
      },
      (error) => error as any
    );
  }

  async deleteBatch(ids: string[]): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        for (const id of ids) {
          await this.delete(id);
        }
      },
      (error) => error as any
    );
  }

  async reorder(galleryId: string, photoIds: string[]): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        const updates = photoIds.map((id, index) => ({
          id,
          display_order: index
        }));

        for (const update of updates) {
          const { error } = await this.supabase
            .from(this.TABLE)
            .update({ display_order: update.display_order })
            .eq('id', update.id)
            .eq('gallery_id', galleryId);

          if (error) throw new DatabaseError('Failed to reorder photos', error);
        }
      },
      (error) => error as any
    );
  }

  async getPhotoUrl(storageKey: string, expiresIn: number = 3600): Promise<Result<string, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase.storage
          .from(this.BUCKET)
          .createSignedUrl(storageKey, expiresIn);

        if (error) throw new StorageError('download', 'Failed to generate photo URL', error);

        return data.signedUrl;
      },
      (error) => error as any
    );
  }

  async getThumbnailUrl(storageKey: string, expiresIn: number = 3600): Promise<Result<string, any>> {
    return tryCatch(
      async () => {
        const thumbnailKey = `thumbnails/${storageKey}`;
        const { data, error } = await this.supabase.storage
          .from(this.THUMBNAIL_BUCKET)
          .createSignedUrl(thumbnailKey, expiresIn);

        if (error) {
          // Fallback to original photo if thumbnail doesn't exist
          return this.getPhotoUrl(storageKey, expiresIn);
        }

        return data.signedUrl;
      },
      (error) => error as any
    );
  }

  async generateThumbnail(photoId: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        // This would typically be handled by a Supabase Edge Function
        // or external image processing service
        // For now, we'll just mark it as a placeholder
        console.log(`Thumbnail generation for photo ${photoId} would be triggered here`);
      },
      (error) => error as any
    );
  }

  // ========================================================================
  // Private mapping methods
  // ========================================================================

  private mapToPhoto(data: any): Photo {
    return {
      id: data.id,
      galleryId: data.gallery_id,
      title: data.title,
      description: data.description,
      url: data.url,
      thumbnailUrl: data.thumbnail_url,
      storageKey: data.storage_key,
      width: data.width,
      height: data.height,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      displayOrder: data.display_order,
      isPublished: data.is_published,
      metadata: data.metadata || {},
      uploadedAt: new Date(data.uploaded_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}
