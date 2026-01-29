/**
 * Zod validation schemas for user availability API.
 * @module schemas/availability
 */

import { z } from 'zod';

/**
 * User availability status enum schema.
 */
export const userAvailabilityStatusSchema = z.enum(['FREE', 'TENTATIVE', 'BUSY', 'PARTIAL']);

/**
 * Blocking reason enum schema.
 */
export const blockingReasonSchema = z.enum([
  'PRIVATE_EVENT_CONFIRMED',
  'PRIVATE_EVENT_TENTATIVE',
  'ORG_EVENT_ACCEPTED',
  'ORG_EVENT_PENDING',
  'ORG_EVENT_DRAFT',
]);

/**
 * Time block schema for availability responses.
 */
export const timeBlockResponseSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

/**
 * Blocking event schema for detailed responses.
 */
export const blockingEventResponseSchema = z.object({
  eventId: z.string(),
  title: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  blockingReason: blockingReasonSchema,
  category: z.string(),
});

/**
 * Schema for checking single user availability query params.
 */
export const checkUserAvailabilityQuerySchema = z.object({
  start: z.coerce.date({ message: 'Start date is required and must be a valid date' }),
  end: z.coerce.date({ message: 'End date is required and must be a valid date' }),
  includeEventDetails: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  minBlockDuration: z
    .string()
    .optional()
    .default('15')
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 15 : Math.min(num, 480); // Max 8 hours
    }),
}).refine((data) => data.end > data.start, {
  message: 'End date must be after start date',
  path: ['end'],
});

/**
 * Schema for bulk availability check body.
 */
export const checkBulkAvailabilityBodySchema = z.object({
  userIds: z
    .array(z.string().min(1))
    .min(1, 'At least one user ID is required')
    .max(50, 'Maximum 50 users per request'),
  start: z.coerce.date({ message: 'Start date is required and must be a valid date' }),
  end: z.coerce.date({ message: 'End date is required and must be a valid date' }),
  includeEventDetails: z.boolean().optional().default(false),
  minBlockDuration: z.number().int().min(1).max(480).optional().default(15),
}).refine((data) => data.end > data.start, {
  message: 'End date must be after start date',
  path: ['end'],
});

/**
 * User availability response schema.
 */
export const userAvailabilityResponseSchema = z.object({
  userId: z.string(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  status: userAvailabilityStatusSchema,
  isFullyAvailable: z.boolean(),
  hasTentativeEvents: z.boolean(),
  freeBlocks: z.array(timeBlockResponseSchema),
  tentativeBlocks: z.array(timeBlockResponseSchema),
  busyBlocks: z.array(timeBlockResponseSchema),
  totalFreeMinutes: z.number(),
  totalTentativeMinutes: z.number(),
  totalBusyMinutes: z.number(),
  blockingEvents: z.array(blockingEventResponseSchema).optional(),
});

/**
 * Bulk availability response schema.
 */
export const bulkUserAvailabilityResponseSchema = z.object({
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  results: z.array(userAvailabilityResponseSchema),
  fullyAvailableUserIds: z.array(z.string()),
  partiallyAvailableUserIds: z.array(z.string()),
  tentativeUserIds: z.array(z.string()),
  unavailableUserIds: z.array(z.string()),
});

// Export inferred types
export type UserAvailabilityStatusSchema = z.infer<typeof userAvailabilityStatusSchema>;
export type BlockingReasonSchema = z.infer<typeof blockingReasonSchema>;
export type TimeBlockResponseSchema = z.infer<typeof timeBlockResponseSchema>;
export type BlockingEventResponseSchema = z.infer<typeof blockingEventResponseSchema>;
export type CheckUserAvailabilityQuerySchema = z.infer<typeof checkUserAvailabilityQuerySchema>;
export type CheckBulkAvailabilityBodySchema = z.infer<typeof checkBulkAvailabilityBodySchema>;
export type UserAvailabilityResponseSchema = z.infer<typeof userAvailabilityResponseSchema>;
export type BulkUserAvailabilityResponseSchema = z.infer<typeof bulkUserAvailabilityResponseSchema>;
