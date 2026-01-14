/**
 * Validation utility functions.
 * @module utils/validation
 */

/**
 * Validates that a string is a valid hex color.
 *
 * @param color - The color string to validate
 * @returns True if the color is a valid hex color (#RRGGBB format)
 *
 * @example
 * ```typescript
 * isValidHexColor('#FF5733'); // true
 * isValidHexColor('#fff'); // false (must be 6 digits)
 * isValidHexColor('red'); // false (must be hex)
 * ```
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validates that a duration in minutes is within acceptable bounds.
 *
 * @param minutes - The duration in minutes
 * @param min - Minimum allowed duration (default: 1)
 * @param max - Maximum allowed duration (default: 1440 = 24 hours)
 * @returns True if the duration is valid
 *
 * @example
 * ```typescript
 * isValidDuration(60); // true
 * isValidDuration(0); // false (below minimum)
 * isValidDuration(2000); // false (above maximum)
 * ```
 */
export function isValidDuration(
  minutes: number,
  min: number = 1,
  max: number = 1440
): boolean {
  return Number.isInteger(minutes) && minutes >= min && minutes <= max;
}

/**
 * Validates that latitude is within valid range.
 *
 * @param lat - The latitude value
 * @returns True if latitude is valid (-90 to 90)
 */
export function isValidLatitude(lat: number): boolean {
  return typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validates that longitude is within valid range.
 *
 * @param lng - The longitude value
 * @returns True if longitude is valid (-180 to 180)
 */
export function isValidLongitude(lng: number): boolean {
  return typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Validates that coordinates are valid.
 *
 * @param lat - The latitude value
 * @param lng - The longitude value
 * @returns True if both coordinates are valid
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng);
}

/**
 * Validates that a string is a non-empty string.
 *
 * @param value - The value to check
 * @returns True if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that an email address has a valid format.
 *
 * @param email - The email address to validate
 * @returns True if the email format is valid
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid'); // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  // Simple email regex - for full validation use a library
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that a date range is valid (end is after start).
 *
 * @param start - Start date
 * @param end - End date
 * @returns True if the date range is valid
 */
export function isValidDateRange(start: Date, end: Date): boolean {
  return start instanceof Date && end instanceof Date && start < end;
}

/**
 * Validates that an ID string has the expected format.
 * Actbeat uses 12-character random IDs.
 *
 * @param id - The ID to validate
 * @returns True if the ID format is valid
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 36;
}

/**
 * Validates an array of IDs.
 *
 * @param ids - Array of IDs to validate
 * @returns True if all IDs are valid
 */
export function isValidIdArray(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.every((id) => isValidId(id as string));
}

/**
 * Sanitizes a string by trimming whitespace.
 *
 * @param value - The string to sanitize
 * @returns Trimmed string
 */
export function sanitizeString(value: string): string {
  return value.trim();
}

/**
 * Sanitizes a hex color to uppercase format.
 *
 * @param color - The color string
 * @returns Uppercase hex color or null if invalid
 */
export function sanitizeHexColor(color: string): string | null {
  const trimmed = color.trim();
  if (!isValidHexColor(trimmed)) {
    return null;
  }
  return trimmed.toUpperCase();
}
