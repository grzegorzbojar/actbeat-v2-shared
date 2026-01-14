/**
 * Constants for the Actbeat theater management system.
 * @module constants
 */

// Permissions
export {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  getPermissionsForRole,
  hasAnyPermission,
  hasAllPermissions,
  isRoleAtLeast,
} from './permissions.js';

// Errors
export {
  ErrorCode,
  ERROR_MESSAGES,
  ERROR_HTTP_STATUS,
  getErrorMessage,
  getHttpStatus,
} from './errors.js';

// Categories
export {
  EVENT_CATEGORIES,
  ALL_CATEGORIES,
  ORG_CATEGORIES,
  getCategoryInfo,
  getCategoryColor,
  getCategoryTextColor,
  type CategoryInfo,
} from './categories.js';
