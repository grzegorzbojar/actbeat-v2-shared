/**
 * Zod validation schemas for Event entities.
 * @module schemas/event
 */

import { z } from 'zod';
import { EventCategory } from '../types/event.types.js';

/**
 * Event category enum schema.
 */
export const eventCategorySchema = z.nativeEnum(EventCategory);

/**
 * Play event metadata schema.
 */
export const playEventMetadataSchema = z.object({
  playId: z.string().min(1),
  sceneIds: z.array(z.string()).optional(),
  characterIds: z.array(z.string()).optional(),
});

/**
 * Trial event metadata schema.
 */
export const trialEventMetadataSchema = z.object({
  characterIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * Generic event metadata schema.
 */
export const eventMetadataSchema = z.union([
  playEventMetadataSchema,
  trialEventMetadataSchema,
  z.record(z.unknown()),
]);

/**
 * Schema for creating a new event.
 */
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  organizerId: z.string().nullish(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  category: eventCategorySchema.default(EventCategory.PRIVATE),
  comment: z.string().max(2000).nullish(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  locationId: z.string().nullish(),
  parentId: z.string().nullish(),
  metadata: eventMetadataSchema.nullish(),
  participants: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
);

/**
 * Schema for updating an existing event.
 */
export const updateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  organizerId: z.string().nullish(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  category: eventCategorySchema.optional(),
  comment: z.string().max(2000).nullish(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  locationId: z.string().nullish(),
  parentId: z.string().nullish(),
  metadata: eventMetadataSchema.nullish(),
  participants: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  { message: 'End date must be after start date', path: ['endDate'] }
);

/**
 * Schema for event query parameters.
 */
export const eventQuerySchema = z.object({
  organizerId: z.string().optional(),
  category: eventCategorySchema.optional(),
  startAfter: z.coerce.date().optional(),
  startBefore: z.coerce.date().optional(),
  endAfter: z.coerce.date().optional(),
  endBefore: z.coerce.date().optional(),
  locationId: z.string().optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
  includeChildren: z.coerce.boolean().default(false),
});

/**
 * Type inference from schemas.
 */
export type CreateEventSchemaInput = z.input<typeof createEventSchema>;
export type CreateEventSchemaOutput = z.output<typeof createEventSchema>;
export type UpdateEventSchemaInput = z.input<typeof updateEventSchema>;
export type UpdateEventSchemaOutput = z.output<typeof updateEventSchema>;
export type EventQuerySchemaInput = z.input<typeof eventQuerySchema>;
export type EventQuerySchemaOutput = z.output<typeof eventQuerySchema>;
