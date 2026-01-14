/**
 * Tests for date utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  mergeTimeBlocks,
  mergeTimeBlocksDates,
  subtractTimeBlock,
  subtractTimeBlocks,
  subtractTimeBlocksDates,
  intersectTimeBlocks,
  intersectTimeBlocksDates,
  isTimeBlockOverlapping,
  isTimeBlockOverlappingDates,
  getBlockDurationMinutes,
  filterByMinDuration,
  toDayjsBlock,
  toDateBlock,
} from '../../src/utils/date.utils.js';
import { dayjsInstance } from '../../src/utils/dayjs.config.js';
import type { DayjsTimeBlock, TimeBlock } from '../../src/types/search.types.js';

describe('Date Utils', () => {
  describe('toDayjsBlock / toDateBlock', () => {
    it('should convert TimeBlock to DayjsTimeBlock and back', () => {
      const dateBlock: TimeBlock = {
        start: new Date('2024-01-01T09:00:00Z'),
        end: new Date('2024-01-01T12:00:00Z'),
      };

      const dayjsBlock = toDayjsBlock(dateBlock);
      expect(dayjsBlock.start.toISOString()).toBe('2024-01-01T09:00:00.000Z');
      expect(dayjsBlock.end.toISOString()).toBe('2024-01-01T12:00:00.000Z');

      const backToDate = toDateBlock(dayjsBlock);
      expect(backToDate.start.getTime()).toBe(dateBlock.start.getTime());
      expect(backToDate.end.getTime()).toBe(dateBlock.end.getTime());
    });
  });

  describe('mergeTimeBlocks', () => {
    it('should return empty array for empty input', () => {
      expect(mergeTimeBlocks([])).toEqual([]);
    });

    it('should return single block unchanged', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T12:00') },
      ];
      const result = mergeTimeBlocks(blocks);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('12:00');
    });

    it('should merge overlapping blocks', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T11:00') },
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T12:00') },
      ];
      const result = mergeTimeBlocks(blocks);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('12:00');
    });

    it('should merge adjacent blocks', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T10:00') },
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T11:00') },
      ];
      const result = mergeTimeBlocks(blocks);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('11:00');
    });

    it('should not merge non-overlapping blocks', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T10:00') },
        { start: dayjsInstance('2024-01-01T11:00'), end: dayjsInstance('2024-01-01T12:00') },
      ];
      const result = mergeTimeBlocks(blocks);
      expect(result).toHaveLength(2);
    });

    it('should handle unsorted input', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T14:00'), end: dayjsInstance('2024-01-01T16:00') },
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T11:00') },
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T12:00') },
      ];
      const result = mergeTimeBlocks(blocks);
      expect(result).toHaveLength(2);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('12:00');
      expect(result[1]?.start.format('HH:mm')).toBe('14:00');
      expect(result[1]?.end.format('HH:mm')).toBe('16:00');
    });
  });

  describe('mergeTimeBlocksDates', () => {
    it('should work with Date objects', () => {
      const blocks: TimeBlock[] = [
        { start: new Date('2024-01-01T09:00:00Z'), end: new Date('2024-01-01T11:00:00Z') },
        { start: new Date('2024-01-01T10:00:00Z'), end: new Date('2024-01-01T12:00:00Z') },
      ];
      const result = mergeTimeBlocksDates(blocks);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.toISOString()).toBe('2024-01-01T09:00:00.000Z');
      expect(result[0]?.end.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });
  });

  describe('subtractTimeBlock', () => {
    it('should return original block when no overlap (event before)', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T08:00'),
        end: dayjsInstance('2024-01-01T09:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('10:00');
      expect(result[0]?.end.format('HH:mm')).toBe('14:00');
    });

    it('should return original block when no overlap (event after)', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T15:00'),
        end: dayjsInstance('2024-01-01T16:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(1);
    });

    it('should split block when event is in the middle', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T17:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T12:00'),
        end: dayjsInstance('2024-01-01T13:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(2);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('12:00');
      expect(result[1]?.start.format('HH:mm')).toBe('13:00');
      expect(result[1]?.end.format('HH:mm')).toBe('17:00');
    });

    it('should trim start when event overlaps beginning', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T11:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('11:00');
      expect(result[0]?.end.format('HH:mm')).toBe('14:00');
    });

    it('should trim end when event overlaps end', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T13:00'),
        end: dayjsInstance('2024-01-01T15:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('10:00');
      expect(result[0]?.end.format('HH:mm')).toBe('13:00');
    });

    it('should return empty when event completely covers block', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      const event: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T15:00'),
      };
      const result = subtractTimeBlock(block, event);
      expect(result).toHaveLength(0);
    });
  });

  describe('subtractTimeBlocks', () => {
    it('should subtract multiple events', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T17:00'),
      };
      const events: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T11:00') },
        { start: dayjsInstance('2024-01-01T14:00'), end: dayjsInstance('2024-01-01T15:00') },
      ];
      const result = subtractTimeBlocks(block, events);
      expect(result).toHaveLength(3);
      expect(result[0]?.start.format('HH:mm')).toBe('09:00');
      expect(result[0]?.end.format('HH:mm')).toBe('10:00');
      expect(result[1]?.start.format('HH:mm')).toBe('11:00');
      expect(result[1]?.end.format('HH:mm')).toBe('14:00');
      expect(result[2]?.start.format('HH:mm')).toBe('15:00');
      expect(result[2]?.end.format('HH:mm')).toBe('17:00');
    });
  });

  describe('subtractTimeBlocksDates', () => {
    it('should work with Date objects', () => {
      const block: TimeBlock = {
        start: new Date('2024-01-01T09:00:00Z'),
        end: new Date('2024-01-01T17:00:00Z'),
      };
      const events: TimeBlock[] = [
        { start: new Date('2024-01-01T12:00:00Z'), end: new Date('2024-01-01T13:00:00Z') },
      ];
      const result = subtractTimeBlocksDates(block, events);
      expect(result).toHaveLength(2);
    });
  });

  describe('intersectTimeBlocks', () => {
    it('should return empty for empty inputs', () => {
      expect(intersectTimeBlocks([], [])).toEqual([]);
      expect(intersectTimeBlocks([{ start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T10:00') }], [])).toEqual([]);
    });

    it('should find overlapping periods', () => {
      const blocksA: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T14:00') },
      ];
      const blocksB: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T12:00'), end: dayjsInstance('2024-01-01T17:00') },
      ];
      const result = intersectTimeBlocks(blocksA, blocksB);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('12:00');
      expect(result[0]?.end.format('HH:mm')).toBe('14:00');
    });

    it('should handle multiple overlaps', () => {
      const blocksA: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T11:00') },
        { start: dayjsInstance('2024-01-01T14:00'), end: dayjsInstance('2024-01-01T17:00') },
      ];
      const blocksB: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T15:00') },
      ];
      const result = intersectTimeBlocks(blocksA, blocksB);
      expect(result).toHaveLength(2);
      expect(result[0]?.start.format('HH:mm')).toBe('10:00');
      expect(result[0]?.end.format('HH:mm')).toBe('11:00');
      expect(result[1]?.start.format('HH:mm')).toBe('14:00');
      expect(result[1]?.end.format('HH:mm')).toBe('15:00');
    });

    it('should return empty when no overlap', () => {
      const blocksA: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T10:00') },
      ];
      const blocksB: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T11:00'), end: dayjsInstance('2024-01-01T12:00') },
      ];
      const result = intersectTimeBlocks(blocksA, blocksB);
      expect(result).toHaveLength(0);
    });
  });

  describe('intersectTimeBlocksDates', () => {
    it('should work with Date objects', () => {
      const blocksA: TimeBlock[] = [
        { start: new Date('2024-01-01T09:00:00Z'), end: new Date('2024-01-01T14:00:00Z') },
      ];
      const blocksB: TimeBlock[] = [
        { start: new Date('2024-01-01T12:00:00Z'), end: new Date('2024-01-01T17:00:00Z') },
      ];
      const result = intersectTimeBlocksDates(blocksA, blocksB);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.toISOString()).toBe('2024-01-01T12:00:00.000Z');
      expect(result[0]?.end.toISOString()).toBe('2024-01-01T14:00:00.000Z');
    });
  });

  describe('isTimeBlockOverlapping', () => {
    it('should detect overlap', () => {
      const a: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T12:00'),
      };
      const b: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T11:00'),
        end: dayjsInstance('2024-01-01T14:00'),
      };
      expect(isTimeBlockOverlapping(a, b)).toBe(true);
    });

    it('should return false for non-overlapping blocks', () => {
      const a: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T10:00'),
      };
      const b: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T11:00'),
        end: dayjsInstance('2024-01-01T12:00'),
      };
      expect(isTimeBlockOverlapping(a, b)).toBe(false);
    });

    it('should return false for adjacent blocks (no overlap)', () => {
      const a: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T10:00'),
      };
      const b: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T10:00'),
        end: dayjsInstance('2024-01-01T11:00'),
      };
      expect(isTimeBlockOverlapping(a, b)).toBe(false);
    });
  });

  describe('isTimeBlockOverlappingDates', () => {
    it('should work with Date objects', () => {
      const a: TimeBlock = {
        start: new Date('2024-01-01T09:00:00Z'),
        end: new Date('2024-01-01T12:00:00Z'),
      };
      const b: TimeBlock = {
        start: new Date('2024-01-01T11:00:00Z'),
        end: new Date('2024-01-01T14:00:00Z'),
      };
      expect(isTimeBlockOverlappingDates(a, b)).toBe(true);
    });
  });

  describe('getBlockDurationMinutes', () => {
    it('should calculate duration in minutes', () => {
      const block: DayjsTimeBlock = {
        start: dayjsInstance('2024-01-01T09:00'),
        end: dayjsInstance('2024-01-01T11:30'),
      };
      expect(getBlockDurationMinutes(block)).toBe(150);
    });
  });

  describe('filterByMinDuration', () => {
    it('should filter blocks by minimum duration', () => {
      const blocks: DayjsTimeBlock[] = [
        { start: dayjsInstance('2024-01-01T09:00'), end: dayjsInstance('2024-01-01T09:30') }, // 30 min
        { start: dayjsInstance('2024-01-01T10:00'), end: dayjsInstance('2024-01-01T12:00') }, // 120 min
        { start: dayjsInstance('2024-01-01T13:00'), end: dayjsInstance('2024-01-01T13:45') }, // 45 min
      ];
      const result = filterByMinDuration(blocks, 60);
      expect(result).toHaveLength(1);
      expect(result[0]?.start.format('HH:mm')).toBe('10:00');
    });
  });
});
