/**
 * Zod validation schemas for Event entities.
 * @module schemas/event
 */

import { z } from 'zod';
import {
  EventCategory,
  EventStatus,
  PrivateEventStatus,
  ParticipantStatus,
  AvailabilityStatus,
  RehearsalType,
} from '../types/event.types.js';

/**
 * Event category enum schema.
 */
export const eventCategorySchema = z.nativeEnum(EventCategory);

/**
 * Event status enum schema for workflow states.
 */
export const eventStatusSchema = z.nativeEnum(EventStatus);

/**
 * Private event status enum schema.
 */
export const privateEventStatusSchema = z.nativeEnum(PrivateEventStatus);

/**
 * Participant status enum schema.
 */
export const participantStatusSchema = z.nativeEnum(ParticipantStatus);

/**
 * Availability status enum schema.
 */
export const availabilityStatusSchema = z.nativeEnum(AvailabilityStatus);

/**
 * Rehearsal type enum schema.
 */
export const rehearsalTypeSchema = z.nativeEnum(RehearsalType);

/**
 * External person schema for guests without Clerk accounts.
 */
export const externalPersonSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  email: z.string().email().optional(),
});

/**
 * Character assignment schema for play events.
 */
export const characterAssignmentSchema = z.object({
  characterId: z.string().min(1),
  userId: z.string().nullable(),
  externalActor: externalPersonSchema.optional(),
  status: participantStatusSchema.optional(),
  notes: z.string().optional(),
});

/**
 * Crew assignment schema for play events.
 */
export const crewAssignmentSchema = z.object({
  roleDefinitionId: z.string().min(1),
  roleName: z.string().min(1),
  userId: z.string().nullable(),
  externalPerson: externalPersonSchema.optional(),
  status: participantStatusSchema.optional(),
  notes: z.string().optional(),
});

/**
 * Play event metadata schema.
 */
export const playEventMetadataSchema = z.object({
  playId: z.string().min(1),
  sceneIds: z.array(z.string()).optional(),
  characterAssignments: z.array(characterAssignmentSchema).default([]),
  crewAssignments: z.array(crewAssignmentSchema).default([]),
  rehearsalType: rehearsalTypeSchema.optional(),
  specialRequirements: z.array(z.string()).optional(),
  // Deprecated - use characterAssignments instead
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
  // New fields for workflow and status
  status: eventStatusSchema.nullish(),
  privateStatus: privateEventStatusSchema.nullish(),
  playId: z.string().nullish(),
  adminNotes: z.string().max(2000).nullish(),
  minimumNoticePeriod: z.number().int().min(0).nullish(),
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
  // New fields for workflow and status
  status: eventStatusSchema.nullish(),
  privateStatus: privateEventStatusSchema.nullish(),
  playId: z.string().nullish(),
  adminNotes: z.string().max(2000).nullish(),
  minimumNoticePeriod: z.number().int().min(0).nullish(),
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
  // New filters
  status: eventStatusSchema.optional(),
  playId: z.string().optional(),
  includeParticipants: z.coerce.boolean().default(false),
});

// =============================================================================
// Event Participant Schemas
// =============================================================================

/**
 * Schema for creating an event participant.
 */
export const createEventParticipantSchema = z.object({
  userId: z.string().nullish(),
  externalName: z.string().max(255).nullish(),
  externalContact: z.string().max(255).nullish(),
  externalEmail: z.string().email().nullish(),
  role: z.string().max(100).nullish(),
  characterId: z.string().nullish(),
  isRequired: z.boolean().default(true),
}).refine(
  (data) => data.userId || data.externalName,
  { message: 'Either userId or externalName must be provided' }
);

/**
 * Schema for updating participant status (responding to invitation).
 */
export const updateParticipantStatusSchema = z.object({
  status: participantStatusSchema,
  conflictOverride: z.boolean().optional(),
  overrideReason: z.string().max(500).optional(),
});

/**
 * Schema for bulk updating participant statuses.
 */
export const bulkUpdateParticipantsSchema = z.object({
  participantIds: z.array(z.string()).min(1),
  status: participantStatusSchema,
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
export type CreateEventParticipantSchemaInput = z.input<typeof createEventParticipantSchema>;
export type CreateEventParticipantSchemaOutput = z.output<typeof createEventParticipantSchema>;
export type UpdateParticipantStatusSchemaInput = z.input<typeof updateParticipantStatusSchema>;
export type UpdateParticipantStatusSchemaOutput = z.output<typeof updateParticipantStatusSchema>;
export type BulkUpdateParticipantsSchemaInput = z.input<typeof bulkUpdateParticipantsSchema>;
export type BulkUpdateParticipantsSchemaOutput = z.output<typeof bulkUpdateParticipantsSchema>;
export type CharacterAssignmentSchemaInput = z.input<typeof characterAssignmentSchema>;
export type CharacterAssignmentSchemaOutput = z.output<typeof characterAssignmentSchema>;
export type CrewAssignmentSchemaInput = z.input<typeof crewAssignmentSchema>;
export type CrewAssignmentSchemaOutput = z.output<typeof crewAssignmentSchema>;
export type ExternalPersonSchemaInput = z.input<typeof externalPersonSchema>;
export type ExternalPersonSchemaOutput = z.output<typeof externalPersonSchema>;

// =============================================================================
// Workflow Schemas
// =============================================================================

/**
 * Schema for responding to an invitation.
 */
export const respondToInvitationSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

/**
 * Schema for publishing an event (DRAFT → PLANNED).
 */
export const publishEventSchema = z.object({
  adminNotes: z.string().max(2000).optional(),
  forcePublish: z.boolean().default(false),
});

/**
 * Schema for cancelling an event.
 */
export const cancelEventSchema = z.object({
  reason: z.string().max(2000).optional(),
});

/**
 * Type inference for workflow schemas.
 */
export type RespondToInvitationSchemaInput = z.input<typeof respondToInvitationSchema>;
export type RespondToInvitationSchemaOutput = z.output<typeof respondToInvitationSchema>;
export type PublishEventSchemaInput = z.input<typeof publishEventSchema>;
export type PublishEventSchemaOutput = z.output<typeof publishEventSchema>;
export type CancelEventSchemaInput = z.input<typeof cancelEventSchema>;
export type CancelEventSchemaOutput = z.output<typeof cancelEventSchema>;
