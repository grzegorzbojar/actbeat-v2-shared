/**
 * PlayEvent mapping utilities.
 *
 * Provides typed wrappers and conversion functions for PLAY category events.
 * PlayEvents expand the metadata field for type-safe access to character/crew assignments.
 *
 * @module utils/playEvent.mapper
 */

import type {
  Event,
  EventResponse,
  PlayEventMetadata,
  CharacterAssignment,
  EventStatus,
  RehearsalType,
} from '../types/event.types.js';

/**
 * PlayEvent - typed wrapper for PLAY category events.
 * Expands metadata fields for type-safe access.
 */
export interface PlayEvent {
  id: string;
  title: string;
  organizerId: string | null;
  startDate: Date | string;
  endDate: Date | string;
  category: 'PLAY';
  status: EventStatus | null;
  comment: string | null;
  color: string | null;
  locationId: string | null;
  playId: string;
  // Expanded from metadata
  characterAssignments: CharacterAssignment[];
  crewAssignments: []; // Empty for M4.1 - crew assignments come in future milestone
  sceneIds: string[];
  rehearsalType: RehearsalType | null;
  // Admin fields
  adminNotes: string | null;
  minimumNoticePeriod: number | null;
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Frontend-friendly input for creating a PlayEvent.
 * All dates should be ISO strings.
 */
export interface CreatePlayEventInput {
  title: string;
  playId: string;
  startDate: string; // ISO
  endDate: string; // ISO
  comment?: string | null;
  color?: string | null;
  locationId?: string | null;
  characterAssignments?: CharacterAssignment[];
  sceneIds?: string[];
  rehearsalType?: RehearsalType | null;
}

/**
 * Convert generic Event to typed PlayEvent.
 * Returns null if not PLAY category.
 *
 * @param event - The event to convert
 * @returns PlayEvent or null if not a PLAY event
 */
export function eventToPlayEvent(event: Event | EventResponse): PlayEvent | null {
  if (event.category !== 'PLAY') return null;

  const metadata = event.metadata as PlayEventMetadata | null;

  return {
    id: event.id,
    title: event.title,
    organizerId: event.organizerId,
    startDate: event.startDate,
    endDate: event.endDate,
    category: 'PLAY',
    status: event.status,
    comment: event.comment,
    color: event.color,
    locationId: event.locationId,
    // playId can be from direct field or metadata (for backwards compatibility)
    playId: event.playId || metadata?.playId || '',
    characterAssignments: metadata?.characterAssignments || [],
    crewAssignments: [],
    sceneIds: metadata?.sceneIds || [],
    rehearsalType: metadata?.rehearsalType || null,
    adminNotes: event.adminNotes,
    minimumNoticePeriod: event.minimumNoticePeriod,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

/**
 * Convert CreatePlayEventInput to API request format.
 * Used by frontend before making API call.
 *
 * @param input - The frontend-friendly input
 * @returns API-ready object for POST /api/events
 */
export function playEventToCreateInput(input: CreatePlayEventInput) {
  // Build metadata with only defined fields
  const metadata: PlayEventMetadata = {
    playId: input.playId,
    characterAssignments: input.characterAssignments || [],
    crewAssignments: [],
  };

  // Only add optional fields if they are defined
  if (input.sceneIds) {
    metadata.sceneIds = input.sceneIds;
  }
  if (input.rehearsalType) {
    metadata.rehearsalType = input.rehearsalType;
  }

  return {
    title: input.title,
    category: 'PLAY' as const,
    status: 'DRAFT' as const,
    playId: input.playId,
    startDate: input.startDate,
    endDate: input.endDate,
    comment: input.comment,
    color: input.color,
    locationId: input.locationId,
    metadata,
  };
}

/**
 * Type guard for PLAY category events.
 *
 * @param event - The event to check
 * @returns true if event is PLAY category
 */
export function isPlayEvent(event: Event | EventResponse | { category: string }): boolean {
  return event.category === 'PLAY';
}

/**
 * Type guard for DRAFT status events.
 *
 * @param event - The event to check
 * @returns true if event is in DRAFT status
 */
export function isDraftEvent(
  event: Event | EventResponse | { status: EventStatus | string | null }
): boolean {
  return event.status === 'DRAFT';
}

/**
 * Type guard for organization events (non-PRIVATE).
 *
 * @param event - The event to check
 * @returns true if event is an organization event
 */
export function isOrgEvent(event: Event | EventResponse | { category: string }): boolean {
  return event.category !== 'PRIVATE';
}
