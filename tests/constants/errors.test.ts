/**
 * Tests for error codes and messages.
 */

import { describe, it, expect } from 'vitest';
import {
  ErrorCode,
  ERROR_MESSAGES,
  ERROR_HTTP_STATUS,
  getErrorMessage,
  getHttpStatus,
} from '../../src/constants/errors.js';

describe('Error Constants', () => {
  describe('ErrorCode enum', () => {
    it('should have authentication error codes', () => {
      expect(ErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
      expect(ErrorCode.INVALID_TOKEN).toBe('INVALID_TOKEN');
      expect(ErrorCode.TOKEN_EXPIRED).toBe('TOKEN_EXPIRED');
    });

    it('should have validation error codes', () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.INVALID_INPUT).toBe('INVALID_INPUT');
      expect(ErrorCode.INVALID_DATE_RANGE).toBe('INVALID_DATE_RANGE');
    });

    it('should have not found error codes', () => {
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.EVENT_NOT_FOUND).toBe('EVENT_NOT_FOUND');
      expect(ErrorCode.PLAY_NOT_FOUND).toBe('PLAY_NOT_FOUND');
      expect(ErrorCode.CHARACTER_NOT_FOUND).toBe('CHARACTER_NOT_FOUND');
    });

    it('should have conflict error codes', () => {
      expect(ErrorCode.CONFLICT).toBe('CONFLICT');
      expect(ErrorCode.DUPLICATE_ENTRY).toBe('DUPLICATE_ENTRY');
      expect(ErrorCode.ALREADY_EXISTS).toBe('ALREADY_EXISTS');
    });

    it('should have server error codes', () => {
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR');
      expect(ErrorCode.EXTERNAL_SERVICE_ERROR).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have a message for every error code', () => {
      for (const code of Object.values(ErrorCode)) {
        expect(ERROR_MESSAGES[code]).toBeDefined();
        expect(typeof ERROR_MESSAGES[code]).toBe('string');
        expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
      }
    });

    it('should have descriptive messages', () => {
      expect(ERROR_MESSAGES[ErrorCode.NOT_FOUND]).toBe('The requested resource was not found.');
      expect(ERROR_MESSAGES[ErrorCode.UNAUTHORIZED]).toBe('Unauthorized access.');
      expect(ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR]).toBe('An internal server error occurred.');
    });
  });

  describe('ERROR_HTTP_STATUS', () => {
    it('should have a status code for every error code', () => {
      for (const code of Object.values(ErrorCode)) {
        expect(ERROR_HTTP_STATUS[code]).toBeDefined();
        expect(typeof ERROR_HTTP_STATUS[code]).toBe('number');
      }
    });

    it('should map auth errors to 401/403', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.UNAUTHORIZED]).toBe(401);
      expect(ERROR_HTTP_STATUS[ErrorCode.FORBIDDEN]).toBe(403);
      expect(ERROR_HTTP_STATUS[ErrorCode.INVALID_TOKEN]).toBe(401);
      expect(ERROR_HTTP_STATUS[ErrorCode.TOKEN_EXPIRED]).toBe(401);
    });

    it('should map validation errors to 400', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.VALIDATION_ERROR]).toBe(400);
      expect(ERROR_HTTP_STATUS[ErrorCode.INVALID_INPUT]).toBe(400);
      expect(ERROR_HTTP_STATUS[ErrorCode.INVALID_DATE_RANGE]).toBe(400);
    });

    it('should map not found errors to 404', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.NOT_FOUND]).toBe(404);
      expect(ERROR_HTTP_STATUS[ErrorCode.EVENT_NOT_FOUND]).toBe(404);
      expect(ERROR_HTTP_STATUS[ErrorCode.PLAY_NOT_FOUND]).toBe(404);
      expect(ERROR_HTTP_STATUS[ErrorCode.USER_NOT_FOUND]).toBe(404);
    });

    it('should map conflict errors to 409', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.CONFLICT]).toBe(409);
      expect(ERROR_HTTP_STATUS[ErrorCode.DUPLICATE_ENTRY]).toBe(409);
      expect(ERROR_HTTP_STATUS[ErrorCode.ALREADY_EXISTS]).toBe(409);
    });

    it('should map business logic errors to 422', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.NO_ACCESSIBLE_CHARACTERS]).toBe(422);
      expect(ERROR_HTTP_STATUS[ErrorCode.CHARACTER_ID_MISSING]).toBe(422);
    });

    it('should map server errors to 500/502', () => {
      expect(ERROR_HTTP_STATUS[ErrorCode.INTERNAL_ERROR]).toBe(500);
      expect(ERROR_HTTP_STATUS[ErrorCode.DATABASE_ERROR]).toBe(500);
      expect(ERROR_HTTP_STATUS[ErrorCode.EXTERNAL_SERVICE_ERROR]).toBe(502);
    });
  });

  describe('getErrorMessage', () => {
    it('should return correct message for error code', () => {
      expect(getErrorMessage(ErrorCode.NOT_FOUND)).toBe('The requested resource was not found.');
      expect(getErrorMessage(ErrorCode.UNAUTHORIZED)).toBe('Unauthorized access.');
    });

    it('should return message for every error code', () => {
      for (const code of Object.values(ErrorCode)) {
        const message = getErrorMessage(code);
        expect(message).toBe(ERROR_MESSAGES[code]);
      }
    });
  });

  describe('getHttpStatus', () => {
    it('should return correct HTTP status for error code', () => {
      expect(getHttpStatus(ErrorCode.NOT_FOUND)).toBe(404);
      expect(getHttpStatus(ErrorCode.UNAUTHORIZED)).toBe(401);
      expect(getHttpStatus(ErrorCode.INTERNAL_ERROR)).toBe(500);
    });

    it('should return status for every error code', () => {
      for (const code of Object.values(ErrorCode)) {
        const status = getHttpStatus(code);
        expect(status).toBe(ERROR_HTTP_STATUS[code]);
      }
    });
  });
});
