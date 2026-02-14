/**
 * User preferences types for the Actbeat theater management system.
 * Manages user-specific settings like Google Calendar integration.
 * @module types/userPreferences
 */

import type { NotificationPreferences } from './notification.types.js';

/**
 * Email delivery mode for notifications.
 * - 'immediate': Send one email per notification as it occurs
 * - 'smart_grouped': Batch emails for bulk operations + daily digest
 */
export type EmailDeliveryMode = 'immediate' | 'smart_grouped';

/**
 * User preferences entity from the database.
 * Stores user-specific configuration and settings.
 */
export interface UserPreferences {
  /** Database primary key */
  id: string;
  /** Clerk user ID (foreign key) */
  clerkId: string;
  /** User's email address */
  email: string;
  /** Whether Google Calendar sync is enabled for this user */
  googleCalendarEnabled: boolean;
  /** Whether AI email processing (Sufler) is enabled for this user */
  aiEmailProcessingEnabled: boolean;
  /** Whether the user has completed the onboarding wizard */
  onboardingCompleted: boolean;
  /** Whether the user has completed the guided tour */
  tourCompleted: boolean;
  /** User's notification delivery preferences per group */
  notificationPreferences: NotificationPreferences | null;
  /** Whether daily email digest is enabled */
  emailDigestEnabled: boolean;
  /** Time of day for email digest delivery (HH:mm format) */
  emailDigestTime: string;
  /** Email delivery mode: immediate or smart_grouped */
  emailDeliveryMode: EmailDeliveryMode;
  /** User's IANA timezone (e.g. 'Europe/Warsaw') */
  timezone: string;
  /** When the preferences record was created */
  createdAt: Date;
  /** When the preferences were last updated */
  updatedAt: Date;
}

/**
 * User preferences response DTO for API responses.
 * Dates are serialized as ISO strings for JSON transport.
 */
export interface UserPreferencesResponse {
  /** Database primary key */
  id: string;
  /** Clerk user ID */
  clerkId: string;
  /** User's email address */
  email: string;
  /** Whether Google Calendar sync is enabled for this user */
  googleCalendarEnabled: boolean;
  /** Whether AI email processing (Sufler) is enabled for this user */
  aiEmailProcessingEnabled: boolean;
  /** Whether the user has completed the onboarding wizard */
  onboardingCompleted: boolean;
  /** Whether the user has completed the guided tour */
  tourCompleted: boolean;
  /** User's notification delivery preferences per group */
  notificationPreferences: NotificationPreferences | null;
  /** Whether daily email digest is enabled */
  emailDigestEnabled: boolean;
  /** Time of day for email digest delivery (HH:mm format) */
  emailDigestTime: string;
  /** Email delivery mode: immediate or smart_grouped */
  emailDeliveryMode: EmailDeliveryMode;
  /** User's IANA timezone (e.g. 'Europe/Warsaw') */
  timezone: string;
  /** When the preferences record was created (ISO string) */
  createdAt: string;
  /** When the preferences were last updated (ISO string) */
  updatedAt: string;
}

/**
 * Input for updating user preferences.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateUserPreferencesInput {
  /** Enable or disable Google Calendar sync */
  googleCalendarEnabled?: boolean;
  /** Enable or disable AI email processing (Sufler) */
  aiEmailProcessingEnabled?: boolean;
  /** Mark onboarding wizard as completed */
  onboardingCompleted?: boolean;
  /** Mark guided tour as completed */
  tourCompleted?: boolean;
  /** Update notification delivery preferences */
  notificationPreferences?: NotificationPreferences | null;
  /** Enable or disable daily email digest */
  emailDigestEnabled?: boolean;
  /** Time of day for email digest delivery (HH:mm format) */
  emailDigestTime?: string;
  /** Email delivery mode: immediate or smart_grouped */
  emailDeliveryMode?: EmailDeliveryMode;
  /** User's IANA timezone (e.g. 'Europe/Warsaw') */
  timezone?: string;
}

/**
 * Information about Google Calendar integration status.
 * Used to display connection info to users.
 */
export interface GoogleCalendarInfo {
  /** Service account email that events will be shared with */
  serviceAccountEmail: string;
  /** Whether the integration is currently enabled for this user */
  enabled: boolean;
}
