/**
 * Zod validation schemas for Organization Events (PLAY, TRIAL, TECHNICAL).
 * @module schemas/orgEvent
 */

import { z } from 'zod';
import { eventStatusSchema, playEventMetadataSchema } from './event.schema.js';
import { hexColorSchema } from './common.schema.js';
import { EventStatus } from '../types/event.types.js';

/**
 * Organization event category - excludes PRIVATE.
 */
export const orgEventCategorySchema = z.enum(['PLAY', 'TRIAL', 'TECHNICAL']);

/**
 * Schema for creating an organization event.
 * Follows architecture: POST /api/events
 */
export const createOrgEventSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    category: orgEventCategorySchema,
    status: eventStatusSchema.default(EventStatus.DRAFT),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    comment: z.string().max(2000).nullish(),
    color: hexColorSchema.nullish(),
    locationId: z.string().nullish(),
    playId: z.string().nullish(), // Required for PLAY category
    metadata: playEventMetadataSchema.nullish(), // Typed for PLAY events
    tagIds: z.array(z.string()).default([]),
    adminNotes: z.string().max(2000).nullish(),
    minimumNoticePeriod: z.number().int().min(0).nullish(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine((data) => data.category !== 'PLAY' || data.playId, {
    message: 'playId is required for PLAY events',
    path: ['playId'],
  });

/**
 * Schema for updating an organization event.
 * All fields are optional.
 */
export const updateOrgEventSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    category: orgEventCategorySchema.optional(),
    status: eventStatusSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    comment: z.string().max(2000).nullish(),
    color: hexColorSchema.nullish(),
    locationId: z.string().nullish(),
    playId: z.string().nullish(),
    metadata: playEventMetadataSchema.nullish(),
    tagIds: z.array(z.string()).optional(),
    adminNotes: z.string().max(2000).nullish(),
    minimumNoticePeriod: z.number().int().min(0).nullish(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    { message: 'End date must be after start date', path: ['endDate'] }
  );

/**
 * Query parameters for listing organization events.
 */
export const listOrgEventsQuerySchema = z.object({
  category: orgEventCategorySchema.optional(),
  status: eventStatusSchema.optional(),
  startAfter: z.coerce.date().optional(),
  endBefore: z.coerce.date().optional(),
  playId: z.string().optional(),
  locationId: z.string().optional(),
  includeParticipants: z.coerce.boolean().default(false),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(50),
});

// Export inferred types
export type OrgEventCategory = z.infer<typeof orgEventCategorySchema>;
export type CreateOrgEventInput = z.infer<typeof createOrgEventSchema>;
export type UpdateOrgEventInput = z.infer<typeof updateOrgEventSchema>;
export type ListOrgEventsQuery = z.infer<typeof listOrgEventsQuerySchema>;
