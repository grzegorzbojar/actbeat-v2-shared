/**
 * Play types for the Actbeat theater management system.
 * Plays represent theater productions with associated characters and scenes.
 * @module types/play
 */

import type { Character } from './character.types.js';
import type { Scene } from './scene.types.js';
import type { Tag } from './tag.types.js';

/**
 * Assignment type for crew roles.
 * - 'userTag': Filter/require users from a specific user tag
 * - 'specificUsers': Select specific people directly
 */
export type CrewRoleAssignmentType = 'userTag' | 'specificUsers';

/**
 * Crew role definition stored as JSON on Play.
 * Defines a crew position that can be assigned to events.
 */
export interface CrewRoleDefinition {
  /** Unique identifier (UUID v4) */
  id: string;
  /** Role name (max 50 chars, unique within play) */
  name: string;
  /** Optional description (max 500 chars) */
  description?: string;
  /** Hex color code for display (#RRGGBB) */
  color: string;
  /** Number of people required for this role (1-99) */
  requiredCount: number;
  /** Order index for drag-drop sorting */
  orderIndex: number;

  /**
   * Assignment type discriminator.
   * - 'userTag': Users are selected from a user tag
   * - 'specificUsers': Specific users are assigned directly
   */
  assignmentType: CrewRoleAssignmentType;

  /**
   * User tag ID for filtering users.
   * Required when assignmentType === 'userTag'.
   */
  userTagId?: string;

  /**
   * Array of Clerk user IDs for direct assignment.
   * Required when assignmentType === 'specificUsers'.
   * Must have at least 1 user when this mode is selected.
   */
  assignedUserIds?: string[];

  /**
   * Whether this role is optional.
   * Optional roles are not required during scheduling.
   */
  isOptional?: boolean;
}

/**
 * Core Play entity matching the Prisma Play model.
 * Represents a theater production in the system.
 */
export interface Play {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Play name/title */
  name: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Duration in minutes */
  duration: number;
  /** Optional hex color code for display */
  color: string | null;
  /** Default location ID for this play's events */
  defaultLocationId: string | null;
  /** Crew role definitions for this play */
  crewRoles: CrewRoleDefinition[] | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Play with all relations loaded.
 */
export interface PlayWithRelations extends Play {
  /** Characters in this play */
  characters: Character[];
  /** Scenes in this play */
  scenes: Scene[];
  /** Associated tags */
  tags: Tag[];
  /** Default location for this play's events */
  defaultLocation: { id: string; name: string | null; address: string | null; latitude: number | null; longitude: number | null } | null;
}

/**
 * Input type for creating a new play.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreatePlayInput {
  /** Play name/title */
  name: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Duration in minutes */
  duration: number;
  /** Optional hex color code for display */
  color?: string | null;
  /** Default location ID for this play's events */
  defaultLocationId?: string | null;
  /** Array of tag IDs to associate */
  tagIds?: string[];
  /** Crew role definitions */
  crewRoles?: CrewRoleDefinition[] | null;
}

/**
 * Input type for updating an existing play.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdatePlayInput {
  /** Play name/title */
  name?: string;
  /** Duration in minutes */
  duration?: number;
  /** Optional hex color code for display */
  color?: string | null;
  /** Default location ID for this play's events */
  defaultLocationId?: string | null;
  /** Array of tag IDs to associate */
  tagIds?: string[];
  /** Crew role definitions */
  crewRoles?: CrewRoleDefinition[] | null;
}

/**
 * Query parameters for filtering plays.
 */
export interface PlayQueryParams {
  /** Filter by organization ID */
  orgId?: string;
  /** Search by name (partial match) */
  search?: string;
  /** Filter by tag IDs (any match) */
  tagIds?: string[];
}

/**
 * Play response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface PlayResponse {
  /** Unique identifier */
  id: string;
  /** Play name/title */
  name: string;
  /** Organization ID from Clerk */
  orgId: string;
  /** Duration in minutes */
  duration: number;
  /** Optional hex color code for display */
  color: string | null;
  /** Default location ID for this play's events */
  defaultLocationId: string | null;
  /** Crew role definitions for this play */
  crewRoles: CrewRoleDefinition[] | null;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Play response with relations for detailed views.
 */
export interface PlayResponseWithRelations extends PlayResponse {
  /** Characters in this play */
  characters: Character[];
  /** Scenes in this play */
  scenes: Scene[];
  /** Associated tags */
  tags: Tag[];
  /** Default location for this play's events */
  defaultLocation: { id: string; name: string | null; address: string | null; latitude: number | null; longitude: number | null } | null;
}

/**
 * Summary statistics for a play.
 */
export interface PlayStats {
  /** Total number of characters */
  characterCount: number;
  /** Total number of scenes */
  sceneCount: number;
  /** Number of unique actors assigned */
  actorCount: number;
}
