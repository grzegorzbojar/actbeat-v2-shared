/**
 * Event category constants for the Actbeat theater management system.
 * Defines category metadata including colors for display.
 * @module constants/categories
 */

import { EventCategory } from '../types/event.types.js';

/**
 * Category display information.
 */
export interface CategoryInfo {
  /** Category identifier */
  id: EventCategory;
  /** i18n key for category name */
  labelKey: string;
  /** Default label (English) */
  defaultLabel: string;
  /** Hex color for display */
  color: string;
  /** Hex color for text on this background */
  textColor: string;
  /** i18n key for category description */
  descriptionKey: string;
  /** Default description (English) */
  defaultDescription: string;
}

/**
 * Event categories with display metadata.
 * Colors are chosen for accessibility and visual distinction.
 */
export const EVENT_CATEGORIES: Record<EventCategory, CategoryInfo> = {
  [EventCategory.PRIVATE]: {
    id: EventCategory.PRIVATE,
    labelKey: 'eventCategory.private',
    defaultLabel: 'Private',
    color: '#6B7280', // Gray
    textColor: '#FFFFFF',
    descriptionKey: 'eventCategory.privateDescription',
    defaultDescription: 'Personal events visible only to you',
  },
  [EventCategory.PLAY]: {
    id: EventCategory.PLAY,
    labelKey: 'eventCategory.play',
    defaultLabel: 'Play',
    color: '#3B82F6', // Blue
    textColor: '#FFFFFF',
    descriptionKey: 'eventCategory.playDescription',
    defaultDescription: 'Rehearsals and performances',
  },
  [EventCategory.TRIAL]: {
    id: EventCategory.TRIAL,
    labelKey: 'eventCategory.trial',
    defaultLabel: 'Trial',
    color: '#8B5CF6', // Purple
    textColor: '#FFFFFF',
    descriptionKey: 'eventCategory.trialDescription',
    defaultDescription: 'Auditions and casting sessions',
  },
  [EventCategory.TECHNICAL]: {
    id: EventCategory.TECHNICAL,
    labelKey: 'eventCategory.technical',
    defaultLabel: 'Technical',
    color: '#F59E0B', // Amber
    textColor: '#000000',
    descriptionKey: 'eventCategory.technicalDescription',
    defaultDescription: 'Technical rehearsals and setup',
  },
} as const;

/**
 * Get category information by ID.
 *
 * @param category - The event category
 * @returns Category display information
 *
 * @example
 * ```typescript
 * const info = getCategoryInfo(EventCategory.PLAY);
 * // { id: 'PLAY', labelKey: 'eventCategory.play', color: '#3B82F6', ... }
 * ```
 */
export function getCategoryInfo(category: EventCategory): CategoryInfo {
  return EVENT_CATEGORIES[category];
}

/**
 * Get the color for a category.
 *
 * @param category - The event category
 * @returns Hex color string
 *
 * @example
 * ```typescript
 * const color = getCategoryColor(EventCategory.PLAY);
 * // '#3B82F6'
 * ```
 */
export function getCategoryColor(category: EventCategory): string {
  return EVENT_CATEGORIES[category].color;
}

/**
 * Get the text color for a category background.
 *
 * @param category - The event category
 * @returns Hex color string for text
 *
 * @example
 * ```typescript
 * const textColor = getCategoryTextColor(EventCategory.TECHNICAL);
 * // '#000000' (black for amber background)
 * ```
 */
export function getCategoryTextColor(category: EventCategory): string {
  return EVENT_CATEGORIES[category].textColor;
}

/**
 * Array of all categories for iteration.
 */
export const ALL_CATEGORIES: readonly EventCategory[] = [
  EventCategory.PRIVATE,
  EventCategory.PLAY,
  EventCategory.TRIAL,
  EventCategory.TECHNICAL,
] as const;

/**
 * Organization-visible categories (excludes PRIVATE).
 */
export const ORG_CATEGORIES: readonly EventCategory[] = [
  EventCategory.PLAY,
  EventCategory.TRIAL,
  EventCategory.TECHNICAL,
] as const;
