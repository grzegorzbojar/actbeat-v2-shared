/**
 * Utility functions for the Actbeat theater management system.
 * @module utils
 */

// Day.js configuration
export { dayjsInstance, type Dayjs, type ConfigType } from './dayjs.config.js';

// Date utilities
export {
  toDayjsBlock,
  toDateBlock,
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
  getBlockDurationMinutesDates,
  filterByMinDuration,
  filterByMinDurationDates,
} from './date.utils.js';

// Combination utilities
export {
  generateCombinations,
  generateCombinationsAllowingMultipleRoles,
  combinationToAssignments,
  getUniqueActorsFromCombination,
  countPossibleCombinations,
  validateCastability,
} from './combinations.js';

// Validation utilities
export {
  isValidHexColor,
  isValidDuration,
  isValidLatitude,
  isValidLongitude,
  isValidCoordinates,
  isNonEmptyString,
  isValidEmail,
  isValidDateRange,
  isValidId,
  isValidIdArray,
  sanitizeString,
  sanitizeHexColor,
} from './validation.utils.js';

// PlayEvent mapper utilities
export {
  eventToPlayEvent,
  playEventToCreateInput,
  isPlayEvent,
  isDraftEvent,
  isOrgEvent,
  type PlayEvent,
  type CreatePlayEventInput,
} from './playEvent.mapper.js';
