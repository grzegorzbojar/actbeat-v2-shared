/**
 * Onboarding types for the Actbeat theater management system.
 * Manages user onboarding state, guided tours, and invitation tag pre-assignments.
 * @module types/onboarding
 */

/**
 * Response DTO for the current user's onboarding status.
 * Used by the frontend to determine which onboarding steps to show.
 */
export interface OnboardingStatusResponse {
  /** Whether the user has completed the onboarding wizard */
  onboardingCompleted: boolean;
  /** Whether the user has completed the guided tour */
  tourCompleted: boolean;
}

/**
 * Represents a pre-assignment of a user tag to an invited user.
 * When a user is invited to the organization, tags can be pre-assigned
 * so they are applied automatically once the user accepts the invitation.
 */
export interface InvitationTagPreAssignment {
  /** Unique identifier for the pre-assignment record */
  id: string;
  /** Email address of the invited user */
  email: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** ID of the user tag to assign upon invitation acceptance */
  tagId: string;
  /** Clerk user ID of the admin who created the invitation */
  createdBy: string;
  /** When the pre-assignment was created (ISO string) */
  createdAt: string;
}

/**
 * Input for creating an organization invitation with optional tag pre-assignments.
 * Extends the standard invitation flow with the ability to assign user tags upfront.
 */
export interface CreateInvitationWithTagsInput {
  /** Email address of the user to invite */
  emailAddress: string;
  /** Organization role to assign (e.g., "org:member", "org:admin") */
  role: string;
  /** Optional list of user tag IDs to pre-assign to the invited user */
  tagIds?: string[];
}
