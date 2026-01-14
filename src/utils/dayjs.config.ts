/**
 * Day.js configuration with required plugins for date operations.
 * @module utils/dayjs.config
 */

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import minMax from 'dayjs/plugin/minMax.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// Extend dayjs with plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(minMax);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Configured Day.js instance with all required plugins.
 * Use this throughout the application for consistent date handling.
 *
 * @example
 * ```typescript
 * import { dayjsInstance } from '@actbeat/shared';
 *
 * const now = dayjsInstance();
 * const tomorrow = dayjsInstance().add(1, 'day');
 * ```
 */
export const dayjsInstance = dayjs;

/**
 * Re-export dayjs types for convenience.
 */
export type { Dayjs, ConfigType } from 'dayjs';
