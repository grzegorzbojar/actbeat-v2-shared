/**
 * Zod validation schemas for Search functionality.
 * @module schemas/search
 */

import { z } from 'zod';

/**
 * Date range schema used in search queries.
 */
export const dateRangeSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
}).refine(
  (data) => data.end > data.start,
  { message: 'End date must be after start date', path: ['end'] }
);

/**
 * Schema for searching play availability.
 */
export const searchPlayAvailabilitySchema = z.object({
  playId: z.string().min(1, 'Play ID is required'),
  dateRange: dateRangeSchema,
  minDuration: z
    .number()
    .int()
    .min(1, 'Minimum duration must be at least 1 minute')
    .max(1440, 'Maximum duration is 24 hours')
    .default(60),
  allowMultipleRoles: z.boolean().default(false),
  characterIds: z.array(z.string()).optional(),
  excludeUserIds: z.array(z.string()).default([]),
});

/**
 * Schema for searching scene availability.
 */
export const searchSceneAvailabilitySchema = z.object({
  sceneId: z.string().min(1, 'Scene ID is required'),
  dateRange: dateRangeSchema,
  minDuration: z
    .number()
    .int()
    .min(1, 'Minimum duration must be at least 1 minute')
    .max(1440, 'Maximum duration is 24 hours')
    .default(60),
  allowMultipleRoles: z.boolean().default(false),
  excludeUserIds: z.array(z.string()).default([]),
});

/**
 * Schema for searching available plays.
 */
export const searchPlaysSchema = z.object({
  orgId: z.string().min(1, 'Organization ID is required'),
  dateRange: dateRangeSchema,
  minDuration: z
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(60),
});

/**
 * Schema for searching available scenes.
 */
export const searchScenesSchema = z.object({
  playId: z.string().min(1, 'Play ID is required'),
  dateRange: dateRangeSchema,
  minDuration: z
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(60),
});

/**
 * Schema for batch search request.
 */
export const batchSearchSchema = z.object({
  sceneIds: z.array(z.string()).min(1, 'At least one scene ID is required').max(50, 'Maximum 50 scenes per batch'),
  dateRange: dateRangeSchema,
  minDuration: z
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(60),
  allowMultipleRoles: z.boolean().default(false),
});

/**
 * Type inference from schemas.
 */
export type DateRangeSchemaInput = z.input<typeof dateRangeSchema>;
export type DateRangeSchemaOutput = z.output<typeof dateRangeSchema>;
export type SearchPlayAvailabilitySchemaInput = z.input<typeof searchPlayAvailabilitySchema>;
export type SearchPlayAvailabilitySchemaOutput = z.output<typeof searchPlayAvailabilitySchema>;
export type SearchSceneAvailabilitySchemaInput = z.input<typeof searchSceneAvailabilitySchema>;
export type SearchSceneAvailabilitySchemaOutput = z.output<typeof searchSceneAvailabilitySchema>;
export type SearchPlaysSchemaInput = z.input<typeof searchPlaysSchema>;
export type SearchPlaysSchemaOutput = z.output<typeof searchPlaysSchema>;
export type SearchScenesSchemaInput = z.input<typeof searchScenesSchema>;
export type SearchScenesSchemaOutput = z.output<typeof searchScenesSchema>;
export type BatchSearchSchemaInput = z.input<typeof batchSearchSchema>;
export type BatchSearchSchemaOutput = z.output<typeof batchSearchSchema>;
