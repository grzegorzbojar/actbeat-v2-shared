/**
 * Zod validation schemas for onboarding.
 * @module schemas/onboarding
 */

import { z } from 'zod';

/**
 * Schema for the onboarding status response.
 *
 * @example
 * ```typescript
 * const status = onboardingStatusSchema.parse({
 *   onboardingCompleted: false,
 *   tourCompleted: false,
 * });
 * ```
 */
export const onboardingStatusSchema = z.object({
  /** Whether the user has completed the onboarding wizard */
  onboardingCompleted: z.boolean(),
  /** Whether the user has completed the guided tour */
  tourCompleted: z.boolean(),
});

/**
 * Schema for creating an invitation with optional tag pre-assignments.
 *
 * @example
 * ```typescript
 * const input = createInvitationWithTagsSchema.parse({
 *   emailAddress: 'actor@example.com',
 *   role: 'org:member',
 *   tagIds: ['tag-uuid-1', 'tag-uuid-2'],
 * });
 * ```
 */
export const createInvitationWithTagsSchema = z.object({
  /** Email address of the user to invite */
  emailAddress: z.string().email(),
  /** Organization role to assign */
  role: z.string(),
  /** Optional list of user tag IDs to pre-assign */
  tagIds: z.array(z.string().uuid()).optional(),
});

/**
 * Type inference from schemas.
 */
export type OnboardingStatusSchemaInput = z.input<
  typeof onboardingStatusSchema
>;
export type OnboardingStatusSchemaOutput = z.output<
  typeof onboardingStatusSchema
>;
export type CreateInvitationWithTagsSchemaInput = z.input<
  typeof createInvitationWithTagsSchema
>;
export type CreateInvitationWithTagsSchemaOutput = z.output<
  typeof createInvitationWithTagsSchema
>;
