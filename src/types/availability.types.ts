/**
 * Availability types for user availability checking API.
 * @module types/availability
 */

import type { TimeBlock } from './search.types.js';

/**
 * Extended availability status that includes PARTIAL.
 * Extends the base AvailabilityStatus with additional state.
 */
export enum UserAvailabilityStatus {
  /** No events blocking this time */
  FREE = 'FREE',
  /** Has tentative PRIVATE or unaccepted PLANNED org event */
  TENTATIVE = 'TENTATIVE',
  /** Has confirmed PRIVATE or accepted org event */
  BUSY = 'BUSY',
  /** Has some free time but not entirely available */
  PARTIAL = 'PARTIAL',
}

/**
 * Reason why a time block is blocked.
 */
export enum BlockingReason {
  /** User's own private event (CONFIRMED) */
  PRIVATE_EVENT_CONFIRMED = 'PRIVATE_EVENT_CONFIRMED',
  /** User's own private event (TENTATIVE) */
  PRIVATE_EVENT_TENTATIVE = 'PRIVATE_EVENT_TENTATIVE',
  /** Organization event where user is participant (ACCEPTED) */
  ORG_EVENT_ACCEPTED = 'ORG_EVENT_ACCEPTED',
  /** Organization event where user is participant (PENDING) */
  ORG_EVENT_PENDING = 'ORG_EVENT_PENDING',
  /** Organization event in DRAFT status (tentative block) */
  ORG_EVENT_DRAFT = 'ORG_EVENT_DRAFT',
}

/**
 * Information about an event blocking availability.
 * Only included when includeEventDetails=true.
 */
export interface BlockingEvent {
  /** Event ID */
  eventId: string;
  /** Event title */
  title: string;
  /** Event start time */
  startDate: Date;
  /** Event end time */
  endDate: Date;
  /** Why this event blocks availability */
  blockingReason: BlockingReason;
  /** Event category (PRIVATE, PLAY, TRIAL, TECHNICAL) */
  category: string;
  /** Event color (hex string), if set */
  color?: string | null;
}

/**
 * Result of checking a single user's availability.
 */
export interface UserAvailabilityResult {
  /** Clerk user ID */
  userId: string;
  /** Start of the checked period */
  periodStart: Date;
  /** End of the checked period */
  periodEnd: Date;
  /** Overall availability status for the period */
  status: UserAvailabilityStatus;
  /** True if user is completely free for the entire period */
  isFullyAvailable: boolean;
  /** True if user has tentative events in the period */
  hasTentativeEvents: boolean;
  /** Free time blocks within the period */
  freeBlocks: TimeBlock[];
  /** Tentative time blocks (from tentative events) */
  tentativeBlocks: TimeBlock[];
  /** Busy time blocks (from confirmed events) */
  busyBlocks: TimeBlock[];
  /** Total free minutes in the period */
  totalFreeMinutes: number;
  /** Total tentative minutes in the period */
  totalTentativeMinutes: number;
  /** Total busy minutes in the period */
  totalBusyMinutes: number;
  /** Events blocking availability (only if includeEventDetails=true) */
  blockingEvents?: BlockingEvent[];
}

/**
 * Result of checking multiple users' availability.
 */
export interface BulkUserAvailabilityResult {
  /** Start of the checked period */
  periodStart: Date;
  /** End of the checked period */
  periodEnd: Date;
  /** Availability results per user */
  results: UserAvailabilityResult[];
  /** Summary: user IDs who are fully available */
  fullyAvailableUserIds: string[];
  /** Summary: user IDs who are partially available */
  partiallyAvailableUserIds: string[];
  /** Summary: user IDs who have tentative events only */
  tentativeUserIds: string[];
  /** Summary: user IDs who are completely unavailable */
  unavailableUserIds: string[];
}

/**
 * Parameters for checking single user availability.
 */
export interface CheckUserAvailabilityParams {
  /** Clerk user ID to check */
  userId: string;
  /** Organization ID for org events */
  orgId: string;
  /** Start of the period to check */
  start: Date;
  /** End of the period to check */
  end: Date;
  /** Whether to include blocking event details in response */
  includeEventDetails?: boolean;
  /** Minimum duration in minutes for free blocks (default: 15) */
  minBlockDuration?: number;
}

/**
 * Parameters for checking multiple users' availability.
 */
export interface CheckBulkAvailabilityParams {
  /** Array of Clerk user IDs to check (max 50) */
  userIds: string[];
  /** Organization ID for org events */
  orgId: string;
  /** Start of the period to check */
  start: Date;
  /** End of the period to check */
  end: Date;
  /** Whether to include blocking event details in response */
  includeEventDetails?: boolean;
  /** Minimum duration in minutes for free blocks (default: 15) */
  minBlockDuration?: number;
}

/**
 * API response for single user availability.
 * Dates are serialized as ISO strings.
 */
export interface UserAvailabilityResponse {
  /** Clerk user ID */
  userId: string;
  /** Start of the checked period (ISO string) */
  periodStart: string;
  /** End of the checked period (ISO string) */
  periodEnd: string;
  /** Overall availability status for the period */
  status: UserAvailabilityStatus;
  /** True if user is completely free for the entire period */
  isFullyAvailable: boolean;
  /** True if user has tentative events in the period */
  hasTentativeEvents: boolean;
  /** Free time blocks within the period */
  freeBlocks: Array<{ start: string; end: string }>;
  /** Tentative time blocks (from tentative events) */
  tentativeBlocks: Array<{ start: string; end: string }>;
  /** Busy time blocks (from confirmed events) */
  busyBlocks: Array<{ start: string; end: string }>;
  /** Total free minutes in the period */
  totalFreeMinutes: number;
  /** Total tentative minutes in the period */
  totalTentativeMinutes: number;
  /** Total busy minutes in the period */
  totalBusyMinutes: number;
  /** Events blocking availability (only if includeEventDetails=true) */
  blockingEvents?: Array<{
    eventId: string;
    title: string;
    startDate: string;
    endDate: string;
    blockingReason: BlockingReason;
    category: string;
    color?: string | null;
  }>;
}

/**
 * API response for bulk user availability.
 * Dates are serialized as ISO strings.
 */
export interface BulkUserAvailabilityResponse {
  /** Start of the checked period (ISO string) */
  periodStart: string;
  /** End of the checked period (ISO string) */
  periodEnd: string;
  /** Availability results per user */
  results: UserAvailabilityResponse[];
  /** Summary: user IDs who are fully available */
  fullyAvailableUserIds: string[];
  /** Summary: user IDs who are partially available */
  partiallyAvailableUserIds: string[];
  /** Summary: user IDs who have tentative events only */
  tentativeUserIds: string[];
  /** Summary: user IDs who are completely unavailable */
  unavailableUserIds: string[];
}
