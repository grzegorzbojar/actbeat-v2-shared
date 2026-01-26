/**
 * Zod validation schemas for user preferences.
 * @module schemas/userPreferences
 */

import { z } from 'zod';

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
