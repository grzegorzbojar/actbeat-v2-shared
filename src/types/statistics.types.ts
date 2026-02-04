/**
 * Statistics types for the Actbeat theater management system.
 * Used for play and actor event count statistics.
 * @module types/statistics
 */

import { z } from 'zod';
import { EventStatus, ParticipantStatus } from './event.types.js';

/**
 * Regex for date formats: YYYY-MM-DD or full ISO 8601 datetime
 */
const dateOrDatetimeRegex = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * Zod schema for statistics query parameters.
 */
export const statisticsQuerySchema = z.object({
  /** Filter events starting from this date (YYYY-MM-DD or ISO 8601 datetime) */
  startDate: z.string().regex(dateOrDatetimeRegex, 'Invalid date format').optional(),
  /** Filter events ending before this date (YYYY-MM-DD or ISO 8601 datetime) */
  endDate: z.string().regex(dateOrDatetimeRegex, 'Invalid date format').optional(),
  /** Filter to specific event IDs (for scheduler session) */
  eventIds: z.array(z.string()).optional(),
  /** Event statuses to include */
  eventStatuses: z
    .array(z.nativeEnum(EventStatus))
    .optional()
    .default([
      EventStatus.DRAFT,
      EventStatus.PLANNED,
      EventStatus.SCHEDULED,
      EventStatus.COMPLETED,
    ]),
  /** Participation statuses to count */
  participantStatuses: z
    .array(z.nativeEnum(ParticipantStatus))
    .optional()
    .default([ParticipantStatus.ACCEPTED, ParticipantStatus.PENDING]),
  /** Include crew statistics in response (only when crew mode enabled) */
  includeCrewStats: z.boolean().optional(),
});

/**
 * Query parameters for statistics endpoint.
 */
export type StatisticsQuery = z.infer<typeof statisticsQuerySchema>;

/**
 * Play statistics item - event count per play.
 */
export interface PlayStatItem {
  /** Play ID */
  playId: string;
  /** Play name */
  playName: string;
  /** Play color (hex) */
  playColor: string | null;
  /** Number of events for this play */
  eventCount: number;
}

/**
 * Actor statistics item - event count per actor.
 */
export interface ActorStatItem {
  /** Clerk user ID */
  userId: string;
  /** User display name */
  userName: string;
  /** User profile image URL */
  userImageUrl: string | null;
  /** Number of events this actor is participating in */
  eventCount: number;
}

/**
 * Role breakdown item - shows event count for a specific crew role.
 */
export interface CrewRoleBreakdownItem {
  /** Crew role definition ID */
  roleDefinitionId: string;
  /** Human-readable role name */
  roleName: string;
  /** Number of events for this role */
  eventCount: number;
}

/**
 * Crew member statistics item.
 */
export interface CrewStatItem {
  /** Clerk user ID (null for external crew) */
  userId: string | null;
  /** Display name (from Clerk or externalPerson.name) */
  displayName: string;
  /** User profile image URL (null for external) */
  imageUrl: string | null;
  /** Total number of events this crew member is assigned to */
  eventCount: number;
  /** Breakdown by role */
  roleBreakdown: CrewRoleBreakdownItem[];
}

/**
 * Summary statistics.
 */
export interface StatisticsSummary {
  /** Total number of events matching filters */
  totalEvents: number;
  /** Total number of unique plays */
  totalPlays: number;
  /** Total number of unique actors */
  totalActors: number;
  /** Total unique crew members (only when crew mode enabled) */
  totalCrew?: number;
}

/**
 * Full statistics response.
 */
export interface StatisticsResponse {
  /** Play event counts */
  playStats: PlayStatItem[];
  /** Actor event counts */
  actorStats: ActorStatItem[];
  /** Crew statistics (only when crew mode enabled and requested) */
  crewStats?: CrewStatItem[];
  /** Summary totals */
  summary: StatisticsSummary;
}
