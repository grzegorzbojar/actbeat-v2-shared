/**
 * Permission and role constants for the Actbeat theater management system.
 * Defines role-based access control (RBAC) permissions.
 * @module constants/permissions
 */

/**
 * User roles within the organization.
 * Based on v1 config/roles.js
 */
export enum Role {
  /** Basic user with personal calendar access */
  BASIC = 'basic',
  /** Read-only access to personal calendar */
  GHOST = 'ghost',
  /** Actor with organization read access */
  ACTOR = 'actor',
  /** Administrator with full organization access */
  ADMIN = 'admin',
}

/**
 * Permission identifiers for access control.
 */
export enum Permission {
  /** Read personal calendar and events */
  PERSONAL_READ = 'personal:read',
  /** Edit personal calendar and events */
  PERSONAL_EDIT = 'personal:edit',
  /** Read organization basic data (plays, characters, etc.) */
  ORG_BASIC_READ = 'org:basic:read',
  /** Edit organization basic data (plays, characters, etc.) */
  ORG_BASIC_EDIT = 'org:basic:edit',
  /** Manage organization members and invitations */
  ORG_MEMBERS_MANAGE = 'org:members:manage',
  /** Manage organization settings */
  ORG_SETTINGS_MANAGE = 'org:settings:manage',
}

/**
 * Mapping of roles to their granted permissions.
 * Based on v1 config/roles.js rolePermissions
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.BASIC]: [Permission.PERSONAL_READ, Permission.PERSONAL_EDIT],
  [Role.GHOST]: [Permission.PERSONAL_READ],
  [Role.ACTOR]: [Permission.ORG_BASIC_READ],
  [Role.ADMIN]: [
    Permission.PERSONAL_READ,
    Permission.PERSONAL_EDIT,
    Permission.ORG_BASIC_READ,
    Permission.ORG_BASIC_EDIT,
    Permission.ORG_MEMBERS_MANAGE,
    Permission.ORG_SETTINGS_MANAGE,
  ],
} as const;

/**
 * Check if a role has a specific permission.
 *
 * @param role - The user's role
 * @param permission - The permission to check
 * @returns True if the role has the permission
 *
 * @example
 * ```typescript
 * if (hasPermission(Role.ACTOR, Permission.ORG_BASIC_READ)) {
 *   // Allow access to organization data
 * }
 * ```
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role.
 *
 * @param role - The user's role
 * @returns Array of permissions granted to the role
 *
 * @example
 * ```typescript
 * const permissions = getPermissionsForRole(Role.ADMIN);
 * // Returns all admin permissions
 * ```
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

/**
 * Check if a role has any of the specified permissions.
 *
 * @param role - The user's role
 * @param permissions - Array of permissions to check
 * @returns True if the role has at least one of the permissions
 *
 * @example
 * ```typescript
 * if (hasAnyPermission(userRole, [Permission.ORG_BASIC_READ, Permission.ORG_BASIC_EDIT])) {
 *   // Allow access
 * }
 * ```
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.some((p) => rolePermissions.includes(p));
}

/**
 * Check if a role has all of the specified permissions.
 *
 * @param role - The user's role
 * @param permissions - Array of permissions to check
 * @returns True if the role has all of the permissions
 *
 * @example
 * ```typescript
 * if (hasAllPermissions(userRole, [Permission.ORG_BASIC_READ, Permission.ORG_BASIC_EDIT])) {
 *   // Allow full access
 * }
 * ```
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return permissions.every((p) => rolePermissions.includes(p));
}

/**
 * Role hierarchy for comparison (higher index = more permissions).
 */
export const ROLE_HIERARCHY: readonly Role[] = [
  Role.GHOST,
  Role.BASIC,
  Role.ACTOR,
  Role.ADMIN,
] as const;

/**
 * Check if one role is equal to or higher than another in the hierarchy.
 *
 * @param role - The role to check
 * @param minimumRole - The minimum required role
 * @returns True if role is equal to or higher than minimumRole
 *
 * @example
 * ```typescript
 * if (isRoleAtLeast(userRole, Role.ACTOR)) {
 *   // User has actor or admin access
 * }
 * ```
 */
export function isRoleAtLeast(role: Role, minimumRole: Role): boolean {
  const roleIndex = ROLE_HIERARCHY.indexOf(role);
  const minimumIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return roleIndex >= minimumIndex;
}
