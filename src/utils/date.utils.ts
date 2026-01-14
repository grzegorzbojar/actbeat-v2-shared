/**
 * Date utility functions for time block operations.
 * Used in availability search and scheduling.
 * Based on v1 helpers/dateUtils.js
 * @module utils/date
 */

import type { DayjsTimeBlock, TimeBlock } from '../types/search.types.js';
import { dayjsInstance } from './dayjs.config.js';
import type { Dayjs } from 'dayjs';

/**
 * Convert a TimeBlock with Date objects to DayjsTimeBlock.
 *
 * @param block - Time block with Date objects
 * @returns Time block with Dayjs instances
 */
export function toDayjsBlock(block: TimeBlock): DayjsTimeBlock {
  return {
    start: dayjsInstance(block.start),
    end: dayjsInstance(block.end),
  };
}

/**
 * Convert a DayjsTimeBlock to TimeBlock with Date objects.
 *
 * @param block - Time block with Dayjs instances
 * @returns Time block with Date objects
 */
export function toDateBlock(block: DayjsTimeBlock): TimeBlock {
  return {
    start: block.start.toDate(),
    end: block.end.toDate(),
  };
}

/**
 * Merges overlapping time blocks into non-overlapping blocks.
 * Based on v1 helpers/dateUtils.js mergeTimeBlocks
 *
 * @param blocks - Array of time blocks with Dayjs instances
 * @returns Array of merged non-overlapping time blocks
 *
 * @example
 * ```typescript
 * const blocks = [
 *   { start: dayjs('2024-01-01T09:00'), end: dayjs('2024-01-01T11:00') },
 *   { start: dayjs('2024-01-01T10:00'), end: dayjs('2024-01-01T12:00') },
 * ];
 * const merged = mergeTimeBlocks(blocks);
 * // [{ start: '2024-01-01T09:00', end: '2024-01-01T12:00' }]
 * ```
 */
export function mergeTimeBlocks(blocks: DayjsTimeBlock[]): DayjsTimeBlock[] {
  if (blocks.length === 0) return [];

  // Sort blocks by start time
  const sorted = [...blocks].sort((a, b) => a.start.valueOf() - b.start.valueOf());

  const firstBlock = sorted[0];
  if (!firstBlock) return [];

  const merged: DayjsTimeBlock[] = [{ start: firstBlock.start, end: firstBlock.end }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (!current || !last) continue;

    if (current.start.isSameOrBefore(last.end)) {
      // Overlapping blocks: merge them
      last.end = dayjsInstance.max(last.end, current.end) as Dayjs;
    } else {
      merged.push({ start: current.start, end: current.end });
    }
  }

  return merged;
}

/**
 * Merges overlapping time blocks (Date version).
 *
 * @param blocks - Array of time blocks with Date objects
 * @returns Array of merged non-overlapping time blocks
 */
export function mergeTimeBlocksDates(blocks: TimeBlock[]): TimeBlock[] {
  const dayjsBlocks = blocks.map(toDayjsBlock);
  const merged = mergeTimeBlocks(dayjsBlocks);
  return merged.map(toDateBlock);
}

/**
 * Subtracts an event time block from an availability block.
 * Returns the remaining availability after removing the event.
 * Based on v1 helpers/dateUtils.js subtractTimeBlocks
 *
 * @param block - Availability block to subtract from
 * @param event - Event block to remove
 * @returns Array of remaining availability blocks
 *
 * @example
 * ```typescript
 * const availability = { start: dayjs('2024-01-01T09:00'), end: dayjs('2024-01-01T17:00') };
 * const event = { start: dayjs('2024-01-01T12:00'), end: dayjs('2024-01-01T13:00') };
 * const remaining = subtractTimeBlock(availability, event);
 * // [
 * //   { start: '09:00', end: '12:00' },
 * //   { start: '13:00', end: '17:00' }
 * // ]
 * ```
 */
export function subtractTimeBlock(block: DayjsTimeBlock, event: DayjsTimeBlock): DayjsTimeBlock[] {
  // No overlap - event is completely before or after block
  if (event.end.isSameOrBefore(block.start) || event.start.isSameOrAfter(block.end)) {
    return [block];
  }

  const result: DayjsTimeBlock[] = [];

  // Part before the event
  if (event.start.isAfter(block.start)) {
    result.push({ start: block.start, end: event.start });
  }

  // Part after the event
  if (event.end.isBefore(block.end)) {
    result.push({ start: event.end, end: block.end });
  }

  return result;
}

/**
 * Subtracts multiple event blocks from an availability block.
 *
 * @param block - Availability block to subtract from
 * @param events - Event blocks to remove
 * @returns Array of remaining availability blocks
 */
export function subtractTimeBlocks(block: DayjsTimeBlock, events: DayjsTimeBlock[]): DayjsTimeBlock[] {
  let remaining: DayjsTimeBlock[] = [block];

  for (const event of events) {
    const newRemaining: DayjsTimeBlock[] = [];
    for (const availBlock of remaining) {
      newRemaining.push(...subtractTimeBlock(availBlock, event));
    }
    remaining = newRemaining;
  }

  return remaining;
}

/**
 * Subtracts time blocks (Date version).
 *
 * @param block - Availability block with Date objects
 * @param events - Event blocks with Date objects
 * @returns Array of remaining availability blocks
 */
