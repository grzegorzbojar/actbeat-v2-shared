/**
 * Zod validation schemas for Tag entities.
 * @module schemas/tag
 */

import { z } from 'zod';

/**
 * Schema for creating a new tag.
 */
export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format (expected #RRGGBB)'),
  orgId: z.string().min(1, 'Organization ID is required'),
});

/**
 * Schema for updating an existing tag.
 */
export const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format (expected #RRGGBB)')
    .optional(),
});

/**
 * Schema for tag query parameters.
 */
export const tagQuerySchema = z.object({
  orgId: z.string().optional(),
  search: z.string().max(100).optional(),
});

/**
 * Type inference from schemas.
 */
export type CreateTagSchemaInput = z.input<typeof createTagSchema>;
export type CreateTagSchemaOutput = z.output<typeof createTagSchema>;
export type UpdateTagSchemaInput = z.input<typeof updateTagSchema>;
export type UpdateTagSchemaOutput = z.output<typeof updateTagSchema>;
export type TagQuerySchemaInput = z.input<typeof tagQuerySchema>;
export type TagQuerySchemaOutput = z.output<typeof tagQuerySchema>;
