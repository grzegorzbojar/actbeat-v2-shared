/**
 * Search types for the Actbeat theater management system.
 * Types for availability search and time block calculations.
 * @module types/search
 */

import type { Dayjs } from 'dayjs';

/**
 * Time block representing a period of availability or an event.
 * Used in availability calculations.
 */
export interface TimeBlock {
  /** Start time of the block */
  start: Date;
  /** End time of the block */
  end: Date;
}

/**
 * Time block with Day.js instances for calculations.
 * Used internally in date utility functions.
 */
export interface DayjsTimeBlock {
  /** Start time as Day.js instance */
  start: Dayjs;
  /** End time as Day.js instance */
  end: Dayjs;
}

/**
 * Actor assignment for a character.
 */
export interface ActorAssignment {
  /** Character ID */
  characterId: string;
  /** Assigned actor's user ID */
  actorId: string;
}

/**
 * Character with available actors for combinations.
 */
export interface CharacterActors {
  /** Character ID */
  characterId: string;
  /** List of available actor user IDs */
  actors: string[];
}

/**
 * Parameters for searching play availability.
 */
export interface SearchPlayAvailabilityParams {
  /** Play ID to search availability for */
  playId: string;
  /** Date range to search within */
  dateRange: {
    /** Start of search range */
    start: Date | string;
    /** End of search range */
    end: Date | string;
  };
  /** Minimum duration in minutes for a valid time slot */
  minDuration?: number;
  /** Whether actors can play multiple characters */
  allowMultipleRoles?: boolean;
  /** Filter by specific character IDs */
  characterIds?: string[];
  /** Exclude specific user IDs from search */
  excludeUserIds?: string[];
}

/**
 * Parameters for searching scene availability.
 */
export interface SearchSceneAvailabilityParams {
  /** Scene ID to search availability for */
  sceneId: string;
  /** Date range to search within */
  dateRange: {
    /** Start of search range */
    start: Date | string;
    /** End of search range */
    end: Date | string;
  };
  /** Minimum duration in minutes for a valid time slot */
  minDuration?: number;
  /** Whether actors can play multiple characters */
  allowMultipleRoles?: boolean;
  /** Exclude specific user IDs from search */
  excludeUserIds?: string[];
}

/**
 * Parameters for searching available plays.
 */
export interface SearchPlaysParams {
  /** Organization ID */
  orgId: string;
  /** Date range to search within */
  dateRange: {
    /** Start of search range */
    start: Date | string;
    /** End of search range */
    end: Date | string;
  };
  /** Minimum duration in minutes for a valid time slot */
  minDuration?: number;
}

/**
 * Parameters for searching available scenes.
 */
export interface SearchScenesParams {
  /** Play ID to search scenes for */
  playId: string;
  /** Date range to search within */
  dateRange: {
    /** Start of search range */
    start: Date | string;
    /** End of search range */
    end: Date | string;
  };
  /** Minimum duration in minutes for a valid time slot */
  minDuration?: number;
}

/**
 * Availability result for a specific combination.
 */
export interface AvailabilitySlot {
  /** Start time of available slot */
  start: Date;
  /** End time of available slot */
  end: Date;
  /** Duration in minutes */
  durationMinutes: number;
  /** Actor assignments for this slot */
  assignments: ActorAssignment[];
}

/**
 * Availability result for a play or scene.
 */
export interface AvailabilityResult {
  /** Entity ID (play or scene) */
  entityId: string;
  /** Entity type */
  entityType: 'play' | 'scene';
  /** Available time slots with actor combinations */
  slots: AvailabilitySlot[];
  /** Characters that have no available actors */
  uncastableCharacters: string[];
  /** Total number of valid combinations found */
  combinationCount: number;
}

/**
 * Search result response for API.
 */
export interface AvailabilityResponse {
  /** Search parameters used */
  params: SearchPlayAvailabilityParams | SearchSceneAvailabilityParams;
  /** Results found */
  results: AvailabilityResult;
  /** Search performance metrics */
  metrics: {
    /** Time taken in milliseconds */
    searchTimeMs: number;
    /** Number of events checked */
    eventsChecked: number;
    /** Number of combinations evaluated */
    combinationsEvaluated: number;
  };
}

/**
 * Actor availability summary.
 */
export interface ActorAvailability {
  /** Actor's user ID */
  actorId: string;
  /** Actor's display name */
  actorName: string;
  /** Available time blocks */
  availableBlocks: TimeBlock[];
  /** Busy time blocks (events) */
  busyBlocks: TimeBlock[];
}

/**
 * Batch search request for multiple scenes.
 */
export interface BatchSearchRequest {
  /** Array of scene IDs to search */
  sceneIds: string[];
  /** Date range to search within */
  dateRange: {
    /** Start of search range */
    start: Date | string;
    /** End of search range */
    end: Date | string;
  };
  /** Minimum duration in minutes */
  minDuration?: number;
  /** Whether actors can play multiple characters */
  allowMultipleRoles?: boolean;
}

/**
 * Batch search result.
 */
export interface BatchSearchResult {
  /** Scene ID */
  sceneId: string;
  /** Scene name */
  sceneName: string;
  /** Availability result */
  availability: AvailabilityResult | null;
  /** Error if search failed for this scene */
  error?: string;
}
