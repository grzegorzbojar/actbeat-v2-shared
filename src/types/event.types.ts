/**
 * Event types for the Actbeat theater management system.
 * Events represent calendar entries for rehearsals, performances, and personal schedules.
 * @module types/event
 */

import type { Location } from './location.types.js';
import type { Tag } from './tag.types.js';

/**
 * Event category enumeration matching Prisma schema.
 * Determines the type and behavior of calendar events.
 */
export enum EventCategory {
  /** Personal events visible only to the owner */
  PRIVATE = 'PRIVATE',
  /** Play rehearsals and performances */
  PLAY = 'PLAY',
  /** Trial/audition events */
  TRIAL = 'TRIAL',
  /** Technical rehearsals and setup */
  TECHNICAL = 'TECHNICAL',
}

/**
 * Event metadata for PLAY category events.
 * Stores play-specific information like scene and character assignments.
 */
export interface PlayEventMetadata {
  /** ID of the associated play */
  playId: string;
  /** IDs of scenes being rehearsed */
  sceneIds?: string[];
  /** IDs of characters involved */
  characterIds?: string[];
}

/**
 * Event metadata for TRIAL category events.
 * Stores audition-specific information.
 */
export interface TrialEventMetadata {
  /** IDs of characters being auditioned for */
  characterIds?: string[];
  /** Notes about the audition */
  notes?: string;
}

/**
 * Union type for event metadata based on category.
 */
export type EventMetadata = PlayEventMetadata | TrialEventMetadata | Record<string, unknown>;

/**
 * Core Event entity matching the Prisma Event model.
 * Represents a calendar event in the system.
 */
export interface Event {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId: string | null;
  /** Event start date and time */
  startDate: Date;
  /** Event end date and time */
  endDate: Date;
  /** Category determining event type and behavior */
  category: EventCategory;
  /** Optional comment or description */
  comment: string | null;
  /** Optional hex color code for display */
  color: string | null;
  /** ID of the associated location */
  locationId: string | null;
  /** ID of the parent event for hierarchical events */
  parentId: string | null;
  /** Category-specific metadata stored as JSON */
  metadata: EventMetadata | null;
  /** Array of participant user IDs (from Clerk) */
  participants: string[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Event with all relations loaded.
 */
export interface EventWithRelations extends Event {
  /** Associated location details */
  location: Location | null;
  /** Associated tags */
  tags: Tag[];
  /** Child events for hierarchical structures */
  children: Event[];
  /** Parent event if this is a child */
  parent: Event | null;
}

/**
 * Input type for creating a new event.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateEventInput {
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId?: string | null;
  /** Event start date and time (ISO string or Date) */
  startDate: Date | string;
  /** Event end date and time (ISO string or Date) */
  endDate: Date | string;
  /** Category determining event type and behavior */
  category?: EventCategory;
  /** Optional comment or description */
  comment?: string | null;
  /** Optional hex color code for display */
  color?: string | null;
  /** ID of the associated location */
  locationId?: string | null;
  /** ID of the parent event for hierarchical events */
  parentId?: string | null;
  /** Category-specific metadata */
  metadata?: EventMetadata | null;
  /** Array of participant user IDs */
  participants?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Input type for updating an existing event.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateEventInput {
  /** Event title/name */
  title?: string;
  /** ID of the user or organization that owns this event */
  organizerId?: string | null;
  /** Event start date and time */
  startDate?: Date | string;
  /** Event end date and time */
  endDate?: Date | string;
  /** Category determining event type and behavior */
  category?: EventCategory;
  /** Optional comment or description */
  comment?: string | null;
  /** Optional hex color code for display */
  color?: string | null;
  /** ID of the associated location */
  locationId?: string | null;
  /** ID of the parent event for hierarchical events */
  parentId?: string | null;
  /** Category-specific metadata */
  metadata?: EventMetadata | null;
  /** Array of participant user IDs */
  participants?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
}

/**
 * Query parameters for filtering events.
 */
export interface EventQueryParams {
  /** Filter by organizer ID */
  organizerId?: string;
  /** Filter by category */
  category?: EventCategory;
  /** Filter events starting after this date */
  startAfter?: Date | string;
  /** Filter events starting before this date */
  startBefore?: Date | string;
  /** Filter events ending after this date */
  endAfter?: Date | string;
  /** Filter events ending before this date */
  endBefore?: Date | string;
  /** Filter by location ID */
  locationId?: string;
  /** Filter by tag IDs (any match) */
  tagIds?: string[];
  /** Include child events in results */
  includeChildren?: boolean;
}

/**
 * Event response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface EventResponse {
  /** Unique identifier */
  id: string;
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId: string | null;
  /** Event start date and time as ISO string */
  startDate: string;
  /** Event end date and time as ISO string */
  endDate: string;
  /** Category determining event type and behavior */
  category: EventCategory;
  /** Optional comment or description */
  comment: string | null;
  /** Optional hex color code for display */
  color: string | null;
  /** ID of the associated location */
  locationId: string | null;
  /** ID of the parent event */
  parentId: string | null;
  /** Category-specific metadata */
  metadata: EventMetadata | null;
  /** Array of participant user IDs */
  participants: string[];
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Event response with relations for detailed views.
 */
export interface EventResponseWithRelations extends EventResponse {
  /** Associated location details */
  location: Location | null;
  /** Associated tags */
  tags: Tag[];
}
