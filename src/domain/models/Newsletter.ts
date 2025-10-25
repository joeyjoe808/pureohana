/**
 * Newsletter Domain Model
 *
 * Represents newsletter subscriptions and campaigns.
 *
 * Single Responsibility: Newsletter subscription and campaign entities
 */

/**
 * Newsletter subscriber entity
 */
export interface Subscriber {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly status: SubscriberStatus;
  readonly source: SubscriptionSource;
  readonly preferences: SubscriberPreferences;
  readonly subscribedAt: Date;
  readonly confirmedAt: Date | null;
  readonly unsubscribedAt: Date | null;
  readonly lastEmailSentAt: Date | null;
}

/**
 * Subscriber status
 */
export enum SubscriberStatus {
  PENDING = 'pending', // Awaiting email confirmation
  ACTIVE = 'active', // Confirmed and active
  UNSUBSCRIBED = 'unsubscribed',
  BOUNCED = 'bounced', // Email bounced
  COMPLAINED = 'complained' // Marked as spam
}

/**
 * Subscription source
 */
export enum SubscriptionSource {
  WEBSITE_FOOTER = 'website_footer',
  WEBSITE_POPUP = 'website_popup',
  BLOG_POST = 'blog_post',
  CHECKOUT = 'checkout',
  MANUAL = 'manual',
  IMPORT = 'import'
}

/**
 * Subscriber preferences
 */
export interface SubscriberPreferences {
  readonly frequency?: EmailFrequency;
  readonly categories?: ReadonlyArray<string>;
  readonly htmlEmails?: boolean;
}

/**
 * Email frequency preference
 */
export enum EmailFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  OCCASIONAL = 'occasional'
}

/**
 * Input for creating a new subscription
 */
export interface CreateSubscriberInput {
  email: string;
  name?: string;
  source?: SubscriptionSource;
  preferences?: Partial<SubscriberPreferences>;
}

/**
 * Input for updating subscriber
 */
export interface UpdateSubscriberInput {
  name?: string;
  status?: SubscriberStatus;
  preferences?: Partial<SubscriberPreferences>;
}

/**
 * Newsletter campaign entity
 */
export interface Campaign {
  readonly id: string;
  readonly title: string;
  readonly subject: string;
  readonly content: string; // HTML content
  readonly status: CampaignStatus;
  readonly scheduledFor: Date | null;
  readonly sentAt: Date | null;
  readonly recipientCount: number;
  readonly openCount: number;
  readonly clickCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Campaign status
 */
export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  CANCELLED = 'cancelled'
}
