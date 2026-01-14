/**
 * Character types for the Actbeat theater management system.
 * Characters represent roles in plays that can be assigned to actors.
 * @module types/character
 */

import type { Play } from './play.types.js';
import type { Scene } from './scene.types.js';
import type { Tag } from './tag.types.js';

/**
 * Core Character entity matching the Prisma Character model.
 * Represents a role/character in a theater production.
 */
export interface Character {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Character name */
  name: string;
  /** ID of the play this character belongs to */
  playId: string;
  /** Array of user IDs (from Clerk) who can play this character */
  actors: string[];
  /** Legacy scene ID field (deprecated, use scenes relation) */
  sceneId: string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Character with all relations loaded.
 */
export interface CharacterWithRelations extends Character {
  /** The play this character belongs to */
  play: Play;
  /** Scenes this character appears in */
  scenes: Scene[];
  /** Associated tags */
  tags: Tag[];
}

/**
 * Input type for creating a new character.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateCharacterInput {
  /** Character name */
  name: string;
  /** ID of the play this character belongs to */
  playId: string;
  /** Array of user IDs who can play this character */
  actors?: string[];
  /** Array of scene IDs this character appears in */
  sceneIds?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Input type for updating an existing character.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateCharacterInput {
  /** Character name */
  name?: string;
  /** Array of user IDs who can play this character */
  actors?: string[];
  /** Array of scene IDs this character appears in */
  sceneIds?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Query parameters for filtering characters.
 */
export interface CharacterQueryParams {
  /** Filter by play ID */
  playId?: string;
  /** Search by name (partial match) */
  search?: string;
  /** Filter by actor user ID */
  actorId?: string;
  /** Filter by scene ID */
  sceneId?: string;
  /** Filter by tag IDs (any match) */
  tagIds?: string[];
}

/**
 * Character response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface CharacterResponse {
  /** Unique identifier */
  id: string;
  /** Character name */
  name: string;
  /** ID of the play this character belongs to */
  playId: string;
  /** Array of user IDs who can play this character */
  actors: string[];
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Character response with relations for detailed views.
 */
export interface CharacterResponseWithRelations extends CharacterResponse {
  /** The play this character belongs to */
  play: Play;
  /** Scenes this character appears in */
  scenes: Scene[];
  /** Associated tags */
  tags: Tag[];
}

/**
 * Character with actor availability information.
 * Used in search/availability calculations.
 */
export interface CharacterWithActors {
  /** Character ID */
  characterId: string;
  /** Character name */
  characterName: string;
  /** Array of available actor user IDs */
  actors: string[];
}
