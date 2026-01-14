/**
 * User types for the Actbeat theater management system.
 * Users are managed by Clerk and these types represent the data we work with.
 * @module types/user
 */

/**
 * User profile from Clerk.
 * Represents a user account in the system.
 */
export interface User {
  /** Clerk user ID */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string | null;
  /** User's last name */
  lastName: string | null;
  /** URL to user's profile image */
  imageUrl: string | null;
  /** Whether email is verified */
  emailVerified: boolean;
  /** User creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Minimal user info for display purposes.
 */
export interface UserSummary {
  /** Clerk user ID */
  id: string;
  /** User's display name (first + last or email) */
  displayName: string;
  /** URL to user's profile image */
  imageUrl: string | null;
}

/**
 * Organization from Clerk.
 * Represents a theater group or company.
 */
export interface Organization {
  /** Clerk organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Organization slug for URLs */
  slug: string;
  /** URL to organization's logo */
  imageUrl: string | null;
  /** Organization creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Organization membership role.
 */
export type OrganizationRole = 'admin' | 'basic_member' | 'actor' | 'ghost';

/**
 * Organization membership from Clerk.
 * Represents a user's membership in an organization.
 */
export interface OrganizationMembership {
  /** Membership ID */
  id: string;
  /** Organization ID */
  organizationId: string;
  /** User ID */
  userId: string;
  /** Role within the organization */
  role: OrganizationRole;
  /** When the user joined */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Organization membership with expanded user data.
 */
export interface OrganizationMembershipWithUser extends OrganizationMembership {
  /** User profile data */
  user: User;
}

/**
 * Invitation to join an organization.
 */
export interface OrganizationInvitation {
  /** Invitation ID */
  id: string;
  /** Organization ID */
  organizationId: string;
  /** Email address of invitee */
  email: string;
  /** Role to assign when invitation is accepted */
  role: OrganizationRole;
  /** Invitation status */
  status: 'pending' | 'accepted' | 'revoked';
  /** Who sent the invitation */
  invitedBy: string;
  /** When the invitation was created */
  createdAt: Date;
  /** When the invitation expires */
  expiresAt: Date;
}

/**
 * Input for creating an organization invitation.
 */
export interface CreateInvitationInput {
  /** Email address of invitee */
  email: string;
  /** Role to assign when invitation is accepted */
  role?: OrganizationRole;
}

/**
 * User response DTO for API responses.
 */
export interface UserResponse {
  /** Clerk user ID */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string | null;
  /** User's last name */
  lastName: string | null;
  /** URL to user's profile image */
  imageUrl: string | null;
  /** User creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Current authenticated user with organization context.
 */
export interface AuthenticatedUser {
  /** User profile */
  user: User;
  /** Current organization (if in org context) */
  organization: Organization | null;
  /** User's role in current organization */
  organizationRole: OrganizationRole | null;
  /** User's permissions in current context */
  permissions: string[];
}
