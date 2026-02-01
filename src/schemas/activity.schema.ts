/**
 * Zod validation schemas for Activity-related operations.
 * @module schemas/activity
 */

import { z } from 'zod';
import { ObjectType, ActivityAction } from '../types/activity.types.js';

/**
 * Schema for validating ObjectType enum values.
 * @example
 * objectTypeSchema.parse('EVENT'); // 'EVENT'
 * objectTypeSchema.parse('INVALID'); // throws ZodError
 */
export const objectTypeSchema = z.nativeEnum(ObjectType);

/**
 * Schema for validating ActivityAction enum values.
 * @example
 * activityActionSchema.parse('CREATE'); // 'CREATE'
 * activityActionSchema.parse('INVALID'); // throws ZodError
 */
export const activityActionSchema = z.nativeEnum(ActivityAction);

/**
 * Schema for querying activities with filtering and cursor-based pagination.
 * @example
 * activityQuerySchema.parse({
 *   objectType: 'EVENT',
 *   limit: 20,
 *   cursor: 'abc123'
 * });
 */
export const activityQuerySchema = z.object({
  /** Filter by object type */
  objectType: objectTypeSchema.optional(),
  /** Filter by action type */
  action: activityActionSchema.optional(),
  /** Filter by user who performed the action */
  userId: z.string().optional(),
  /** Filter activities after this date (inclusive) */
  startDate: z.coerce.date().optional(),
  /** Filter activities before this date (inclusive) */
  endDate: z.coerce.date().optional(),
  /** Cursor for pagination (activity ID from previous page) */
  cursor: z.string().optional(),
  /** Maximum number of results to return (1-100, default 20) */
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * Schema for path parameters when fetching activities for a specific object.
 * @example
 * objectActivitiesParamsSchema.parse({
 *   objectType: 'PLAY',
 *   objectId: 'uuid-here'
 * });
 */
export const objectActivitiesParamsSchema = z.object({
  /** Type of the object to fetch activities for */
  objectType: objectTypeSchema,
  /** ID of the object */
  objectId: z.string(),
});

/** Input type for activityQuerySchema (before coercion) */
export type ActivityQuerySchemaInput = z.input<typeof activityQuerySchema>;

/** Output type for activityQuerySchema (after coercion and defaults) */
export type ActivityQuerySchemaOutput = z.output<typeof activityQuerySchema>;

/** Input type for objectActivitiesParamsSchema */
export type ObjectActivitiesParamsSchemaInput = z.input<typeof objectActivitiesParamsSchema>;

/** Output type for objectActivitiesParamsSchema */
export type ObjectActivitiesParamsSchemaOutput = z.output<typeof objectActivitiesParamsSchema>;
