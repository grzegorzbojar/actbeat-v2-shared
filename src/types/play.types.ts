/**
 * Play types for the Actbeat theater management system.
 * Plays represent theater productions with associated characters and scenes.
 * @module types/play
 */

import type { Character } from './character.types.js';
import type { Scene } from './scene.types.js';
import type { Tag } from './tag.types.js';

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
  /** Array of tag IDs to associate */
  tagIds?: string[];
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
  /** Array of tag IDs to associate */
  tagIds?: string[];
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
