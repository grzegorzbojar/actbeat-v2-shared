/**
 * Notification types for the Actbeat theater management system.
 * Notifications inform users about events, role changes, and system alerts.
 * @module types/notification
 */

/**
 * Notification type enumeration matching Prisma schema.
 * Defines the types of notifications that can be sent to users.
 */
export enum NotificationType {
  /** An event has been published and is now visible */
  EVENT_PUBLISHED = 'EVENT_PUBLISHED',
  /** An event has been cancelled */
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  /** An open role is available for signup */
  OPEN_ROLE_AVAILABLE = 'OPEN_ROLE_AVAILABLE',
  /** A user has been assigned to an open role */
  OPEN_ROLE_ASSIGNED = 'OPEN_ROLE_ASSIGNED',
  /** A user has been removed from an open role */
  OPEN_ROLE_REMOVED = 'OPEN_ROLE_REMOVED',
  /** An organization invitation has been accepted */
  INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
  /** An organization invitation has been declined */
  INVITATION_DECLINED = 'INVITATION_DECLINED',
  /** A user has signed up for an open role */
  OPEN_ROLE_SIGNUP = 'OPEN_ROLE_SIGNUP',
  /** Healthcheck detected issues with events */
  HEALTHCHECK_ISSUES = 'HEALTHCHECK_ISSUES',
  /** A scheduling conflict has been detected for an event */
  EVENT_CONFLICT_WARNING = 'EVENT_CONFLICT_WARNING',
}

/**
 * Notification preference group enumeration.
 * Groups related notification types for user preference management.
 */
export enum NotificationPreferenceGroup {
  /** Event publishing and cancellation notifications */
  EVENTS_SCHEDULING = 'EVENTS_SCHEDULING',
  /** Open role availability and assignment notifications */
  ROLES_CASTING = 'ROLES_CASTING',
  /** Admin-visible responses (invitation and signup notifications) */
  ADMIN_RESPONSES = 'ADMIN_RESPONSES',
  /** System-level notifications (healthcheck, conflicts) */
  ADMIN_SYSTEM = 'ADMIN_SYSTEM',
}

/**
 * Per-channel preference for a notification group.
 * Controls whether notifications are delivered via in-app and/or email.
 */
export interface NotificationGroupPreference {
  /** Whether in-app notifications are enabled for this group */
  inApp: boolean;
  /** Whether email notifications are enabled for this group */
  email: boolean;
}

/**
 * Full notification preferences mapping each group to its channel preferences.
 */
export type NotificationPreferences = Record<NotificationPreferenceGroup, NotificationGroupPreference>;

/**
 * Core Notification entity matching the Prisma Notification model.
 * Represents a single notification sent to a user.
 */
export interface Notification {
  /** Unique identifier (UUID) */
  id: string;
  /** Clerk user ID of the notification recipient */
  userId: string;
  /** Organization ID, null for system-wide notifications */
  orgId: string | null;
  /** Type of notification */
  type: NotificationType;
  /** Notification title (short summary) */
  title: string;
  /** Notification body with additional details */
  body: string | null;
  /** URL to navigate to when the notification is clicked */
  actionUrl: string | null;
  /** Type of the related entity (e.g., 'EVENT', 'PLAY') */
  entityType: string | null;
  /** ID of the related entity */
  entityId: string | null;
  /** Clerk user ID of the actor who triggered the notification */
  actorId: string | null;
  /** Additional structured payload data */
  payload: Record<string, unknown> | null;
  /** When the notification was read, null if unread */
  readAt: Date | null;
  /** Whether an email was sent for this notification */
  emailSent: boolean;
  /** When the notification was created */
  createdAt: Date;
}

/**
 * Notification response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 * Includes resolved actor information from Clerk.
 */
export interface NotificationResponse {
  /** Unique identifier */
  id: string;
  /** Clerk user ID of the notification recipient */
  userId: string;
  /** Organization ID, null for system-wide notifications */
  orgId: string | null;
  /** Type of notification */
  type: NotificationType;
  /** Notification title (short summary) */
  title: string;
  /** Notification body with additional details */
  body: string | null;
  /** URL to navigate to when the notification is clicked */
  actionUrl: string | null;
  /** Type of the related entity */
  entityType: string | null;
  /** ID of the related entity */
  entityId: string | null;
  /** Clerk user ID of the actor who triggered the notification */
  actorId: string | null;
  /** Additional structured payload data */
  payload: Record<string, unknown> | null;
  /** When the notification was read (ISO string), null if unread */
  readAt: string | null;
  /** Whether an email was sent for this notification */
  emailSent: boolean;
  /** When the notification was created (ISO string) */
  createdAt: string;
  /** Display name of the actor (resolved from Clerk at query time) */
  actorName: string | null;
  /** Avatar URL of the actor (resolved from Clerk at query time) */
  actorImageUrl: string | null;
}

/**
 * Input type for creating a new notification.
 * Used internally by the notification service when dispatching notifications.
 */
export interface CreateNotificationInput {
  /** Clerk user ID of the notification recipient */
  userId: string;
  /** Organization ID for org-scoped notifications */
  orgId?: string;
  /** Type of notification */
  type: NotificationType;
  /** Notification title (short summary) */
  title: string;
  /** Notification body with additional details */
  body?: string;
  /** URL to navigate to when the notification is clicked */
  actionUrl?: string;
  /** Type of the related entity */
  entityType?: string;
  /** ID of the related entity */
  entityId?: string;
  /** Clerk user ID of the actor who triggered the notification */
  actorId?: string;
  /** Additional structured payload data */
  payload?: Record<string, unknown>;
}

/**
 * Query parameters for fetching notifications with cursor-based pagination.
 */
export interface NotificationQueryParams {
  /** Cursor for pagination (notification ID from previous page) */
  cursor?: string;
  /** Maximum number of results to return (1-100, default 20) */
  limit?: number;
  /** If true, only return unread notifications */
  unreadOnly?: boolean;
  /** Filter by notification type */
  type?: NotificationType;
  /** Filter by organization ID */
  orgId?: string;
}

/**
 * Cursor-based pagination response for notifications list.
 * Includes unread count for badge display.
 */
export interface NotificationsListResponse {
  /** List of notification entries */
  data: NotificationResponse[];
  /** Pagination and count metadata */
  meta: {
    /** Cursor for fetching the next page, null if no more results */
    cursor: string | null;
    /** Whether there are more results after this page */
    hasMore: boolean;
    /** Total number of unread notifications for the user */
    unreadCount: number;
  };
}
