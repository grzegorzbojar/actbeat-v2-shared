/**
 * Common Zod validation schemas used across multiple entities.
 * @module schemas/common
 */

import { z } from 'zod';

/**
 * Schema for pagination parameters.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Schema for ID parameter (route params).
 */
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

/**
 * Schema for hex color validation.
 */
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format (expected #RRGGBB)');

/**
 * Schema for array of IDs.
 */
export const idArraySchema = z.array(z.string().min(1)).min(1);

/**
 * Schema for date string or Date object coercion.
 */
export const dateSchema = z.coerce.date();

/**
 * Schema for optional date string or Date object.
 */
export const optionalDateSchema = z.coerce.date().optional();

/**
 * Type inference from schemas.
 */
export type PaginationSchemaInput = z.input<typeof paginationSchema>;
export type PaginationSchemaOutput = z.output<typeof paginationSchema>;
export type IdParamSchemaInput = z.input<typeof idParamSchema>;
export type IdParamSchemaOutput = z.output<typeof idParamSchema>;
