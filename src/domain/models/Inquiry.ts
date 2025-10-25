/**
 * Inquiry Domain Model
 *
 * Represents customer inquiries with email integration.
 * Supports hot link integration for immediate notifications.
 *
 * Single Responsibility: Inquiry entity and related types
 */

/**
 * Inquiry entity
 */
export interface Inquiry {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly subject: string;
  readonly message: string;
  readonly inquiryType: InquiryType;
  readonly status: InquiryStatus;
  readonly source: InquirySource;
  readonly metadata: InquiryMetadata;
  readonly submittedAt: Date;
  readonly respondedAt: Date | null;
  readonly resolvedAt: Date | null;
}

/**
 * Types of inquiries
 */
export enum InquiryType {
  WEDDING = 'wedding',
  PORTRAIT = 'portrait',
  EVENT = 'event',
  COMMERCIAL = 'commercial',
  GENERAL = 'general',
  BOOKING = 'booking'
}

/**
 * Inquiry status tracking
 */
export enum InquiryStatus {
  NEW = 'new',
  READ = 'read',
  IN_PROGRESS = 'in_progress',
  RESPONDED = 'responded',
  RESOLVED = 'resolved',
  SPAM = 'spam'
}

/**
 * Source of the inquiry
 */
export enum InquirySource {
  WEBSITE_CONTACT = 'website_contact',
  WEBSITE_BOOKING = 'website_booking',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  DIRECT = 'direct'
}

/**
 * Additional inquiry metadata
 */
export interface InquiryMetadata {
  readonly eventDate?: Date;
  readonly eventLocation?: string;
  readonly guestCount?: number;
  readonly budget?: string;
  readonly referralSource?: string;
  readonly preferredContactMethod?: 'email' | 'phone' | 'either';
  readonly userAgent?: string;
  readonly ipAddress?: string;
}

/**
 * Input for creating a new inquiry
 */
export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: InquiryType;
  source?: InquirySource;
  metadata?: Partial<InquiryMetadata>;
}

/**
 * Input for updating inquiry status
 */
export interface UpdateInquiryInput {
  status?: InquiryStatus;
  respondedAt?: Date;
  resolvedAt?: Date;
}

/**
 * Email notification payload for hot link integration
 */
export interface InquiryNotificationPayload {
  readonly inquiry: Inquiry;
  readonly recipientEmail: string;
  readonly templateType: EmailTemplateType;
}

/**
 * Email template types
 */
export enum EmailTemplateType {
  NEW_INQUIRY_ADMIN = 'new_inquiry_admin',
  INQUIRY_CONFIRMATION_CLIENT = 'inquiry_confirmation_client',
  INQUIRY_RESPONSE = 'inquiry_response'
}
