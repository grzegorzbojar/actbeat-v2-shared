/**
 * Zod schemas for bulk action operations.
 * @module schemas/bulk
 */

import { z } from 'zod';
import { idArraySchema } from './common.schema.js';
import { participantStatusSchema } from './event.schema.js';

/**
 * Schema for bulk IDs request body.
 * Used by most bulk endpoints that operate on a list of IDs.
 */
export const bulkIdsSchema = z.object({
  ids: idArraySchema,
});

/**
 * Schema for bulk publish action (DRAFT → PLANNED).
 * Optionally allows skipping healthcheck validation.
 */
export const bulkPublishSchema = z.object({
  ids: idArraySchema,
  /** Skip healthcheck validation (admin override) */
  skipHealthcheck: z.boolean().optional().default(false),
  /** Admin notes for overriding warnings */
  adminNotes: z.string().optional(),
  /** Source of the bulk publish (for notification grouping) */
  source: z.enum(['scheduler', 'calendar']).optional(),
});

/**
 * Schema for bulk update location action.
 */
export const bulkUpdateLocationSchema = z.object({
  ids: idArraySchema,
  /** New location ID to set */
  locationId: z.string().min(1),
});

/**
 * Schema for bulk respond to invitations.
 */
export const bulkRespondSchema = z.object({
  ids: idArraySchema,
  /** Response status (ACCEPTED or DECLINED) */
  status: participantStatusSchema.refine(
    (status) => status === 'ACCEPTED' || status === 'DECLINED',
    { message: 'Status must be ACCEPTED or DECLINED' }
  ),
});

/**
 * Schema for bulk confirm private events (TENTATIVE → CONFIRMED).
 */
export const bulkConfirmPrivateEventsSchema = z.object({
  ids: idArraySchema,
});

/**
 * Schema for bulk delete (events or private events).
 */
export const bulkDeleteSchema = z.object({
  ids: idArraySchema,
});

// Type inferences
export type BulkIdsSchemaInput = z.input<typeof bulkIdsSchema>;
export type BulkIdsSchemaOutput = z.output<typeof bulkIdsSchema>;

export type BulkPublishSchemaInput = z.input<typeof bulkPublishSchema>;
export type BulkPublishSchemaOutput = z.output<typeof bulkPublishSchema>;

export type BulkUpdateLocationSchemaInput = z.input<typeof bulkUpdateLocationSchema>;
export type BulkUpdateLocationSchemaOutput = z.output<typeof bulkUpdateLocationSchema>;

export type BulkRespondSchemaInput = z.input<typeof bulkRespondSchema>;
export type BulkRespondSchemaOutput = z.output<typeof bulkRespondSchema>;

export type BulkConfirmPrivateEventsSchemaInput = z.input<typeof bulkConfirmPrivateEventsSchema>;
export type BulkConfirmPrivateEventsSchemaOutput = z.output<typeof bulkConfirmPrivateEventsSchema>;

export type BulkDeleteSchemaInput = z.input<typeof bulkDeleteSchema>;
export type BulkDeleteSchemaOutput = z.output<typeof bulkDeleteSchema>;
