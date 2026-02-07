/**
 * Zod validation schemas for Notification-related operations.
 * @module schemas/notification
 */

import { z } from 'zod';
import { NotificationType, NotificationPreferenceGroup } from '../types/notification.types.js';

/**
 * Schema for validating NotificationType enum values.
 * @example
 * notificationTypeSchema.parse('EVENT_PUBLISHED'); // 'EVENT_PUBLISHED'
 * notificationTypeSchema.parse('INVALID'); // throws ZodError
 */
export const notificationTypeSchema = z.nativeEnum(NotificationType);

/**
 * Schema for validating NotificationPreferenceGroup enum values.
 * @example
 * notificationPreferenceGroupSchema.parse('EVENTS_SCHEDULING'); // 'EVENTS_SCHEDULING'
 * notificationPreferenceGroupSchema.parse('INVALID'); // throws ZodError
 */
export const notificationPreferenceGroupSchema = z.nativeEnum(NotificationPreferenceGroup);

/**
 * Schema for validating a single notification group preference.
 * Controls in-app and email delivery channels.
 *
 * @example
 * ```typescript
 * notificationGroupPreferenceSchema.parse({ inApp: true, email: false });
 * ```
 */
export const notificationGroupPreferenceSchema = z.object({
  /** Whether in-app notifications are enabled */
  inApp: z.boolean(),
  /** Whether email notifications are enabled */
  email: z.boolean(),
});

/**
 * Schema for validating full notification preferences.
 * Maps each preference group to its channel preferences.
 *
 * @example
 * ```typescript
 * notificationPreferencesSchema.parse({
 *   EVENTS_SCHEDULING: { inApp: true, email: false },
 *   ROLES_CASTING: { inApp: true, email: true },
 *   ADMIN_RESPONSES: { inApp: false, email: false },
 *   ADMIN_SYSTEM: { inApp: true, email: false },
 * });
 * ```
 */
export const notificationPreferencesSchema = z.object({
  [NotificationPreferenceGroup.EVENTS_SCHEDULING]: notificationGroupPreferenceSchema,
  [NotificationPreferenceGroup.ROLES_CASTING]: notificationGroupPreferenceSchema,
  [NotificationPreferenceGroup.ADMIN_RESPONSES]: notificationGroupPreferenceSchema,
  [NotificationPreferenceGroup.ADMIN_SYSTEM]: notificationGroupPreferenceSchema,
});

/**
 * Schema for querying notifications with filtering and cursor-based pagination.
 *
 * @example
 * ```typescript
 * notificationQuerySchema.parse({
 *   limit: 20,
 *   unreadOnly: 'true',
 *   type: 'EVENT_PUBLISHED',
 * });
 * ```
 */
export const notificationQuerySchema = z.object({
  /** Cursor for pagination (notification ID from previous page) */
  cursor: z.string().optional(),
  /** Maximum number of results to return (1-100, default 20) */
  limit: z.coerce.number().min(1).max(100).default(20),
  /** Filter to unread notifications only (query string boolean) */
  unreadOnly: z.string().transform((v) => v === 'true').optional(),
  /** Filter by notification type */
  type: notificationTypeSchema.optional(),
  /** Filter by organization ID */
  orgId: z.string().optional(),
});

/**
 * Schema for marking notifications as read.
 * If notificationIds is omitted, all notifications are marked as read.
 *
 * @example
 * ```typescript
 * markNotificationsReadSchema.parse({ notificationIds: ['uuid-1', 'uuid-2'] });
 * markNotificationsReadSchema.parse({}); // marks all as read
 * ```
 */
export const markNotificationsReadSchema = z.object({
  /** Specific notification IDs to mark as read, omit to mark all */
  notificationIds: z.array(z.string()).optional(),
});

/** Input type for notificationQuerySchema (before coercion) */
export type NotificationQuerySchemaInput = z.input<typeof notificationQuerySchema>;

/** Output type for notificationQuerySchema (after coercion and defaults) */
export type NotificationQuerySchemaOutput = z.output<typeof notificationQuerySchema>;

/** Input type for notificationPreferencesSchema */
export type NotificationPreferencesSchemaInput = z.input<typeof notificationPreferencesSchema>;

/** Output type for notificationPreferencesSchema */
export type NotificationPreferencesSchemaOutput = z.output<typeof notificationPreferencesSchema>;

/** Input type for markNotificationsReadSchema */
export type MarkNotificationsReadSchemaInput = z.input<typeof markNotificationsReadSchema>;

/** Output type for markNotificationsReadSchema */
export type MarkNotificationsReadSchemaOutput = z.output<typeof markNotificationsReadSchema>;
