/**
 * Dependency Injection Container
 *
 * Central registry for all repository implementations.
 * Follows Dependency Inversion Principle - components depend on abstractions.
 *
 * Single Responsibility: Manage dependency lifecycle and injection
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  IGalleryRepository,
  IPhotoRepository,
  IInquiryRepository
} from '../domain';
import {
  SupabaseGalleryRepository,
  SupabasePhotoRepository,
  SupabaseInquiryRepository
} from './supabase';

/**
 * Container for all application dependencies
 */
export class Container {
  private static instance: Container;
  private supabaseClient: SupabaseClient;

  // Repository instances (singletons)
  private galleryRepository?: IGalleryRepository;
  private photoRepository?: IPhotoRepository;
  private inquiryRepository?: IInquiryRepository;

  private constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  }

  /**
   * Initialize the container (call once at app startup)
   */
  static initialize(supabaseUrl: string, supabaseKey: string): Container {
    if (!Container.instance) {
      Container.instance = new Container(supabaseUrl, supabaseKey);
    }
    return Container.instance;
  }

  /**
   * Get container instance
   */
  static getInstance(): Container {
    if (!Container.instance) {
      throw new Error(
        'Container not initialized. Call Container.initialize() first.'
      );
    }
    return Container.instance;
  }

  /**
   * Get Supabase client (for direct access if needed)
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Get gallery repository
   */
  getGalleryRepository(): IGalleryRepository {
    if (!this.galleryRepository) {
      this.galleryRepository = new SupabaseGalleryRepository(this.supabaseClient);
    }
    return this.galleryRepository;
  }

  /**
   * Get photo repository
   */
  getPhotoRepository(): IPhotoRepository {
    if (!this.photoRepository) {
      this.photoRepository = new SupabasePhotoRepository(this.supabaseClient);
    }
    return this.photoRepository;
  }

  /**
   * Get inquiry repository
   */
  getInquiryRepository(): IInquiryRepository {
    if (!this.inquiryRepository) {
      this.inquiryRepository = new SupabaseInquiryRepository(this.supabaseClient);
    }
    return this.inquiryRepository;
  }

  /**
   * Reset all repositories (useful for testing)
   */
  reset(): void {
    this.galleryRepository = undefined;
    this.photoRepository = undefined;
    this.inquiryRepository = undefined;
  }
}

/**
 * Convenience function to get container instance
 */
export const getContainer = (): Container => Container.getInstance();

/**
 * Convenience functions to get repositories
 */
export const useGalleryRepository = (): IGalleryRepository =>
  getContainer().getGalleryRepository();

export const usePhotoRepository = (): IPhotoRepository =>
  getContainer().getPhotoRepository();

export const useInquiryRepository = (): IInquiryRepository =>
  getContainer().getInquiryRepository();
