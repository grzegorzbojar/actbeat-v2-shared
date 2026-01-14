/**
 * Scene types for the Actbeat theater management system.
 * Scenes represent individual parts of plays with associated characters.
 * @module types/scene
 */

import type { Character } from './character.types.js';
import type { Play } from './play.types.js';
import type { Tag } from './tag.types.js';

/**
 * Core Scene entity matching the Prisma Scene model.
 * Represents a scene within a theater production.
 */
export interface Scene {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Scene name/title */
  name: string;
  /** ID of the play this scene belongs to */
  playId: string;
  /** Optional hex color code for display */
  color: string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Scene with all relations loaded.
 */
export interface SceneWithRelations extends Scene {
  /** The play this scene belongs to */
  play: Play;
  /** Characters appearing in this scene */
  characters: Character[];
  /** Associated tags */
  tags: Tag[];
}

/**
 * Input type for creating a new scene.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateSceneInput {
  /** Scene name/title */
  name: string;
  /** ID of the play this scene belongs to */
  playId: string;
  /** Optional hex color code for display */
  color?: string | null;
  /** Array of character IDs appearing in this scene */
  characterIds?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Input type for updating an existing scene.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateSceneInput {
  /** Scene name/title */
  name?: string;
  /** Optional hex color code for display */
  color?: string | null;
  /** Array of character IDs appearing in this scene */
  characterIds?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Query parameters for filtering scenes.
 */
export interface SceneQueryParams {
  /** Filter by play ID */
  playId?: string;
  /** Search by name (partial match) */
  search?: string;
  /** Filter by character ID */
  characterId?: string;
  /** Filter by tag IDs (any match) */
  tagIds?: string[];
}

/**
 * Scene response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface SceneResponse {
  /** Unique identifier */
  id: string;
  /** Scene name/title */
  name: string;
  /** ID of the play this scene belongs to */
  playId: string;
  /** Optional hex color code for display */
  color: string | null;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Scene response with relations for detailed views.
 */
export interface SceneResponseWithRelations extends SceneResponse {
  /** The play this scene belongs to */
  play: Play;
  /** Characters appearing in this scene */
  characters: Character[];
  /** Associated tags */
  tags: Tag[];
}
