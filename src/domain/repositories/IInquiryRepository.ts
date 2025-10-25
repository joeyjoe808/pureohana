/**
 * Inquiry Repository Interface
 *
 * Abstraction for inquiry data access and email notification operations.
 *
 * Single Responsibility: Inquiry data access contract
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */

import { Result } from '../core/Result';
import { AppError } from '../core/errors';
import {
  Inquiry,
  CreateInquiryInput,
  UpdateInquiryInput,
  InquiryStatus,
  InquiryType
} from '../models/Inquiry';

/**
 * Inquiry repository interface
 */
export interface IInquiryRepository {
  /**
   * Find inquiry by ID
   */
  findById(id: string): Promise<Result<Inquiry, AppError>>;

  /**
   * Find all inquiries (with optional filters)
   */
  findAll(filters?: InquiryFilters): Promise<Result<Inquiry[], AppError>>;

  /**
   * Find inquiries by status
   */
  findByStatus(status: InquiryStatus): Promise<Result<Inquiry[], AppError>>;

  /**
   * Find inquiries by type
   */
  findByType(type: InquiryType): Promise<Result<Inquiry[], AppError>>;

  /**
   * Create a new inquiry
   * Also triggers email notification
   */
  create(input: CreateInquiryInput): Promise<Result<Inquiry, AppError>>;

  /**
   * Update inquiry status
   */
  update(id: string, input: UpdateInquiryInput): Promise<Result<Inquiry, AppError>>;

  /**
   * Mark inquiry as read
   */
  markAsRead(id: string): Promise<Result<void, AppError>>;

  /**
   * Mark inquiry as spam
   */
  markAsSpam(id: string): Promise<Result<void, AppError>>;

  /**
   * Delete an inquiry
   */
  delete(id: string): Promise<Result<void, AppError>>;

  /**
   * Get inquiry statistics
   */
  getStats(): Promise<Result<InquiryStats, AppError>>;

  /**
   * Search inquiries
   */
  search(query: string): Promise<Result<Inquiry[], AppError>>;
}

/**
 * Inquiry query filters
 */
export interface InquiryFilters {
  status?: InquiryStatus;
  type?: InquiryType;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'submitted_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Inquiry statistics
 */
export interface InquiryStats {
  total: number;
  byStatus: Record<InquiryStatus, number>;
  byType: Record<InquiryType, number>;
  averageResponseTime: number; // in hours
  todayCount: number;
  weekCount: number;
  monthCount: number;
}
