/**
 * Tests for common Zod validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  paginationSchema,
  idParamSchema,
  hexColorSchema,
  idArraySchema,
  dateSchema,
  optionalDateSchema,
} from '../../src/schemas/common.schema.js';

describe('Common Schemas', () => {
  describe('paginationSchema', () => {
    it('should accept valid pagination params', () => {
      const result = paginationSchema.parse({ page: 1, pageSize: 20 });
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.sortOrder).toBe('asc');
    });

    it('should apply defaults when fields are omitted', () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.sortOrder).toBe('asc');
      expect(result.sortBy).toBeUndefined();
    });

    it('should coerce string values to numbers', () => {
      const result = paginationSchema.parse({ page: '3', pageSize: '50' });
      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(50);
    });

    it('should reject page less than 1', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();
      expect(() => paginationSchema.parse({ page: -1 })).toThrow();
    });

    it('should reject pageSize less than 1', () => {
      expect(() => paginationSchema.parse({ pageSize: 0 })).toThrow();
    });

    it('should reject pageSize greater than 100', () => {
      expect(() => paginationSchema.parse({ pageSize: 101 })).toThrow();
    });

    it('should accept sortBy as optional string', () => {
      const result = paginationSchema.parse({ sortBy: 'name' });
      expect(result.sortBy).toBe('name');
    });

    it('should accept sortOrder as asc or desc', () => {
      expect(paginationSchema.parse({ sortOrder: 'asc' }).sortOrder).toBe('asc');
      expect(paginationSchema.parse({ sortOrder: 'desc' }).sortOrder).toBe('desc');
    });

    it('should reject invalid sortOrder', () => {
      expect(() => paginationSchema.parse({ sortOrder: 'invalid' })).toThrow();
    });
  });

  describe('idParamSchema', () => {
    it('should accept valid ID', () => {
      const result = idParamSchema.parse({ id: 'abc123' });
      expect(result.id).toBe('abc123');
    });

    it('should reject empty ID', () => {
      expect(() => idParamSchema.parse({ id: '' })).toThrow();
    });

    it('should reject missing ID', () => {
      expect(() => idParamSchema.parse({})).toThrow();
    });
  });

  describe('hexColorSchema', () => {
    it('should accept valid hex colors', () => {
      expect(hexColorSchema.parse('#FF5733')).toBe('#FF5733');
      expect(hexColorSchema.parse('#000000')).toBe('#000000');
      expect(hexColorSchema.parse('#abcdef')).toBe('#abcdef');
    });

    it('should reject 3-digit hex colors', () => {
      expect(() => hexColorSchema.parse('#fff')).toThrow();
    });

    it('should reject colors without #', () => {
      expect(() => hexColorSchema.parse('FF5733')).toThrow();
    });

    it('should reject invalid characters', () => {
      expect(() => hexColorSchema.parse('#GGHHII')).toThrow();
    });

    it('should reject empty string', () => {
      expect(() => hexColorSchema.parse('')).toThrow();
    });
  });

  describe('idArraySchema', () => {
    it('should accept array of non-empty strings', () => {
      const result = idArraySchema.parse(['abc', 'def']);
      expect(result).toEqual(['abc', 'def']);
    });

    it('should reject empty array', () => {
      expect(() => idArraySchema.parse([])).toThrow();
    });

    it('should reject array with empty strings', () => {
      expect(() => idArraySchema.parse([''])).toThrow();
    });

    it('should reject non-array', () => {
      expect(() => idArraySchema.parse('abc')).toThrow();
    });
  });

  describe('dateSchema', () => {
    it('should coerce string to Date', () => {
      const result = dateSchema.parse('2024-01-01T00:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should accept Date objects', () => {
      const date = new Date('2024-01-01');
      const result = dateSchema.parse(date);
      expect(result).toBeInstanceOf(Date);
    });

    it('should coerce number to Date', () => {
      const timestamp = new Date('2024-01-01').getTime();
      const result = dateSchema.parse(timestamp);
      expect(result).toBeInstanceOf(Date);
    });

    it('should reject invalid date strings', () => {
      expect(() => dateSchema.parse('not-a-date')).toThrow();
    });
  });

  describe('optionalDateSchema', () => {
    it('should accept valid date', () => {
      const result = optionalDateSchema.parse('2024-01-01T00:00:00Z');
      expect(result).toBeInstanceOf(Date);
    });

    it('should accept undefined', () => {
      const result = optionalDateSchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });
});
