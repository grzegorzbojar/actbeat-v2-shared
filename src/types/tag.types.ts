/**
 * Tag types for the Actbeat theater management system.
 * Tags provide categorization and labeling for events, plays, characters, and scenes.
 * @module types/tag
 */

/**
 * Core Tag entity matching the Prisma Tag model.
 * Represents a categorization label that can be applied to various entities.
 */
export interface Tag {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Tag name/label */
  name: string;
  /** Hex color code for display */
  color: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Input type for creating a new tag.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateTagInput {
  /** Tag name/label */
  name: string;
  /** Hex color code for display (e.g., "#FF5733") */
  color: string;
  /** Organization ID from Clerk */
  orgId: string;
}

/**
 * Input type for updating an existing tag.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateTagInput {
  /** Tag name/label */
  name?: string;
  /** Hex color code for display */
  color?: string;
}

/**
 * Query parameters for filtering tags.
 */
export interface TagQueryParams {
  /** Filter by organization ID */
  orgId?: string;
  /** Search by name (partial match) */
  search?: string;
}

/**
 * Tag response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface TagResponse {
  /** Unique identifier */
  id: string;
  /** Tag name/label */
  name: string;
  /** Hex color code for display */
  color: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Tag usage statistics.
 */
export interface TagUsageStats {
  /** Tag ID */
  tagId: string;
  /** Number of events using this tag */
  eventCount: number;
  /** Number of plays using this tag */
  playCount: number;
  /** Number of characters using this tag */
  characterCount: number;
  /** Number of scenes using this tag */
  sceneCount: number;
}
