/**
 * Supabase Gallery Repository Implementation
 *
 * Concrete implementation of IGalleryRepository using Supabase.
 *
 * Single Responsibility: Supabase-specific gallery data access
 * Dependency Inversion: Implements abstract interface
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  IGalleryRepository,
  GalleryFilters,
  Gallery,
  GalleryWithPhotos,
  GallerySummary,
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryCategory,
  Result,
  success,
  failure,
  tryCatch,
  DatabaseError,
  NotFoundError,
  ConflictError,
  ValidationError
} from '../../domain';

/**
 * Supabase implementation of gallery repository
 */
export class SupabaseGalleryRepository implements IGalleryRepository {
  private readonly TABLE = 'galleries';

  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Result<Gallery, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw new DatabaseError('Failed to fetch gallery', error);
        if (!data) throw new NotFoundError('Gallery', id);

        return this.mapToGallery(data);
      },
      (error) => error as any
    );
  }

  async findBySlug(slug: string): Promise<Result<Gallery, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw new DatabaseError('Failed to fetch gallery', error);
        if (!data) throw new NotFoundError('Gallery', slug);

        return this.mapToGallery(data);
      },
      (error) => error as any
    );
  }

  async findByIdWithPhotos(id: string): Promise<Result<GalleryWithPhotos, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select(`
            *,
            photos:photos(
              id,
              url,
              thumbnail_url,
              title,
              display_order
            )
          `)
          .eq('id', id)
          .order('display_order', { foreignTable: 'photos', ascending: true })
          .single();

        if (error) throw new DatabaseError('Failed to fetch gallery with photos', error);
        if (!data) throw new NotFoundError('Gallery', id);

        return this.mapToGalleryWithPhotos(data);
      },
      (error) => error as any
    );
  }

  async findAll(filters?: GalleryFilters): Promise<Result<Gallery[], any>> {
    return tryCatch(
      async () => {
        let query = this.supabase.from(this.TABLE).select('*');

        // Apply filters
        if (filters?.category) {
          query = query.eq('category', filters.category);
        }
        if (filters?.isPublished !== undefined) {
          query = query.eq('is_published', filters.isPublished);
        }

        // Apply sorting
        const orderBy = filters?.orderBy || 'display_order';
        const orderDirection = filters?.orderDirection || 'asc';
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });

        // Apply pagination
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }
        if (filters?.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to fetch galleries', error);

        return (data || []).map(this.mapToGallery);
      },
      (error) => error as any
    );
  }

  async findAllSummaries(filters?: GalleryFilters): Promise<Result<GallerySummary[], any>> {
    return tryCatch(
      async () => {
        let query = this.supabase
          .from(this.TABLE)
          .select('id, title, slug, category, cover_photo_id, photo_count, is_published');

        // Apply filters
        if (filters?.category) {
          query = query.eq('category', filters.category);
        }
        if (filters?.isPublished !== undefined) {
          query = query.eq('is_published', filters.isPublished);
        }

        // Apply sorting and pagination
        const orderBy = filters?.orderBy || 'display_order';
        const orderDirection = filters?.orderDirection || 'asc';
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });

        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to fetch gallery summaries', error);

        return (data || []).map(this.mapToGallerySummary);
      },
      (error) => error as any
    );
  }

  async findByCategory(category: GalleryCategory): Promise<Result<Gallery[], any>> {
    return this.findAll({ category, isPublished: true });
  }

  async create(input: CreateGalleryInput): Promise<Result<Gallery, any>> {
    return tryCatch(
      async () => {
        // Check slug availability
        const slugAvailable = await this.isSlugAvailable(input.slug);
        if (!slugAvailable.success || !slugAvailable.value) {
          throw new ConflictError(`Gallery with slug '${input.slug}' already exists`, 'slug');
        }

        const { data, error } = await this.supabase
          .from(this.TABLE)
          .insert([
            {
              title: input.title,
              slug: input.slug,
              description: input.description,
              category: input.category,
              display_order: input.displayOrder || 0,
              is_published: input.isPublished || false,
              photo_count: 0
            }
          ])
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to create gallery', error);

        return this.mapToGallery(data);
      },
      (error) => error as any
    );
  }

  async update(id: string, input: UpdateGalleryInput): Promise<Result<Gallery, any>> {
    return tryCatch(
      async () => {
        // Check slug availability if slug is being updated
        if (input.slug) {
          const slugAvailable = await this.isSlugAvailable(input.slug, id);
          if (!slugAvailable.success || !slugAvailable.value) {
            throw new ConflictError(`Gallery with slug '${input.slug}' already exists`, 'slug');
          }
        }

        const updateData: any = {};
        if (input.title !== undefined) updateData.title = input.title;
        if (input.slug !== undefined) updateData.slug = input.slug;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.category !== undefined) updateData.category = input.category;
        if (input.coverPhotoId !== undefined) updateData.cover_photo_id = input.coverPhotoId;
        if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;
        if (input.isPublished !== undefined) updateData.is_published = input.isPublished;

        const { data, error } = await this.supabase
          .from(this.TABLE)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to update gallery', error);
        if (!data) throw new NotFoundError('Gallery', id);

        return this.mapToGallery(data);
      },
      (error) => error as any
    );
  }

  async delete(id: string, deletePhotos: boolean = false): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        if (deletePhotos) {
          // Delete all photos first (this should cascade in DB, but being explicit)
          await this.supabase.from('photos').delete().eq('gallery_id', id);
        }

        const { error } = await this.supabase.from(this.TABLE).delete().eq('id', id);

        if (error) throw new DatabaseError('Failed to delete gallery', error);
      },
      (error) => error as any
    );
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<Result<boolean, any>> {
    return tryCatch(
      async () => {
        let query = this.supabase.from(this.TABLE).select('id').eq('slug', slug);

        if (excludeId) {
          query = query.neq('id', excludeId);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to check slug availability', error);

        return !data || data.length === 0;
      },
      (error) => error as any
    );
  }

  async updatePhotoCount(id: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        // Count photos in gallery
        const { count, error: countError } = await this.supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .eq('gallery_id', id);

        if (countError) throw new DatabaseError('Failed to count photos', countError);

        // Update gallery photo count
        const { error: updateError } = await this.supabase
          .from(this.TABLE)
          .update({ photo_count: count || 0 })
          .eq('id', id);

        if (updateError) throw new DatabaseError('Failed to update photo count', updateError);
      },
      (error) => error as any
    );
  }

  async reorder(galleryIds: string[]): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        // Update display_order for each gallery
        const updates = galleryIds.map((id, index) => ({
          id,
          display_order: index
        }));

        for (const update of updates) {
          const { error } = await this.supabase
            .from(this.TABLE)
            .update({ display_order: update.display_order })
            .eq('id', update.id);

          if (error) throw new DatabaseError('Failed to reorder galleries', error);
        }
      },
      (error) => error as any
    );
  }

  // ========================================================================
  // Private mapping methods
  // ========================================================================

  private mapToGallery(data: any): Gallery {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category as GalleryCategory,
      coverPhotoId: data.cover_photo_id,
      displayOrder: data.display_order,
      isPublished: data.is_published,
      photoCount: data.photo_count,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapToGalleryWithPhotos(data: any): GalleryWithPhotos {
    return {
      ...this.mapToGallery(data),
      photos: (data.photos || []).map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        thumbnailUrl: photo.thumbnail_url,
        title: photo.title,
        displayOrder: photo.display_order
      }))
    };
  }

  private mapToGallerySummary(data: any): GallerySummary {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      category: data.category as GalleryCategory,
      coverPhotoUrl: data.cover_photo_url || null,
      photoCount: data.photo_count,
      isPublished: data.is_published
    };
  }
}
