/**
 * User tag types for the Actbeat theater management system.
 * User tags categorize organization members (e.g., "Actor", "Director", "Stage Crew").
 * @module types/userTag
 */

/**
 * Core UserTag entity matching the Prisma UserTag model.
 * Represents a categorization label for organization members.
 */
export interface UserTag {
  /** Unique identifier */
  id: string;
  /** Tag name/label */
  name: string;
  /** Hex color code for display */
  color: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Whether this tag is assigned by default to new members */
  isDefault: boolean;
  /** When the tag was created */
  createdAt: Date;
  /** When the tag was last updated */
  updatedAt: Date;
  /** Number of users assigned to this tag (optional, populated in list queries) */
  userCount?: number;
}

/**
 * User tag assignment entity.
 * Represents the many-to-many relationship between users and user tags.
 */
export interface UserTagAssignment {
  /** Unique identifier for the assignment */
  id: string;
  /** Clerk user ID of the assigned user */
  userId: string;
  /** ID of the assigned tag */
  tagId: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** When the assignment was created */
  createdAt: Date;
  /** The tag details (optional, populated via relation) */
  tag?: UserTag;
}

/**
 * User tag response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface UserTagResponse {
  /** Unique identifier */
  id: string;
  /** Tag name/label */
  name: string;
  /** Hex color code for display */
  color: string;
  /** Whether this tag is assigned by default to new members */
  isDefault: boolean;
  /** Number of users assigned to this tag (optional) */
  userCount?: number;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * User with their assigned tags.
 * Used in responses that include a user's tag assignments.
 */
export interface UserWithTags {
  /** Clerk user ID */
  userId: string;
  /** Tags assigned to this user */
  tags: UserTagResponse[];
}

/**
 * User's tags grouped by organization.
 * Used in the personal dashboard to show tags across all orgs.
 */
export interface UserOrganizationTagsEntry {
  /** Organization ID */
  orgId: string;
  /** Tags assigned to the user in this organization */
  tags: UserTagResponse[];
}
