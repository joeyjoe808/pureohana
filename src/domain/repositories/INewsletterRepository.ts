/**
 * Newsletter Repository Interface
 *
 * Abstraction for newsletter subscription data access operations.
 *
 * Single Responsibility: Newsletter data access contract
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */

import { Result } from '../core/Result';
import { AppError } from '../core/errors';
import {
  Subscriber,
  CreateSubscriberInput,
  UpdateSubscriberInput,
  SubscriberStatus
} from '../models/Newsletter';

/**
 * Newsletter repository interface
 */
export interface INewsletterRepository {
  /**
   * Find subscriber by ID
   */
  findById(id: string): Promise<Result<Subscriber, AppError>>;

  /**
   * Find subscriber by email
   */
  findByEmail(email: string): Promise<Result<Subscriber, AppError>>;

  /**
   * Find all subscribers (with optional filters)
   */
  findAll(filters?: SubscriberFilters): Promise<Result<Subscriber[], AppError>>;

  /**
   * Find active subscribers only
   */
  findActive(): Promise<Result<Subscriber[], AppError>>;

  /**
   * Create a new subscription
   * Sends confirmation email
   */
  create(input: CreateSubscriberInput): Promise<Result<Subscriber, AppError>>;

  /**
   * Update subscriber
   */
  update(id: string, input: UpdateSubscriberInput): Promise<Result<Subscriber, AppError>>;

  /**
   * Confirm subscription via token
   */
  confirmSubscription(token: string): Promise<Result<Subscriber, AppError>>;

  /**
   * Unsubscribe via token
   */
  unsubscribe(token: string): Promise<Result<void, AppError>>;

  /**
   * Delete a subscriber
   */
  delete(id: string): Promise<Result<void, AppError>>;

  /**
   * Check if email is subscribed
   */
  isSubscribed(email: string): Promise<Result<boolean, AppError>>;

  /**
   * Get subscriber statistics
   */
  getStats(): Promise<Result<SubscriberStats, AppError>>;

  /**
   * Import subscribers in batch
   */
  importBatch(subscribers: CreateSubscriberInput[]): Promise<Result<ImportResult, AppError>>;
}

/**
 * Subscriber query filters
 */
export interface SubscriberFilters {
  status?: SubscriberStatus;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'subscribed_at' | 'email';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Subscriber statistics
 */
export interface SubscriberStats {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
  bounced: number;
  complained: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  growthRate: number; // percentage
}

/**
 * Batch import result
 */
export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: Array<{
    email: string;
    reason: string;
  }>;
}
