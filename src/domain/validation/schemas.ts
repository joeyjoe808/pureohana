/**
 * Validation Schemas using Zod
 *
 * Comprehensive validation for all domain entities and inputs.
 * Provides runtime type safety and detailed error messages.
 *
 * Single Responsibility: Input validation schemas
 */

import { z } from 'zod';
import {
  GalleryCategory,
  InquiryType,
  InquiryStatus,
  InquirySource,
  SubscriberStatus,
  SubscriptionSource,
  EmailFrequency,
  AdminRole,
  ImageFormat
} from '../models';

// ============================================================================
// Gallery Schemas
// ============================================================================

export const GalleryCategorySchema = z.nativeEnum(GalleryCategory);

export const CreateGallerySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less'),
  category: GalleryCategorySchema,
  displayOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional()
});

export const UpdateGallerySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be 200 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  category: GalleryCategorySchema.optional(),
  coverPhotoId: z.string().uuid().nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional()
});

// ============================================================================
// Photo Schemas
// ============================================================================

export const ImageFormatSchema = z.nativeEnum(ImageFormat);

export const PhotoMetadataSchema = z.object({
  camera: z.string().optional(),
  lens: z.string().optional(),
  focalLength: z.string().optional(),
  aperture: z.string().optional(),
  shutterSpeed: z.string().optional(),
  iso: z.number().int().min(0).max(409600).optional(),
  capturedAt: z.date().optional(),
  location: z.string().max(200).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  altText: z.string().max(200).optional()
}).optional();

export const UpdatePhotoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .nullable()
    .optional(),
  displayOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  metadata: PhotoMetadataSchema
});

export const MovePhotoSchema = z.object({
  photoId: z.string().uuid('Invalid photo ID'),
  targetGalleryId: z.string().uuid('Invalid gallery ID'),
  displayOrder: z.number().int().min(0).optional()
});

// File validation helper
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

// ============================================================================
// Inquiry Schemas
// ============================================================================

export const InquiryTypeSchema = z.nativeEnum(InquiryType);
export const InquiryStatusSchema = z.nativeEnum(InquiryStatus);
export const InquirySourceSchema = z.nativeEnum(InquirySource);

export const InquiryMetadataSchema = z.object({
  eventDate: z.date().optional(),
  eventLocation: z.string().max(200).optional(),
  guestCount: z.number().int().min(1).max(10000).optional(),
  budget: z.string().max(100).optional(),
  referralSource: z.string().max(200).optional(),
  preferredContactMethod: z.enum(['email', 'phone', 'either']).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional()
}).optional();

export const CreateInquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  phone: z.string()
    .max(20, 'Phone must be 20 characters or less')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .optional(),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be 200 characters or less'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or less'),
  inquiryType: InquiryTypeSchema,
  source: InquirySourceSchema.optional(),
  metadata: InquiryMetadataSchema
});

export const UpdateInquirySchema = z.object({
  status: InquiryStatusSchema.optional(),
  respondedAt: z.date().optional(),
  resolvedAt: z.date().optional()
});

// ============================================================================
// Newsletter Schemas
// ============================================================================

export const SubscriberStatusSchema = z.nativeEnum(SubscriberStatus);
export const SubscriptionSourceSchema = z.nativeEnum(SubscriptionSource);
export const EmailFrequencySchema = z.nativeEnum(EmailFrequency);

export const SubscriberPreferencesSchema = z.object({
  frequency: EmailFrequencySchema.optional(),
  categories: z.array(z.string()).max(20).optional(),
  htmlEmails: z.boolean().optional()
}).optional();

export const CreateSubscriberSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  source: SubscriptionSourceSchema.optional(),
  preferences: SubscriberPreferencesSchema
});

export const UpdateSubscriberSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  status: SubscriberStatusSchema.optional(),
  preferences: SubscriberPreferencesSchema
});

// ============================================================================
// Admin Schemas
// ============================================================================

export const AdminRoleSchema = z.nativeEnum(AdminRole);

export const LoginCredentialsSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
});

export const CreateAdminSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or less')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  role: AdminRoleSchema,
  isActive: z.boolean().optional()
});

export const UpdateAdminSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less')
    .optional(),
  role: AdminRoleSchema.optional(),
  isActive: z.boolean().optional()
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be 128 characters or less')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    )
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate input against schema and return typed result
 */
export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into field-specific messages
  const errors: Record<string, string[]> = {};

  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(error.message);
  });

  return { success: false, errors };
};
