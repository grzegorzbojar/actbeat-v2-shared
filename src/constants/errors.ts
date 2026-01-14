/**
 * Error codes and messages for the Actbeat theater management system.
 * Standardized error handling across the application.
 * @module constants/errors
 */

/**
 * Error codes for programmatic error handling.
 * Used in API responses and error tracking.
 */
export enum ErrorCode {
  // Authentication & Authorization (1xxx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Validation (2xxx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_USER_DATA = 'INVALID_USER_DATA',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  INVALID_CHARACTERS_ARRAY = 'INVALID_CHARACTERS_ARRAY',
  INVALID_DATES_ARRAY = 'INVALID_DATES_ARRAY',

  // Resource Not Found (3xxx)
  NOT_FOUND = 'NOT_FOUND',
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  PLAY_NOT_FOUND = 'PLAY_NOT_FOUND',
  CHARACTER_NOT_FOUND = 'CHARACTER_NOT_FOUND',
  SCENE_NOT_FOUND = 'SCENE_NOT_FOUND',
  LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND',
  TAG_NOT_FOUND = 'TAG_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',

  // Resource Conflict (4xxx)
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Business Logic Errors (5xxx)
  NO_ACCESSIBLE_CHARACTERS = 'NO_ACCESSIBLE_CHARACTERS',
  FAILED_FIND_AVAILABLE_TIME_BLOCKS = 'FAILED_FIND_AVAILABLE_TIME_BLOCKS',
  FAILED_RETRIEVE_CHARACTERS = 'FAILED_RETRIEVE_CHARACTERS',
  CHARACTER_ID_MISSING = 'CHARACTER_ID_MISSING',

  // Server Errors (9xxx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Error messages for each error code.
 * Based on v1 helpers/errorMessages.js
 * These are default messages - they can be overridden with i18n keys.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication & Authorization
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized access.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorCode.INVALID_TOKEN]: 'Invalid authentication token.',
  [ErrorCode.TOKEN_EXPIRED]: 'Authentication token has expired.',

  // Validation
  [ErrorCode.VALIDATION_ERROR]: 'Validation error occurred.',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
  [ErrorCode.INVALID_USER_DATA]: 'Invalid user data format.',
  [ErrorCode.INVALID_DATE_RANGE]: 'Invalid date range. End date must be after start date.',
  [ErrorCode.INVALID_CHARACTERS_ARRAY]: 'Invalid characters array. It should be an array of character IDs.',
  [ErrorCode.INVALID_DATES_ARRAY]: 'Invalid dates array. Each date should have "start" and "end" as ISO strings.',

  // Resource Not Found
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.EVENT_NOT_FOUND]: 'Event not found.',
  [ErrorCode.PLAY_NOT_FOUND]: 'Play not found.',
  [ErrorCode.CHARACTER_NOT_FOUND]: 'Character not found.',
  [ErrorCode.SCENE_NOT_FOUND]: 'Scene not found.',
  [ErrorCode.LOCATION_NOT_FOUND]: 'Location not found.',
  [ErrorCode.TAG_NOT_FOUND]: 'Tag not found.',
  [ErrorCode.USER_NOT_FOUND]: 'User not found.',

  // Resource Conflict
  [ErrorCode.CONFLICT]: 'A conflict occurred with the current state of the resource.',
  [ErrorCode.DUPLICATE_ENTRY]: 'A duplicate entry already exists.',
  [ErrorCode.ALREADY_EXISTS]: 'This resource already exists.',

  // Business Logic Errors
  [ErrorCode.NO_ACCESSIBLE_CHARACTERS]: 'No accessible characters found.',
  [ErrorCode.FAILED_FIND_AVAILABLE_TIME_BLOCKS]: 'Failed to find available time blocks.',
  [ErrorCode.FAILED_RETRIEVE_CHARACTERS]: 'Failed to retrieve characters.',
  [ErrorCode.CHARACTER_ID_MISSING]: 'Character ID is missing.',

  // Server Errors
  [ErrorCode.INTERNAL_ERROR]: 'An internal server error occurred.',
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred.',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service error occurred.',
} as const;

/**
 * HTTP status codes mapped to error codes.
 */
export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  // Authentication & Authorization (401, 403)
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.INVALID_TOKEN]: 401,
  [ErrorCode.TOKEN_EXPIRED]: 401,

  // Validation (400)
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.INVALID_USER_DATA]: 400,
  [ErrorCode.INVALID_DATE_RANGE]: 400,
  [ErrorCode.INVALID_CHARACTERS_ARRAY]: 400,
  [ErrorCode.INVALID_DATES_ARRAY]: 400,

  // Resource Not Found (404)
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.EVENT_NOT_FOUND]: 404,
  [ErrorCode.PLAY_NOT_FOUND]: 404,
  [ErrorCode.CHARACTER_NOT_FOUND]: 404,
  [ErrorCode.SCENE_NOT_FOUND]: 404,
  [ErrorCode.LOCATION_NOT_FOUND]: 404,
  [ErrorCode.TAG_NOT_FOUND]: 404,
  [ErrorCode.USER_NOT_FOUND]: 404,

  // Resource Conflict (409)
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.DUPLICATE_ENTRY]: 409,
  [ErrorCode.ALREADY_EXISTS]: 409,

  // Business Logic Errors (422)
  [ErrorCode.NO_ACCESSIBLE_CHARACTERS]: 422,
  [ErrorCode.FAILED_FIND_AVAILABLE_TIME_BLOCKS]: 422,
  [ErrorCode.FAILED_RETRIEVE_CHARACTERS]: 422,
  [ErrorCode.CHARACTER_ID_MISSING]: 422,

  // Server Errors (500, 502)
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
} as const;

/**
 * Get the error message for an error code.
 *
 * @param code - The error code
 * @returns The error message
 *
 * @example
 * ```typescript
 * const message = getErrorMessage(ErrorCode.NOT_FOUND);
 * // "The requested resource was not found."
 * ```
 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code];
}

/**
 * Get the HTTP status code for an error code.
 *
 * @param code - The error code
 * @returns The HTTP status code
 *
 * @example
 * ```typescript
 * const status = getHttpStatus(ErrorCode.NOT_FOUND);
 * // 404
 * ```
 */
export function getHttpStatus(code: ErrorCode): number {
  return ERROR_HTTP_STATUS[code];
}
