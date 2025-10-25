/**
 * Domain Error Types
 *
 * Comprehensive error hierarchy for different failure scenarios.
 * Each error type provides specific context for handling.
 *
 * Single Responsibility: Domain error definitions
 */

/**
 * Base application error
 */
export abstract class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation errors (400)
 */
export class ValidationError extends AppError {
  readonly fields?: Record<string, string[]>;

  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.fields = fields;
  }
}

/**
 * Authentication errors (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

/**
 * Authorization errors (403)
 */
export class AuthorizationError extends AppError {
  readonly requiredPermission?: string;

  constructor(message: string = 'Access denied', requiredPermission?: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.requiredPermission = requiredPermission;
  }
}

/**
 * Not found errors (404)
 */
export class NotFoundError extends AppError {
  readonly resourceType: string;
  readonly resourceId: string;

  constructor(resourceType: string, resourceId: string) {
    super(
      `${resourceType} with id '${resourceId}' not found`,
      'NOT_FOUND_ERROR',
      404
    );
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

/**
 * Conflict errors (409)
 */
export class ConflictError extends AppError {
  readonly conflictingField?: string;

  constructor(message: string, conflictingField?: string) {
    super(message, 'CONFLICT_ERROR', 409);
    this.conflictingField = conflictingField;
  }
}

/**
 * Database errors (500)
 */
export class DatabaseError extends AppError {
  readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500);
    this.originalError = originalError;
  }
}

/**
 * Storage errors (500)
 */
export class StorageError extends AppError {
  readonly operation: 'upload' | 'download' | 'delete';
  readonly originalError?: Error;

  constructor(
    operation: 'upload' | 'download' | 'delete',
    message: string,
    originalError?: Error
  ) {
    super(message, 'STORAGE_ERROR', 500);
    this.operation = operation;
    this.originalError = originalError;
  }
}

/**
 * External service errors (502)
 */
export class ExternalServiceError extends AppError {
  readonly serviceName: string;
  readonly originalError?: Error;

  constructor(serviceName: string, message: string, originalError?: Error) {
    super(message, 'EXTERNAL_SERVICE_ERROR', 502);
    this.serviceName = serviceName;
    this.originalError = originalError;
  }
}

/**
 * Rate limit errors (429)
 */
export class RateLimitError extends AppError {
  readonly retryAfter?: number; // seconds

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.retryAfter = retryAfter;
  }
}

/**
 * File upload errors (400/413)
 */
export class FileUploadError extends AppError {
  readonly reason: 'size' | 'type' | 'corrupt' | 'other';

  constructor(message: string, reason: 'size' | 'type' | 'corrupt' | 'other') {
    const statusCode = reason === 'size' ? 413 : 400;
    super(message, 'FILE_UPLOAD_ERROR', statusCode);
    this.reason = reason;
  }
}

/**
 * Business logic errors (422)
 */
export class BusinessLogicError extends AppError {
  readonly rule: string;

  constructor(message: string, rule: string) {
    super(message, 'BUSINESS_LOGIC_ERROR', 422);
    this.rule = rule;
  }
}

/**
 * Network errors (503)
 */
export class NetworkError extends AppError {
  readonly originalError?: Error;

  constructor(message: string = 'Network request failed', originalError?: Error) {
    super(message, 'NETWORK_ERROR', 503);
    this.originalError = originalError;
  }
}

/**
 * Type guard to check if error is AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Type guard for operational errors (expected errors)
 */
export const isOperationalError = (error: unknown): boolean => {
  return isAppError(error) && error.isOperational;
};

/**
 * Convert unknown error to AppError
 */
export const toAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      false // Not operational
    );
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500,
    false
  );
};
