/**
 * Tests for validation utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  isValidHexColor,
  isValidDuration,
  isValidLatitude,
  isValidLongitude,
  isValidCoordinates,
  isNonEmptyString,
  isValidEmail,
  isValidDateRange,
  isValidId,
  isValidIdArray,
  sanitizeString,
  sanitizeHexColor,
} from '../../src/utils/validation.utils.js';

describe('Validation Utils', () => {
  describe('isValidHexColor', () => {
    it('should accept valid 6-digit hex colors with #', () => {
      expect(isValidHexColor('#FF5733')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
      expect(isValidHexColor('#abcdef')).toBe(true);
      expect(isValidHexColor('#123456')).toBe(true);
    });

    it('should accept mixed case hex colors', () => {
      expect(isValidHexColor('#aAbBcC')).toBe(true);
      expect(isValidHexColor('#Ff0099')).toBe(true);
    });

    it('should reject 3-digit shorthand hex colors', () => {
      expect(isValidHexColor('#fff')).toBe(false);
      expect(isValidHexColor('#abc')).toBe(false);
    });

    it('should reject colors without #', () => {
      expect(isValidHexColor('FF5733')).toBe(false);
      expect(isValidHexColor('000000')).toBe(false);
    });

    it('should reject named colors', () => {
      expect(isValidHexColor('red')).toBe(false);
      expect(isValidHexColor('blue')).toBe(false);
    });

    it('should reject invalid hex characters', () => {
      expect(isValidHexColor('#GGHHII')).toBe(false);
      expect(isValidHexColor('#ZZZZZZ')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidHexColor('')).toBe(false);
    });

    it('should reject colors with extra characters', () => {
      expect(isValidHexColor('#FF5733FF')).toBe(false);
      expect(isValidHexColor('##FF5733')).toBe(false);
    });

    it('should reject colors with spaces', () => {
      expect(isValidHexColor('# FF5733')).toBe(false);
      expect(isValidHexColor(' #FF5733')).toBe(false);
    });
  });

  describe('isValidDuration', () => {
    it('should accept valid durations within default bounds', () => {
      expect(isValidDuration(1)).toBe(true);
      expect(isValidDuration(60)).toBe(true);
      expect(isValidDuration(1440)).toBe(true);
    });

    it('should reject zero', () => {
      expect(isValidDuration(0)).toBe(false);
    });

    it('should reject negative durations', () => {
      expect(isValidDuration(-1)).toBe(false);
      expect(isValidDuration(-60)).toBe(false);
    });

    it('should reject durations above maximum (1440)', () => {
      expect(isValidDuration(1441)).toBe(false);
      expect(isValidDuration(2000)).toBe(false);
    });

    it('should reject non-integer durations', () => {
      expect(isValidDuration(1.5)).toBe(false);
      expect(isValidDuration(60.1)).toBe(false);
    });

    it('should accept custom min/max bounds', () => {
      expect(isValidDuration(5, 5, 10)).toBe(true);
      expect(isValidDuration(10, 5, 10)).toBe(true);
      expect(isValidDuration(4, 5, 10)).toBe(false);
      expect(isValidDuration(11, 5, 10)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isValidDuration(NaN)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(isValidDuration(Infinity)).toBe(false);
      expect(isValidDuration(-Infinity)).toBe(false);
    });
  });

  describe('isValidLatitude', () => {
    it('should accept valid latitudes', () => {
      expect(isValidLatitude(0)).toBe(true);
      expect(isValidLatitude(45.5)).toBe(true);
      expect(isValidLatitude(-45.5)).toBe(true);
      expect(isValidLatitude(90)).toBe(true);
      expect(isValidLatitude(-90)).toBe(true);
    });

    it('should reject latitudes out of range', () => {
      expect(isValidLatitude(91)).toBe(false);
      expect(isValidLatitude(-91)).toBe(false);
      expect(isValidLatitude(180)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isValidLatitude(NaN)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(isValidLatitude(Infinity)).toBe(false);
      expect(isValidLatitude(-Infinity)).toBe(false);
    });
  });

  describe('isValidLongitude', () => {
    it('should accept valid longitudes', () => {
      expect(isValidLongitude(0)).toBe(true);
      expect(isValidLongitude(90)).toBe(true);
      expect(isValidLongitude(-90)).toBe(true);
      expect(isValidLongitude(180)).toBe(true);
      expect(isValidLongitude(-180)).toBe(true);
    });

    it('should reject longitudes out of range', () => {
      expect(isValidLongitude(181)).toBe(false);
      expect(isValidLongitude(-181)).toBe(false);
      expect(isValidLongitude(360)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isValidLongitude(NaN)).toBe(false);
    });
  });

  describe('isValidCoordinates', () => {
    it('should accept valid coordinate pairs', () => {
      expect(isValidCoordinates(0, 0)).toBe(true);
      expect(isValidCoordinates(52.2297, 21.0122)).toBe(true); // Warsaw
      expect(isValidCoordinates(-33.8688, 151.2093)).toBe(true); // Sydney
      expect(isValidCoordinates(90, 180)).toBe(true);
      expect(isValidCoordinates(-90, -180)).toBe(true);
    });

    it('should reject if latitude is invalid', () => {
      expect(isValidCoordinates(91, 0)).toBe(false);
    });

    it('should reject if longitude is invalid', () => {
      expect(isValidCoordinates(0, 181)).toBe(false);
    });

    it('should reject if both are invalid', () => {
      expect(isValidCoordinates(91, 181)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should accept non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('  hello  ')).toBe(true);
    });

    it('should reject empty string', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    it('should reject whitespace-only strings', () => {
      expect(isNonEmptyString(' ')).toBe(false);
      expect(isNonEmptyString('  ')).toBe(false);
      expect(isNonEmptyString('\t')).toBe(false);
      expect(isNonEmptyString('\n')).toBe(false);
    });

    it('should reject non-string types', () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(0)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(true)).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test@test.org')).toBe(true);
      expect(isValidEmail('name.surname@company.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('user@ example.com')).toBe(false);
    });
  });

  describe('isValidDateRange', () => {
    it('should accept valid date ranges where end > start', () => {
      const start = new Date('2024-01-01T09:00:00Z');
      const end = new Date('2024-01-01T17:00:00Z');
      expect(isValidDateRange(start, end)).toBe(true);
    });

    it('should accept ranges spanning multiple days', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      expect(isValidDateRange(start, end)).toBe(true);
    });

    it('should reject when end equals start', () => {
      const date = new Date('2024-01-01T09:00:00Z');
      expect(isValidDateRange(date, date)).toBe(false);
    });

    it('should reject when end is before start', () => {
      const start = new Date('2024-01-01T17:00:00Z');
      const end = new Date('2024-01-01T09:00:00Z');
      expect(isValidDateRange(start, end)).toBe(false);
    });

    it('should reject invalid Date objects', () => {
      expect(isValidDateRange(new Date('invalid'), new Date('2024-01-01'))).toBe(false);
      expect(isValidDateRange(new Date('2024-01-01'), new Date('invalid'))).toBe(false);
    });
  });

  describe('isValidId', () => {
    it('should accept valid IDs', () => {
      expect(isValidId('abc123')).toBe(true);
      expect(isValidId('a')).toBe(true);
      expect(isValidId('abcdef123456')).toBe(true); // 12 chars
      expect(isValidId('550e8400-e29b-41d4-a716-446655440000')).toBe(true); // UUID (36 chars)
    });

    it('should reject empty string', () => {
      expect(isValidId('')).toBe(false);
    });

    it('should reject strings longer than 36', () => {
      expect(isValidId('a'.repeat(37))).toBe(false);
    });

    it('should accept strings up to 36 characters', () => {
      expect(isValidId('a'.repeat(36))).toBe(true);
    });
  });

  describe('isValidIdArray', () => {
    it('should accept valid arrays of IDs', () => {
      expect(isValidIdArray(['abc', 'def'])).toBe(true);
      expect(isValidIdArray(['a'])).toBe(true);
    });

    it('should accept empty arrays', () => {
      expect(isValidIdArray([])).toBe(true);
    });

    it('should reject non-array values', () => {
      expect(isValidIdArray('abc')).toBe(false);
      expect(isValidIdArray(123)).toBe(false);
      expect(isValidIdArray(null)).toBe(false);
      expect(isValidIdArray(undefined)).toBe(false);
      expect(isValidIdArray({})).toBe(false);
    });

    it('should reject arrays with invalid IDs', () => {
      expect(isValidIdArray([''])).toBe(false);
      expect(isValidIdArray(['a'.repeat(37)])).toBe(false);
    });

    it('should reject arrays with non-string elements', () => {
      expect(isValidIdArray([123])).toBe(false);
      expect(isValidIdArray([null])).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace from both ends', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('\thello\t')).toBe('hello');
      expect(sanitizeString('\nhello\n')).toBe('hello');
    });

    it('should preserve internal whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(sanitizeString('   ')).toBe('');
    });

    it('should return unchanged string if no surrounding whitespace', () => {
      expect(sanitizeString('hello')).toBe('hello');
    });
  });

  describe('sanitizeHexColor', () => {
    it('should return uppercase hex color for valid input', () => {
      expect(sanitizeHexColor('#ff5733')).toBe('#FF5733');
      expect(sanitizeHexColor('#abcdef')).toBe('#ABCDEF');
      expect(sanitizeHexColor('#000000')).toBe('#000000');
    });

    it('should handle already-uppercase colors', () => {
      expect(sanitizeHexColor('#FF5733')).toBe('#FF5733');
    });

    it('should trim whitespace before validation', () => {
      expect(sanitizeHexColor('  #ff5733  ')).toBe('#FF5733');
    });

    it('should return null for invalid colors', () => {
      expect(sanitizeHexColor('invalid')).toBe(null);
      expect(sanitizeHexColor('#fff')).toBe(null);
      expect(sanitizeHexColor('')).toBe(null);
      expect(sanitizeHexColor('red')).toBe(null);
    });

    it('should return null for hex without #', () => {
      expect(sanitizeHexColor('FF5733')).toBe(null);
    });
  });
});
