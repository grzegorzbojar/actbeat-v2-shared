/**
 * Scheduler types for multi-day play availability scheduling.
 * Determines which plays can be performed each day across a date range
 * based on actor availability for a given daily time slot.
 * @module types/scheduler
 */

/**
 * Availability status for a scheduler result.
 * - `available`: All required actors are free
 * - `tentative`: At least one actor has tentative conflicts
 * - `unavailable`: One or more required actors are fully blocked
 */
export type SchedulerAvailability = 'available' | 'tentative' | 'unavailable';

/**
 * Parameters for the scheduler computation.
 * Defines the date range and daily time slot to evaluate.
 */
export interface SchedulerParams {
  /** Start date of the range (YYYY-MM-DD format) */
  startDate: string;
  /** End date of the range (YYYY-MM-DD format) */
  endDate: string;
  /** Daily time slot start (HH:mm format, e.g. "09:00") */
  dailyStartTime: string;
  /** Daily time slot end (HH:mm format, e.g. "17:00") */
  dailyEndTime: string;
  /** Optional list of play IDs to evaluate; if omitted, all org plays are checked */
  playIds?: string[];
  /** If true, skip location availability checks (default: false) */
  ignoreLocationChecks?: boolean;
  /** Filter plays to only those with these defaultLocationIds */
  filterByLocationIds?: string[];
}

/**
 * A conflict that blocks or tentatively blocks an actor's availability.
 */
export interface SchedulerConflict {
  /** ID of the conflicting event */
  eventId: string;
  /** Title of the conflicting event */
  title: string;
  /** Start date/time of the conflict (ISO string) */
  startDate: string;
  /** End date/time of the conflict (ISO string) */
  endDate: string;
  /** Blocking reason describing why this event is a conflict */
  type: string;
  /** Event category (PLAY, TRIAL, TECHNICAL, PRIVATE) for styling */
  category?: string;
  /** Event color (hex string), used for styling if set */
  color?: string | null;
}

/**
 * Scheduler result for a single actor assigned to a character.
 */
export interface SchedulerActorResult {
  /** Clerk user ID of the actor */
  actorId: string;
  /** Actor's availability status for the evaluated time slot */
  availability: SchedulerAvailability;
  /** List of conflicts affecting this actor's availability */
  conflicts: SchedulerConflict[];
}

/**
 * Scheduler result for a single character within a play.
 * Aggregates availability across all actors assigned to the character.
 */
export interface SchedulerCharacterResult {
  /** Character ID */
  characterId: string;
  /** Character display name */
  characterName: string;
  /** Availability results for each actor assigned to this character */
  actors: SchedulerActorResult[];
  /** Whether at least one actor is fully available */
  hasAvailableActor: boolean;
  /** Whether at least one actor has tentative availability (but none fully available) */
  hasTentativeActor: boolean;
}

/**
 * Scheduler result for a single play on a given day.
 * Aggregates character-level results into overall play availability.
 */
export interface SchedulerPlayResult {
  /** Play ID */
  playId: string;
  /** Play display name */
  playName: string;
  /** Play duration in minutes, or null if not set */
  playDuration: number | null;
  /** Play color (hex string), or null if not set */
  playColor: string | null;
  /** Overall availability for the play (worst-case across all characters and location) */
  availability: SchedulerAvailability;
  /** Per-character availability breakdown */
  characters: SchedulerCharacterResult[];
  /** Default location ID, or null if none */
  defaultLocationId: string | null;
  /** Default location name for display */
  defaultLocationName: string | null;
  /** Location availability: 'available' | 'tentative' | 'unavailable' | null (null if no location) */
  locationAvailability: SchedulerAvailability | null;
  /** Number of location conflicts if unavailable */
  locationConflictCount?: number;
  /** Location conflicts with full event details for timeline display */
  locationConflicts?: SchedulerConflict[];
}

/**
 * Scheduler result for a single day, containing results for all evaluated plays.
 */
export interface SchedulerDayResult {
  /** Date being evaluated (YYYY-MM-DD format) */
  date: string;
  /** Play availability results for this day */
  plays: SchedulerPlayResult[];
}

/**
 * Progress update emitted during scheduler computation.
 */
export interface SchedulerProgress {
  /** Number of days processed so far */
  completedDays: number;
  /** Total number of days to process */
  totalDays: number;
  /** Date currently being processed (YYYY-MM-DD format) */
  currentDay: string;
  /** Completion percentage (0-100) */
  percent: number;
}

/**
 * Completion summary emitted when the scheduler finishes.
 */
export interface SchedulerComplete {
  /** Total number of days evaluated */
  totalDays: number;
  /** Number of days where at least one play is fully available */
  availableDays: number;
  /** Number of days where at least one play is tentatively available */
  tentativeDays: number;
  /** Number of days where no plays are available */
  unavailableDays: number;
  /** Total computation time in milliseconds */
  computationTimeMs: number;
}

/**
 * User enrichment data mapping Clerk user IDs to display information.
 * Sent separately so day results can stream without waiting for user lookups.
 */
export type SchedulerUserEnrichment = Record<string, {
  /** User's first name, or null if not set */
  firstName: string | null;
  /** User's last name, or null if not set */
  lastName: string | null;
  /** URL to user's avatar image, or null if not set */
  avatarUrl: string | null;
}>;

/**
 * Discriminated union of all SSE event types emitted by the scheduler endpoint.
 *
 * @example
 * ```typescript
 * function handleEvent(event: SchedulerSSEEvent) {
 *   switch (event.type) {
 *     case 'progress':
 *       console.log(`${event.data.percent}% complete`);
 *       break;
 *     case 'day-result':
 *       console.log(`Day ${event.data.date}: ${event.data.plays.length} plays`);
 *       break;
 *     case 'enrichment':
 *       // Merge user display names
 *       break;
 *     case 'complete':
 *       console.log(`Done in ${event.data.computationTimeMs}ms`);
 *       break;
 *     case 'error':
 *       console.error(event.data.message);
 *       break;
 *   }
 * }
 * ```
 */
export type SchedulerSSEEvent =
  | { type: 'progress'; data: SchedulerProgress }
  | { type: 'day-result'; data: SchedulerDayResult }
  | { type: 'enrichment'; data: SchedulerUserEnrichment }
  | { type: 'complete'; data: SchedulerComplete }
  | { type: 'error'; data: { message: string; code?: string } };
