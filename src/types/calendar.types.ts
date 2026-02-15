/**
 * Calendar types for unified calendar event display.
 * Used by both personal and organization calendar views.
 * @module types/calendar
 */

import type { EventCategory, EventStatus, ParticipantStatus } from './event.types.js';
import type { CrewRoleDefinition } from './play.types.js';

/**
 * Source of a calendar event.
 */
export type CalendarEventSource = 'PRIVATE' | 'ORG' | 'GOOGLE' | 'ICS' | 'PROPOSED';

/**
 * Summary of participant statuses for an event.
 * Used to display participant counts in calendar event cards.
 */
export interface ParticipantSummary {
  /** Total number of participants */
  total: number;
  /** Number of participants who accepted */
  accepted: number;
  /** Number of participants who declined */
  declined: number;
  /** Number of participants who haven't responded */
  pending: number;
  /** Number of required participants */
  required: number;
  /** Number of required participants who accepted */
  requiredAccepted: number;
}

/**
 * Unified calendar event type for display in calendar views.
 * Normalizes both private and organization events for consistent rendering.
 */
export interface CalendarEvent {
  /** Unique event identifier */
  id: string;
  /** Event title */
  title: string;
  /** Event start date (ISO string) */
  startDate: string;
  /** Event end date (ISO string) */
  endDate: string;
  /** Whether this is an all-day event */
  allDay: boolean;

  // Display properties
  /** Background color for the event card (hex) */
  color: string;
  /** Text color for contrast (hex) */
  textColor: string;
  /** Event category for icon selection */
  category: EventCategory;
  /** Whether to display as tentative (reduced opacity) */
  isTentative: boolean;

  // Source tracking
  /** Source of the event (PRIVATE, ORG, or GOOGLE) */
  source: CalendarEventSource;
  /** Organization slug for org events (for routing) */
  orgSlug?: string;
  /** Organization name for org events (for display) */
  orgName?: string;

  // Secondary info (line 2 of event card)
  /** Location name if available */
  locationName?: string | null;
  /** Play name for PLAY category events */
  playName?: string | null;
  /** Character name for the current user (if actor) */
  characterName?: string | null;

  // Participant status (org events only)
  /** Summary of participant statuses */
  participantSummary?: ParticipantSummary;
  /** Current user's participant status */
  myParticipantStatus?: ParticipantStatus;
  /** Event workflow status */
  status?: EventStatus;
  /** Healthcheck status for visual indicator */
  healthcheckStatus?: 'error' | 'warning' | 'clean' | null;
  /** Whether healthcheck notifications are suppressed */
  healthcheckSuppressed?: boolean;

  // Proposed event properties (from scheduler)
  /** Whether this is a proposed event from scheduler (for border styling) */
  isProposed?: boolean;
  /** Play ID for proposed events (used to pre-fill form) */
  playId?: string;
  /** Play duration in minutes (for proposed events) */
  playDuration?: number | null;
  /** Border color for proposed events (from play color) */
  proposedBorderColor?: string;
}

// ── Play Monthly Calendar types ──────────────────────────────────

/**
 * A single event shown on the play monthly calendar grid.
 */
export interface PlayCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  color: string | null;
  status: string | null;
  isPrivate: boolean;
}

/**
 * An actor (user) row in the play monthly calendar.
 */
export interface PlayCalendarActor {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  events: PlayCalendarEvent[];
}

/**
 * A character grouping with its assigned actors for the play calendar.
 */
export interface PlayCalendarCharacter {
  id: string;
  name: string;
  actors: PlayCalendarActor[];
}

/**
 * A crew role with its eligible users for the play calendar.
 */
export interface PlayCalendarCrewRole {
  roleDefinitionId: string;
  roleName: string;
  roleColor: string;
  requiredCount: number;
  isOptional: boolean;
  users: PlayCalendarActor[];
}

/**
 * Location row data for the play calendar.
 */
export interface PlayCalendarLocation {
  locationId: string;
  locationName: string;
  events: PlayCalendarEvent[];
}

/**
 * Response from GET /api/plays/:playId/calendar
 */
export interface PlayCalendarResponse {
  play: {
    id: string;
    name: string;
    color: string | null;
    duration: number;
    defaultLocationId: string | null;
    defaultLocationName: string | null;
    crewRoles: CrewRoleDefinition[] | null;
  };
  characters: PlayCalendarCharacter[];
  crewRoles: PlayCalendarCrewRole[] | null;
  location: PlayCalendarLocation | null;
  month: string;
  daysInMonth: number;
}
