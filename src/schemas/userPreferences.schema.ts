/**
 * Zod validation schemas for user preferences.
 * @module schemas/userPreferences
 */

import { z } from 'zod';
import { notificationPreferencesSchema } from './notification.schema.js';

/**
 * Schema for updating user preferences.
 * All fields are optional - only provided fields will be updated.
 *
 * @example
 * ```typescript
 * const input = updateUserPreferencesSchema.parse({
 *   googleCalendarEnabled: true,
 * });
 * ```
 */
export const updateUserPreferencesSchema = z.object({
  /** Enable or disable Google Calendar sync */
  googleCalendarEnabled: z.boolean().optional(),
  /** Mark onboarding wizard as completed */
  onboardingCompleted: z.boolean().optional(),
  /** Mark guided tour as completed */
  tourCompleted: z.boolean().optional(),
  /** Update notification delivery preferences */
  notificationPreferences: notificationPreferencesSchema.nullable().optional(),
  /** Enable or disable daily email digest */
  emailDigestEnabled: z.boolean().optional(),
  /** Time of day for email digest delivery (HH:mm format) */
  emailDigestTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format').optional(),
  /** Email delivery mode */
  emailDeliveryMode: z.enum(['immediate', 'smart_grouped']).optional(),
  /** User's IANA timezone (e.g. 'Europe/Warsaw') */
  timezone: z.string().min(1).max(50).optional(),
});

/**
 * Type inference from schemas.
 */
export type UpdateUserPreferencesSchemaInput = z.input<
  typeof updateUserPreferencesSchema
>;
export type UpdateUserPreferencesSchemaOutput = z.output<
  typeof updateUserPreferencesSchema
>;
