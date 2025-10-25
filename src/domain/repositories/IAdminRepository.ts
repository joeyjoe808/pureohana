/**
 * Admin Repository Interface
 *
 * Abstraction for admin user and authentication operations.
 *
 * Single Responsibility: Admin data access and auth contract
 * Dependency Inversion: Depend on abstraction, not concrete implementation
 */

import { Result } from '../core/Result';
import { AppError } from '../core/errors';
import {
  AdminUser,
  AdminSession,
  LoginCredentials,
  CreateAdminInput,
  UpdateAdminInput,
  ChangePasswordInput,
  AuditLog,
  AuditAction,
  Permission
} from '../models/Admin';

/**
 * Admin repository interface
 */
export interface IAdminRepository {
  /**
   * Authenticate admin user
   */
  login(credentials: LoginCredentials): Promise<Result<AdminSession, AppError>>;

  /**
   * Logout admin user
   */
  logout(): Promise<Result<void, AppError>>;

  /**
   * Get current authenticated admin
   */
  getCurrentUser(): Promise<Result<AdminUser, AppError>>;

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<Result<AdminSession, AppError>>;

  /**
   * Find admin by ID
   */
  findById(id: string): Promise<Result<AdminUser, AppError>>;

  /**
   * Find admin by email
   */
  findByEmail(email: string): Promise<Result<AdminUser, AppError>>;

  /**
   * Find all admins
   */
  findAll(filters?: AdminFilters): Promise<Result<AdminUser[], AppError>>;

  /**
   * Create a new admin user
   */
  create(input: CreateAdminInput): Promise<Result<AdminUser, AppError>>;

  /**
   * Update admin user
   */
  update(id: string, input: UpdateAdminInput): Promise<Result<AdminUser, AppError>>;

  /**
   * Delete admin user
   */
  delete(id: string): Promise<Result<void, AppError>>;

  /**
   * Change admin password
   */
  changePassword(id: string, input: ChangePasswordInput): Promise<Result<void, AppError>>;

  /**
   * Reset password (send reset email)
   */
  requestPasswordReset(email: string): Promise<Result<void, AppError>>;

  /**
   * Confirm password reset with token
   */
  confirmPasswordReset(token: string, newPassword: string): Promise<Result<void, AppError>>;

  /**
   * Check if admin has permission
   */
  hasPermission(adminId: string, permission: Permission): Promise<Result<boolean, AppError>>;

  /**
   * Log audit event
   */
  logAudit(
    adminId: string,
    action: AuditAction,
    resourceType: string,
    resourceId: string | null,
    details: Record<string, unknown>
  ): Promise<Result<void, AppError>>;

  /**
   * Get audit logs
   */
  getAuditLogs(filters?: AuditLogFilters): Promise<Result<AuditLog[], AppError>>;

  /**
   * Update last login timestamp
   */
  updateLastLogin(id: string): Promise<Result<void, AppError>>;
}

/**
 * Admin query filters
 */
export interface AdminFilters {
  isActive?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'last_login_at' | 'name';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Audit log query filters
 */
export interface AuditLogFilters {
  adminId?: string;
  action?: AuditAction;
  resourceType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at';
  orderDirection?: 'asc' | 'desc';
}
