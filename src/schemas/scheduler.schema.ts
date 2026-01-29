/**
 * Zod validation schemas for the Scheduler feature.
 * Validates parameters for multi-day play availability scheduling.
 * @module schemas/scheduler
 */

import { z } from 'zod';

/**
 * Regex for YYYY-MM-DD date format.
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Regex for HH:mm time format (00:00 - 23:59).
 */
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Maximum number of days allowed in a scheduler date range.
 */
const MAX_DATE_RANGE_DAYS = 366;

/**
 * Schema for validating scheduler query parameters.
 *
 * Validates:
 * - startDate and endDate are valid YYYY-MM-DD strings
 * - dailyStartTime and dailyEndTime are valid HH:mm strings
 * - startDate is on or before endDate
 * - Date range does not exceed 366 days
 * - dailyStartTime is strictly before dailyEndTime
 * - playIds is an optional array of non-empty strings
 */
export const schedulerParamsSchema = z.object({
  /** Start date in YYYY-MM-DD format */
  startDate: z.string().regex(DATE_REGEX, 'Start date must be in YYYY-MM-DD format'),
  /** End date in YYYY-MM-DD format */
  endDate: z.string().regex(DATE_REGEX, 'End date must be in YYYY-MM-DD format'),
  /** Daily time slot start in HH:mm format */
  dailyStartTime: z.string().regex(TIME_REGEX, 'Start time must be in HH:mm format (00:00 - 23:59)'),
  /** Daily time slot end in HH:mm format */
  dailyEndTime: z.string().regex(TIME_REGEX, 'End time must be in HH:mm format (00:00 - 23:59)'),
  /** Optional list of play IDs to evaluate */
  playIds: z.array(z.string().min(1, 'Play ID must not be empty')).optional(),
}).refine(
  (data) => data.startDate <= data.endDate,
  {
    message: 'Start date must be on or before end date',
    path: ['startDate'],
  },
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return diffDays <= MAX_DATE_RANGE_DAYS;
  },
  {
    message: `Date range must not exceed ${MAX_DATE_RANGE_DAYS} days`,
    path: ['endDate'],
  },
).refine(
  (data) => data.dailyStartTime < data.dailyEndTime,
  {
    message: 'Daily start time must be before daily end time',
    path: ['dailyStartTime'],
  },
);

/**
 * Schema for validating day-detail query parameters.
 * Used for fetching detailed availability for a single day.
 *
 * Validates:
 * - date is a valid YYYY-MM-DD string
 * - startTime and endTime are valid HH:mm strings
 * - startTime is strictly before endTime
 * - playId is an optional non-empty string
 */
export const schedulerDayDetailParamsSchema = z.object({
  /** Date to check in YYYY-MM-DD format */
  date: z.string().regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format'),
  /** Time slot start in HH:mm format */
  startTime: z.string().regex(TIME_REGEX, 'Start time must be in HH:mm format (00:00 - 23:59)'),
  /** Time slot end in HH:mm format */
  endTime: z.string().regex(TIME_REGEX, 'End time must be in HH:mm format (00:00 - 23:59)'),
  /** Optional play ID to filter results */
  playId: z.string().min(1, 'Play ID must not be empty').optional(),
}).refine(
  (data) => data.startTime < data.endTime,
  {
    message: 'Start time must be before end time',
    path: ['startTime'],
  },
);

/**
 * Inferred input type for scheduler params (before Zod transforms).
 */
export type SchedulerParamsSchemaInput = z.input<typeof schedulerParamsSchema>;

/**
 * Inferred output type for scheduler params (after Zod transforms).
 */
export type SchedulerParamsSchemaOutput = z.output<typeof schedulerParamsSchema>;

/**
 * Inferred input type for day detail params (before Zod transforms).
 */
export type SchedulerDayDetailParamsSchemaInput = z.input<typeof schedulerDayDetailParamsSchema>;

/**
 * Inferred output type for day detail params (after Zod transforms).
 */
export type SchedulerDayDetailParamsSchemaOutput = z.output<typeof schedulerDayDetailParamsSchema>;
