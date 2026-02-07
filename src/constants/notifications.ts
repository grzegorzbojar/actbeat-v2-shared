/**
 * Notification constants for the Actbeat theater management system.
 * Defines notification group mappings, default preferences, and lookup utilities.
 * @module constants/notifications
 */

import {
  NotificationType,
  NotificationPreferenceGroup,
} from '../types/notification.types.js';
import type {
  NotificationGroupPreference,
  NotificationPreferences,
} from '../types/notification.types.js';

/**
 * Mapping of notification preference groups to their constituent notification types.
 * Used to determine which group a notification type belongs to for preference lookup.
 *
 * @example
 * ```typescript
 * const types = GROUP_NOTIFICATION_TYPES[NotificationPreferenceGroup.EVENTS_SCHEDULING];
 * // [NotificationType.EVENT_PUBLISHED, NotificationType.EVENT_CANCELLED, NotificationType.EVENT_CONFLICT_WARNING]
 * ```
 */
export const GROUP_NOTIFICATION_TYPES: Record<NotificationPreferenceGroup, readonly NotificationType[]> = {
  [NotificationPreferenceGroup.EVENTS_SCHEDULING]: [
    NotificationType.EVENT_PUBLISHED,
    NotificationType.EVENT_CANCELLED,
    NotificationType.EVENT_CONFLICT_WARNING,
  ],
  [NotificationPreferenceGroup.ROLES_CASTING]: [
    NotificationType.OPEN_ROLE_AVAILABLE,
    NotificationType.OPEN_ROLE_ASSIGNED,
    NotificationType.OPEN_ROLE_REMOVED,
  ],
  [NotificationPreferenceGroup.ADMIN_RESPONSES]: [
    NotificationType.INVITATION_ACCEPTED,
    NotificationType.INVITATION_DECLINED,
    NotificationType.OPEN_ROLE_SIGNUP,
  ],
  [NotificationPreferenceGroup.ADMIN_SYSTEM]: [
    NotificationType.HEALTHCHECK_ISSUES,
  ],
} as const;

/**
 * Default preference for a single notification group.
 * In-app notifications enabled, email notifications disabled.
 */
export const DEFAULT_GROUP_PREFERENCE: NotificationGroupPreference = {
  inApp: true,
  email: false,
} as const;

/**
 * Default notification preferences for all groups.
 * All groups have in-app notifications enabled and email notifications disabled.
 *
 * @example
 * ```typescript
 * // Use as initial value when creating user preferences
 * const prefs = { ...DEFAULT_NOTIFICATION_PREFERENCES };
 * ```
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  [NotificationPreferenceGroup.EVENTS_SCHEDULING]: { inApp: true, email: false },
  [NotificationPreferenceGroup.ROLES_CASTING]: { inApp: true, email: false },
  [NotificationPreferenceGroup.ADMIN_RESPONSES]: { inApp: true, email: false },
  [NotificationPreferenceGroup.ADMIN_SYSTEM]: { inApp: true, email: false },
} as const;

/**
 * Array of all notification preference groups for iteration.
 *
 * @example
 * ```typescript
 * for (const group of ALL_NOTIFICATION_GROUPS) {
 *   const types = getNotificationTypesForGroup(group);
 *   // process types...
 * }
 * ```
 */
export const ALL_NOTIFICATION_GROUPS: readonly NotificationPreferenceGroup[] = [
  NotificationPreferenceGroup.EVENTS_SCHEDULING,
  NotificationPreferenceGroup.ROLES_CASTING,
  NotificationPreferenceGroup.ADMIN_RESPONSES,
  NotificationPreferenceGroup.ADMIN_SYSTEM,
] as const;

/**
 * Reverse lookup: find the preference group for a given notification type.
 *
 * @param type - The notification type to look up
 * @returns The preference group containing this type, or undefined if not found
 *
 * @example
 * ```typescript
 * const group = getGroupForNotificationType(NotificationType.EVENT_PUBLISHED);
 * // NotificationPreferenceGroup.EVENTS_SCHEDULING
 * ```
 */
export function getGroupForNotificationType(
  type: NotificationType,
): NotificationPreferenceGroup | undefined {
  for (const group of ALL_NOTIFICATION_GROUPS) {
    const types = GROUP_NOTIFICATION_TYPES[group];
    if (types.includes(type)) {
      return group;
    }
  }
  return undefined;
}

/**
 * Forward lookup: get all notification types belonging to a preference group.
 *
 * @param group - The preference group to look up
 * @returns Array of notification types in this group
 *
 * @example
 * ```typescript
 * const types = getNotificationTypesForGroup(NotificationPreferenceGroup.ROLES_CASTING);
 * // [NotificationType.OPEN_ROLE_AVAILABLE, NotificationType.OPEN_ROLE_ASSIGNED, NotificationType.OPEN_ROLE_REMOVED]
 * ```
 */
export function getNotificationTypesForGroup(
  group: NotificationPreferenceGroup,
): readonly NotificationType[] {
  return GROUP_NOTIFICATION_TYPES[group];
}
