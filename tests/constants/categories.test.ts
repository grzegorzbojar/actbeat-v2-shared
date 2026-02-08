/**
 * Tests for event category constants.
 */

import { describe, it, expect } from 'vitest';
import { EventCategory } from '../../src/types/event.types.js';
import {
  EVENT_CATEGORIES,
  getCategoryInfo,
  getCategoryColor,
  getCategoryTextColor,
  ALL_CATEGORIES,
  ORG_CATEGORIES,
  type CategoryInfo,
} from '../../src/constants/categories.js';

describe('Category Constants', () => {
  describe('EVENT_CATEGORIES', () => {
    it('should have an entry for every EventCategory', () => {
      for (const category of Object.values(EventCategory)) {
        expect(EVENT_CATEGORIES[category]).toBeDefined();
      }
    });

    it('should have correct structure for each category', () => {
      for (const category of Object.values(EventCategory)) {
        const info: CategoryInfo = EVENT_CATEGORIES[category];
        expect(info.id).toBe(category);
        expect(typeof info.labelKey).toBe('string');
        expect(info.labelKey.length).toBeGreaterThan(0);
        expect(typeof info.defaultLabel).toBe('string');
        expect(info.defaultLabel.length).toBeGreaterThan(0);
        expect(info.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(info.textColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(typeof info.descriptionKey).toBe('string');
        expect(typeof info.defaultDescription).toBe('string');
      }
    });

    it('should have unique colors for each category', () => {
      const colors = Object.values(EVENT_CATEGORIES).map((c) => c.color);
      expect(new Set(colors).size).toBe(colors.length);
    });

    it('should have correct PRIVATE category info', () => {
      const info = EVENT_CATEGORIES[EventCategory.PRIVATE];
      expect(info.defaultLabel).toBe('Private');
      expect(info.labelKey).toBe('eventCategory.private');
    });

    it('should have correct PLAY category info', () => {
      const info = EVENT_CATEGORIES[EventCategory.PLAY];
      expect(info.defaultLabel).toBe('Play');
      expect(info.color).toBe('#3B82F6');
    });
  });

  describe('getCategoryInfo', () => {
    it('should return info for each category', () => {
      for (const category of Object.values(EventCategory)) {
        const info = getCategoryInfo(category);
        expect(info).toBe(EVENT_CATEGORIES[category]);
        expect(info.id).toBe(category);
      }
    });
  });

  describe('getCategoryColor', () => {
    it('should return hex color for each category', () => {
      for (const category of Object.values(EventCategory)) {
        const color = getCategoryColor(category);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(color).toBe(EVENT_CATEGORIES[category].color);
      }
    });

    it('should return correct color for PLAY', () => {
      expect(getCategoryColor(EventCategory.PLAY)).toBe('#3B82F6');
    });

    it('should return correct color for TECHNICAL', () => {
      expect(getCategoryColor(EventCategory.TECHNICAL)).toBe('#F59E0B');
    });
  });

  describe('getCategoryTextColor', () => {
    it('should return hex color for each category', () => {
      for (const category of Object.values(EventCategory)) {
        const textColor = getCategoryTextColor(category);
        expect(textColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(textColor).toBe(EVENT_CATEGORIES[category].textColor);
      }
    });

    it('should return black for TECHNICAL (amber background)', () => {
      expect(getCategoryTextColor(EventCategory.TECHNICAL)).toBe('#000000');
    });

    it('should return white for most categories', () => {
      expect(getCategoryTextColor(EventCategory.PLAY)).toBe('#FFFFFF');
      expect(getCategoryTextColor(EventCategory.PRIVATE)).toBe('#FFFFFF');
      expect(getCategoryTextColor(EventCategory.REHEARSAL)).toBe('#FFFFFF');
    });
  });

  describe('ALL_CATEGORIES', () => {
    it('should include all EventCategory values', () => {
      for (const category of Object.values(EventCategory)) {
        expect(ALL_CATEGORIES).toContain(category);
      }
    });

    it('should have 6 categories', () => {
      expect(ALL_CATEGORIES).toHaveLength(6);
    });

    it('should include PRIVATE', () => {
      expect(ALL_CATEGORIES).toContain(EventCategory.PRIVATE);
    });
  });

  describe('ORG_CATEGORIES', () => {
    it('should exclude PRIVATE', () => {
      expect(ORG_CATEGORIES).not.toContain(EventCategory.PRIVATE);
    });

    it('should have 5 categories', () => {
      expect(ORG_CATEGORIES).toHaveLength(5);
    });

    it('should include all org categories', () => {
      expect(ORG_CATEGORIES).toContain(EventCategory.PLAY);
      expect(ORG_CATEGORIES).toContain(EventCategory.REHEARSAL);
      expect(ORG_CATEGORIES).toContain(EventCategory.TRIAL);
      expect(ORG_CATEGORIES).toContain(EventCategory.TECHNICAL);
      expect(ORG_CATEGORIES).toContain(EventCategory.OTHER);
    });
  });
});
