/**
 * Google Calendar export types for the Actbeat theater management system.
 * Types for Google Calendar integration including event export and RSVP sync.
 * @module types/googleCalendar
 */

import type { ParticipantStatus } from './event.types.js';

// =============================================================================
// Google Calendar Export Result Types
// =============================================================================

/**
 * Result of creating a Google Calendar event for an organization event.
 * Contains the overall result and per-participant results.
 */
export interface CreateGoogleEventResult {
  /** Whether the export was successful overall */
  success: boolean;
  /** Google Calendar event ID for the main event (if created) */
  googleEventId?: string;
  /** Results for each participant's calendar event creation */
  participantResults: ParticipantGoogleResult[];
}

/**
 * Result of creating a Google Calendar event for a single participant.
 */
export interface ParticipantGoogleResult {
  /** ID of the EventParticipant record */
  participantId: string;
  /** Whether the Google Calendar event was created successfully */
  success: boolean;
  /** Google Calendar event ID (if successful) */
  googleEventId?: string;
  /** Email address used for the calendar invite */
  email?: string;
  /** Error message if the operation failed */
  error?: string;
}

// =============================================================================
// RSVP Sync Types
// =============================================================================

/**
 * Result of syncing RSVP status from Google Calendar back to Actbeat.
 * Used when polling Google Calendar for response status updates.
 */
export interface RsvpSyncResult {
  /** ID of the EventParticipant record that was updated */
  participantId: string;
  /** Participant status before the sync */
  previousStatus: ParticipantStatus;
  /** Participant status after the sync */
  newStatus: ParticipantStatus;
  /** Whether the parent event transitioned status as a result of this update */
  eventTransitioned: boolean;
}

// =============================================================================
// Calendar Sync State Types
// =============================================================================

/**
 * Calendar sync state for incremental sync operations.
 * Matches the Prisma CalendarSyncState model.
 */
export interface CalendarSyncState {
  /** Unique identifier */
  id: string;
  /** Google Calendar ID being synced */
  calendarId: string;
  /** Sync token for incremental sync (null for full sync) */
  syncToken: string | null;
  /** When the last successful sync occurred */
  lastSyncAt: Date;
  /** When this record was last updated */
  updatedAt: Date;
}

/**
 * Calendar sync state response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface CalendarSyncStateResponse {
  /** Unique identifier */
  id: string;
  /** Google Calendar ID being synced */
  calendarId: string;
  /** Sync token for incremental sync (null for full sync) */
  syncToken: string | null;
  /** When the last successful sync occurred (ISO string) */
  lastSyncAt: string;
  /** When this record was last updated (ISO string) */
  updatedAt: string;
}

// =============================================================================
// Google Calendar API Types
// =============================================================================

/**
 * Google Calendar RSVP response status values.
 * Maps to the attendee.responseStatus field in Google Calendar API.
 * @see https://developers.google.com/calendar/api/v3/reference/events
 */
export type GoogleResponseStatus = 'needsAction' | 'declined' | 'tentative' | 'accepted';

/**
 * Mapping between Google Calendar response status and Actbeat participant status.
 * Used for bidirectional sync of RSVP responses.
 */
export const GOOGLE_TO_PARTICIPANT_STATUS: Record<GoogleResponseStatus, ParticipantStatus> = {
  needsAction: 'PENDING' as ParticipantStatus,
  declined: 'DECLINED' as ParticipantStatus,
  tentative: 'PENDING' as ParticipantStatus,
  accepted: 'ACCEPTED' as ParticipantStatus,
};

/**
 * Mapping between Actbeat participant status and Google Calendar response status.
 */
export const PARTICIPANT_TO_GOOGLE_STATUS: Record<ParticipantStatus, GoogleResponseStatus> = {
  PENDING: 'needsAction',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};
