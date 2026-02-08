/**
 * Tests for notification constants.
 */

import { describe, it, expect } from 'vitest';
import {
  NotificationType,
  NotificationPreferenceGroup,
} from '../../src/types/notification.types.js';
import {
  GROUP_NOTIFICATION_TYPES,
  DEFAULT_GROUP_PREFERENCE,
  DEFAULT_NOTIFICATION_PREFERENCES,
  ALL_NOTIFICATION_GROUPS,
  getGroupForNotificationType,
  getNotificationTypesForGroup,
} from '../../src/constants/notifications.js';

describe('Notification Constants', () => {
  describe('GROUP_NOTIFICATION_TYPES', () => {
    it('should have an entry for every preference group', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        expect(GROUP_NOTIFICATION_TYPES[group]).toBeDefined();
        expect(Array.isArray(GROUP_NOTIFICATION_TYPES[group])).toBe(true);
        expect(GROUP_NOTIFICATION_TYPES[group].length).toBeGreaterThan(0);
      }
    });

    it('should map EVENTS_SCHEDULING to correct types', () => {
      const types = GROUP_NOTIFICATION_TYPES[NotificationPreferenceGroup.EVENTS_SCHEDULING];
      expect(types).toContain(NotificationType.EVENT_PUBLISHED);
      expect(types).toContain(NotificationType.EVENT_CANCELLED);
      expect(types).toContain(NotificationType.EVENT_CONFLICT_WARNING);
    });

    it('should map ROLES_CASTING to correct types', () => {
      const types = GROUP_NOTIFICATION_TYPES[NotificationPreferenceGroup.ROLES_CASTING];
      expect(types).toContain(NotificationType.OPEN_ROLE_AVAILABLE);
      expect(types).toContain(NotificationType.OPEN_ROLE_ASSIGNED);
      expect(types).toContain(NotificationType.OPEN_ROLE_REMOVED);
    });

    it('should map ADMIN_RESPONSES to correct types', () => {
      const types = GROUP_NOTIFICATION_TYPES[NotificationPreferenceGroup.ADMIN_RESPONSES];
      expect(types).toContain(NotificationType.INVITATION_ACCEPTED);
      expect(types).toContain(NotificationType.INVITATION_DECLINED);
      expect(types).toContain(NotificationType.OPEN_ROLE_SIGNUP);
    });

    it('should map ADMIN_SYSTEM to correct types', () => {
      const types = GROUP_NOTIFICATION_TYPES[NotificationPreferenceGroup.ADMIN_SYSTEM];
      expect(types).toContain(NotificationType.HEALTHCHECK_ISSUES);
    });

    it('should include every notification type in exactly one group', () => {
      const allMappedTypes: NotificationType[] = [];
      for (const group of Object.values(NotificationPreferenceGroup)) {
        allMappedTypes.push(...GROUP_NOTIFICATION_TYPES[group]);
      }
      // Every notification type should appear
      for (const type of Object.values(NotificationType)) {
        expect(allMappedTypes).toContain(type);
      }
      // No duplicates
      expect(new Set(allMappedTypes).size).toBe(allMappedTypes.length);
    });
  });

  describe('DEFAULT_GROUP_PREFERENCE', () => {
    it('should have inApp enabled and email disabled', () => {
      expect(DEFAULT_GROUP_PREFERENCE.inApp).toBe(true);
      expect(DEFAULT_GROUP_PREFERENCE.email).toBe(false);
    });
  });

  describe('DEFAULT_NOTIFICATION_PREFERENCES', () => {
    it('should have an entry for every preference group', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        expect(DEFAULT_NOTIFICATION_PREFERENCES[group]).toBeDefined();
      }
    });

    it('should default all groups to inApp=true, email=false', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        expect(DEFAULT_NOTIFICATION_PREFERENCES[group].inApp).toBe(true);
        expect(DEFAULT_NOTIFICATION_PREFERENCES[group].email).toBe(false);
      }
    });
  });

  describe('ALL_NOTIFICATION_GROUPS', () => {
    it('should contain all preference groups', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        expect(ALL_NOTIFICATION_GROUPS).toContain(group);
      }
    });

    it('should have 4 groups', () => {
      expect(ALL_NOTIFICATION_GROUPS).toHaveLength(4);
    });
  });

  describe('getGroupForNotificationType', () => {
    it('should return correct group for event types', () => {
      expect(getGroupForNotificationType(NotificationType.EVENT_PUBLISHED)).toBe(
        NotificationPreferenceGroup.EVENTS_SCHEDULING
      );
      expect(getGroupForNotificationType(NotificationType.EVENT_CANCELLED)).toBe(
        NotificationPreferenceGroup.EVENTS_SCHEDULING
      );
    });

    it('should return correct group for role types', () => {
      expect(getGroupForNotificationType(NotificationType.OPEN_ROLE_AVAILABLE)).toBe(
        NotificationPreferenceGroup.ROLES_CASTING
      );
      expect(getGroupForNotificationType(NotificationType.OPEN_ROLE_ASSIGNED)).toBe(
        NotificationPreferenceGroup.ROLES_CASTING
      );
    });

    it('should return correct group for admin response types', () => {
      expect(getGroupForNotificationType(NotificationType.INVITATION_ACCEPTED)).toBe(
        NotificationPreferenceGroup.ADMIN_RESPONSES
      );
    });

    it('should return correct group for admin system types', () => {
      expect(getGroupForNotificationType(NotificationType.HEALTHCHECK_ISSUES)).toBe(
        NotificationPreferenceGroup.ADMIN_SYSTEM
      );
    });

    it('should return undefined for unknown type', () => {
      expect(getGroupForNotificationType('UNKNOWN' as NotificationType)).toBeUndefined();
    });
  });

  describe('getNotificationTypesForGroup', () => {
    it('should return types for each group', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        const types = getNotificationTypesForGroup(group);
        expect(types).toBe(GROUP_NOTIFICATION_TYPES[group]);
        expect(types.length).toBeGreaterThan(0);
      }
    });
  });
});
