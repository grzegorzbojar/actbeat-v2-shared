/**
 * Open Role types for the Actbeat theater management system.
 * Open roles allow event admins to define positions that organization members
 * can self-signup for based on their user tags.
 * @module types/openRole
 */

import type { UserTagResponse } from './userTag.types.js';
import type { EventParticipantResponse } from './event.types.js';

/**
 * Core EventOpenRole entity matching the Prisma model.
 * Represents a role slot on an event that users can sign up for.
 */
export interface EventOpenRole {
  /** Unique identifier */
  id: string;
  /** ID of the associated event */
  eventId: string;
  /** Name of the role (e.g., "Stage Hand", "Lighting Tech") */
  roleName: string;
  /** Number of people needed for this role */
  slotsNeeded: number;
  /** When the role was created */
  createdAt: Date;
  /** When the role was last updated */
  updatedAt: Date;
}

/**
 * EventOpenRole with relations loaded.
 */
export interface EventOpenRoleWithRelations extends EventOpenRole {
  /** Tags that make a user eligible for this role (OR logic) */
  requiredTags: UserTagResponse[];
  /** Current signups for this role */
  signups: EventRoleSignupResponse[];
}

/**
 * Signup record for an open role.
 */
export interface EventRoleSignup {
  /** Unique identifier */
  id: string;
  /** ID of the open role */
  openRoleId: string;
  /** Clerk user ID of the signed-up user */
  userId: string;
  /** When the user signed up */
  signedUpAt: Date;
  /** Link to the EventParticipant record created on signup */
  participantId: string | null;
}

/**
 * Open role response DTO for API responses.
 * Includes computed fields and converts dates to ISO strings.
 */
export interface EventOpenRoleResponse {
  /** Unique identifier */
  id: string;
  /** ID of the associated event */
  eventId: string;
  /** Name of the role */
  roleName: string;
  /** Number of slots needed */
  slotsNeeded: number;
  /** Number of slots currently filled */
  slotsFilled: number;
  /** Tags required for eligibility (OR logic) */
  requiredTags: UserTagResponse[];
  /** Current signups with user details */
  signups: EventRoleSignupResponse[];
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Signup response DTO for API responses.
 */
export interface EventRoleSignupResponse {
  /** Unique identifier */
  id: string;
  /** ID of the open role */
  openRoleId: string;
  /** Clerk user ID */
  userId: string;
  /** User's display name (denormalized) */
  userName: string;
  /** User's profile image URL */
  userImageUrl: string | null;
  /** Link to the EventParticipant record */
  participantId: string | null;
  /** Signup timestamp as ISO string */
  signedUpAt: string;
}

/**
 * Input for creating a new open role.
 */
export interface CreateOpenRoleInput {
  /** Name of the role */
  roleName: string;
  /** Number of slots needed (default: 1) */
  slotsNeeded?: number;
  /** IDs of required user tags (at least one required) */
  requiredTagIds: string[];
}

/**
 * Input for updating an open role.
 */
export interface UpdateOpenRoleInput {
  /** Updated role name */
  roleName?: string;
  /** Updated number of slots */
  slotsNeeded?: number;
  /** Updated required tag IDs */
  requiredTagIds?: string[];
}

/**
 * Response from signing up for a role.
 */
export interface SignupForRoleResponse {
  /** The created signup record */
  signup: EventRoleSignupResponse;
  /** The created participant record */
  participant: EventParticipantResponse;
  /** True if the event transitioned to SCHEDULED as a result */
  eventTransitioned: boolean;
}

/**
 * Response from admin assigning a user to a role.
 */
export interface AdminAssignRoleResponse {
  /** The created signup record */
  signup: EventRoleSignupResponse;
  /** The created participant record */
  participant: EventParticipantResponse;
  /** True if the event transitioned to SCHEDULED as a result */
  eventTransitioned: boolean;
}

/**
 * An open role that is available for the current user to sign up for.
 * Used in the personal "Available Roles" list.
 */
export interface AvailableOpenRole {
  /** Open role ID */
  id: string;
  /** Event ID */
  eventId: string;
  /** Event title */
  eventTitle: string;
  /** Event start date as ISO string */
  eventStartDate: string;
  /** Event end date as ISO string */
  eventEndDate: string;
  /** Event location name (if any) */
  eventLocationName: string | null;
  /** Organization ID */
  orgId: string;
  /** Organization name */
  orgName: string;
  /** Role name */
  roleName: string;
  /** Number of slots needed */
  slotsNeeded: number;
  /** Number of slots already filled */
  slotsFilled: number;
  /** Number of slots still available */
  slotsAvailable: number;
  /** Tags required for eligibility */
  requiredTags: UserTagResponse[];
  /** Whether the user has a scheduling conflict */
  hasAvailabilityConflict: boolean;
  /** Warning message for conflicts */
  conflictWarning?: string;
}

/**
 * Response for listing available roles for a user.
 */
export interface AvailableRolesResponse {
  /** Available roles across all organizations */
  roles: AvailableOpenRole[];
  /** Total count of available roles */
  totalCount: number;
}

/**
 * Input for admin-assigning a user to a role.
 */
export interface AdminAssignUserInput {
  /** Clerk user ID of the user to assign */
  userId: string;
}
