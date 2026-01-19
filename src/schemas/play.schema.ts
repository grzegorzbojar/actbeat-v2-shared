/**
 * Zod validation schemas for Play entities.
 * @module schemas/play
 */

import { z } from 'zod';

/**
 * Schema for creating a new play.
 */
export const createPlaySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  orgId: z.string().min(1, 'Organization ID is required'),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  defaultLocationId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
});

/**
 * Schema for updating an existing play.
 */
export const updatePlaySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  defaultLocationId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

/**
 * Schema for play query parameters.
 */
export const playQuerySchema = z.object({
  orgId: z.string().optional(),
  search: z.string().max(100).optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
});

/**
 * Type inference from schemas.
 */
export type CreatePlaySchemaInput = z.input<typeof createPlaySchema>;
export type CreatePlaySchemaOutput = z.output<typeof createPlaySchema>;
export type UpdatePlaySchemaInput = z.input<typeof updatePlaySchema>;
export type UpdatePlaySchemaOutput = z.output<typeof updatePlaySchema>;
export type PlayQuerySchemaInput = z.input<typeof playQuerySchema>;
export type PlayQuerySchemaOutput = z.output<typeof playQuerySchema>;
