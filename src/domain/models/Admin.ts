/**
 * Admin Domain Model
 *
 * Represents admin users and their authentication/authorization.
 *
 * Single Responsibility: Admin user entity and auth types
 */

/**
 * Admin user entity
 */
export interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: AdminRole;
  readonly permissions: ReadonlyArray<Permission>;
  readonly isActive: boolean;
  readonly lastLoginAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Admin roles with hierarchical permissions
 */
export enum AdminRole {
  SUPER_ADMIN = 'super_admin', // Full system access
  ADMIN = 'admin', // Content and user management
  EDITOR = 'editor', // Content management only
  VIEWER = 'viewer' // Read-only access
}

/**
 * Granular permissions
 */
export enum Permission {
  // Gallery permissions
  GALLERY_VIEW = 'gallery_view',
  GALLERY_CREATE = 'gallery_create',
  GALLERY_EDIT = 'gallery_edit',
  GALLERY_DELETE = 'gallery_delete',
  GALLERY_PUBLISH = 'gallery_publish',

  // Photo permissions
  PHOTO_VIEW = 'photo_view',
  PHOTO_UPLOAD = 'photo_upload',
  PHOTO_EDIT = 'photo_edit',
  PHOTO_DELETE = 'photo_delete',
  PHOTO_MOVE = 'photo_move',

  // Inquiry permissions
  INQUIRY_VIEW = 'inquiry_view',
  INQUIRY_RESPOND = 'inquiry_respond',
  INQUIRY_DELETE = 'inquiry_delete',

  // Newsletter permissions
  NEWSLETTER_VIEW = 'newsletter_view',
  NEWSLETTER_MANAGE = 'newsletter_manage',
  NEWSLETTER_SEND = 'newsletter_send',

  // User management
  USER_VIEW = 'user_view',
  USER_CREATE = 'user_create',
  USER_EDIT = 'user_edit',
  USER_DELETE = 'user_delete',

  // System settings
  SETTINGS_VIEW = 'settings_view',
  SETTINGS_EDIT = 'settings_edit',

  // Audit logs
  AUDIT_VIEW = 'audit_view'
}

/**
 * Role to permissions mapping
 */
export const RolePermissions: Record<AdminRole, ReadonlyArray<Permission>> = {
  [AdminRole.SUPER_ADMIN]: [
    // All permissions
    Permission.GALLERY_VIEW,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_EDIT,
    Permission.GALLERY_DELETE,
    Permission.GALLERY_PUBLISH,
    Permission.PHOTO_VIEW,
    Permission.PHOTO_UPLOAD,
    Permission.PHOTO_EDIT,
    Permission.PHOTO_DELETE,
    Permission.PHOTO_MOVE,
    Permission.INQUIRY_VIEW,
    Permission.INQUIRY_RESPOND,
    Permission.INQUIRY_DELETE,
    Permission.NEWSLETTER_VIEW,
    Permission.NEWSLETTER_MANAGE,
    Permission.NEWSLETTER_SEND,
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_EDIT,
    Permission.USER_DELETE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    Permission.AUDIT_VIEW
  ],
  [AdminRole.ADMIN]: [
    Permission.GALLERY_VIEW,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_EDIT,
    Permission.GALLERY_PUBLISH,
    Permission.PHOTO_VIEW,
    Permission.PHOTO_UPLOAD,
    Permission.PHOTO_EDIT,
    Permission.PHOTO_MOVE,
    Permission.INQUIRY_VIEW,
    Permission.INQUIRY_RESPOND,
    Permission.NEWSLETTER_VIEW,
    Permission.NEWSLETTER_MANAGE,
    Permission.NEWSLETTER_SEND,
    Permission.SETTINGS_VIEW
  ],
  [AdminRole.EDITOR]: [
    Permission.GALLERY_VIEW,
    Permission.GALLERY_CREATE,
    Permission.GALLERY_EDIT,
    Permission.PHOTO_VIEW,
    Permission.PHOTO_UPLOAD,
    Permission.PHOTO_EDIT,
    Permission.INQUIRY_VIEW,
    Permission.INQUIRY_RESPOND,
    Permission.NEWSLETTER_VIEW
  ],
  [AdminRole.VIEWER]: [
    Permission.GALLERY_VIEW,
    Permission.PHOTO_VIEW,
    Permission.INQUIRY_VIEW,
    Permission.NEWSLETTER_VIEW
  ]
};

/**
 * Admin session information
 */
export interface AdminSession {
  readonly user: AdminUser;
  readonly token: string;
  readonly expiresAt: Date;
  readonly refreshToken: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Input for creating a new admin user
 */
export interface CreateAdminInput {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
  isActive?: boolean;
}

/**
 * Input for updating admin user
 */
export interface UpdateAdminInput {
  name?: string;
  email?: string;
  role?: AdminRole;
  isActive?: boolean;
}

/**
 * Password change input
 */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

/**
 * Security audit log entry
 */
export interface AuditLog {
  readonly id: string;
  readonly adminId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string | null;
  readonly details: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly createdAt: Date;
}

/**
 * Audit action types
 */
export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  GALLERY_CREATED = 'gallery_created',
  GALLERY_UPDATED = 'gallery_updated',
  GALLERY_DELETED = 'gallery_deleted',
  PHOTO_UPLOADED = 'photo_uploaded',
  PHOTO_UPDATED = 'photo_updated',
  PHOTO_DELETED = 'photo_deleted',
  INQUIRY_VIEWED = 'inquiry_viewed',
  INQUIRY_RESPONDED = 'inquiry_responded',
  SETTINGS_UPDATED = 'settings_updated'
}
