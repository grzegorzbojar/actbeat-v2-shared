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
 * Summary statistics.
 */
export interface StatisticsSummary {
  /** Total number of events matching filters */
  totalEvents: number;
  /** Total number of unique plays */
  totalPlays: number;
  /** Total number of unique actors */
  totalActors: number;
}

/**
 * Full statistics response.
 */
export interface StatisticsResponse {
  /** Play event counts */
  playStats: PlayStatItem[];
  /** Actor event counts */
  actorStats: ActorStatItem[];
  /** Summary totals */
  summary: StatisticsSummary;
}