export function subtractTimeBlocksDates(block: TimeBlock, events: TimeBlock[]): TimeBlock[] {
  const dayjsBlock = toDayjsBlock(block);
  const dayjsEvents = events.map(toDayjsBlock);
  const result = subtractTimeBlocks(dayjsBlock, dayjsEvents);
  return result.map(toDateBlock);
}

/**
 * Intersects two arrays of time blocks to find overlapping periods.
 * Based on v1 helpers/dateUtils.js intersectTimeBlocks
 *
 * @param blocksA - First array of time blocks
 * @param blocksB - Second array of time blocks
 * @returns Array of intersected time blocks
 *
 * @example
 * ```typescript
 * const actor1Avail = [{ start: dayjs('09:00'), end: dayjs('14:00') }];
 * const actor2Avail = [{ start: dayjs('12:00'), end: dayjs('17:00') }];
 * const overlap = intersectTimeBlocks(actor1Avail, actor2Avail);
 * // [{ start: '12:00', end: '14:00' }]
 * ```
 */
export function intersectTimeBlocks(blocksA: DayjsTimeBlock[], blocksB: DayjsTimeBlock[]): DayjsTimeBlock[] {
  if (blocksA.length === 0 || blocksB.length === 0) return [];

  // Sort both arrays by start time
  const sortedA = [...blocksA].sort((a, b) => a.start.valueOf() - b.start.valueOf());
  const sortedB = [...blocksB].sort((a, b) => a.start.valueOf() - b.start.valueOf());

  let i = 0;
  let j = 0;
  const result: DayjsTimeBlock[] = [];

  while (i < sortedA.length && j < sortedB.length) {
    const blockA = sortedA[i];
    const blockB = sortedB[j];

    if (!blockA || !blockB) break;

    const start = dayjsInstance.max(blockA.start, blockB.start) as Dayjs;
    const end = dayjsInstance.min(blockA.end, blockB.end) as Dayjs;

    if (start.isBefore(end)) {
      result.push({ start, end });
    }

    // Move the pointer with the earlier end time
    if (blockA.end.isSameOrBefore(blockB.end)) {
      i++;
    } else {
      j++;
    }
  }

  return result;
}

/**
 * Intersects time blocks (Date version).
 *
 * @param blocksA - First array of time blocks with Date objects
 * @param blocksB - Second array of time blocks with Date objects
 * @returns Array of intersected time blocks
 */
export function intersectTimeBlocksDates(blocksA: TimeBlock[], blocksB: TimeBlock[]): TimeBlock[] {
  const dayjsBlocksA = blocksA.map(toDayjsBlock);
  const dayjsBlocksB = blocksB.map(toDayjsBlock);
  const result = intersectTimeBlocks(dayjsBlocksA, dayjsBlocksB);
  return result.map(toDateBlock);
}

/**
 * Checks if two time blocks overlap.
 *
 * @param a - First time block
 * @param b - Second time block
 * @returns True if the blocks overlap
 *
 * @example
 * ```typescript
 * const block1 = { start: dayjs('09:00'), end: dayjs('12:00') };
 * const block2 = { start: dayjs('11:00'), end: dayjs('14:00') };
 * isTimeBlockOverlapping(block1, block2); // true
 * ```
 */
export function isTimeBlockOverlapping(a: DayjsTimeBlock, b: DayjsTimeBlock): boolean {
  return a.start.isBefore(b.end) && a.end.isAfter(b.start);
}

/**
 * Checks if time blocks overlap (Date version).
 *
 * @param a - First time block with Date objects
 * @param b - Second time block with Date objects
 * @returns True if the blocks overlap
 */
export function isTimeBlockOverlappingDates(a: TimeBlock, b: TimeBlock): boolean {
  return isTimeBlockOverlapping(toDayjsBlock(a), toDayjsBlock(b));
}

/**
 * Gets the duration of a time block in minutes.
 *
 * @param block - Time block
 * @returns Duration in minutes
 */
export function getBlockDurationMinutes(block: DayjsTimeBlock): number {
  return block.end.diff(block.start, 'minute');
}

/**
 * Gets the duration of a time block in minutes (Date version).
 *
 * @param block - Time block with Date objects
 * @returns Duration in minutes
 */
export function getBlockDurationMinutesDates(block: TimeBlock): number {
  return getBlockDurationMinutes(toDayjsBlock(block));
}

/**
 * Filters time blocks to only include those meeting minimum duration.
 *
 * @param blocks - Array of time blocks
 * @param minMinutes - Minimum duration in minutes
 * @returns Filtered array of time blocks
 */
export function filterByMinDuration(blocks: DayjsTimeBlock[], minMinutes: number): DayjsTimeBlock[] {
  return blocks.filter((block) => getBlockDurationMinutes(block) >= minMinutes);
}

/**
 * Filters time blocks by minimum duration (Date version).
 *
 * @param blocks - Array of time blocks with Date objects
 * @param minMinutes - Minimum duration in minutes
 * @returns Filtered array of time blocks
 */
export function filterByMinDurationDates(blocks: TimeBlock[], minMinutes: number): TimeBlock[] {
  return blocks.filter((block) => getBlockDurationMinutesDates(block) >= minMinutes);
}
