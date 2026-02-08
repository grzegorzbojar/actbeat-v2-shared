/**
 * Tests for complex schemas: search, availability, bulk, orgEvent, openRole, notification, scheduler.
 */

import { describe, it, expect } from 'vitest';

// Search schemas
import {
  dateRangeSchema,
  searchPlayAvailabilitySchema,
  searchSceneAvailabilitySchema,
  searchPlaysSchema,
  searchScenesSchema,
  batchSearchSchema,
} from '../../src/schemas/search.schema.js';

// Availability schemas
import {
  userAvailabilityStatusSchema,
  blockingReasonSchema,
  checkUserAvailabilityQuerySchema,
  checkBulkAvailabilityBodySchema,
} from '../../src/schemas/availability.schema.js';

// Bulk schemas
import {
  bulkIdsSchema,
  bulkPublishSchema,
  bulkUpdateLocationSchema,
  bulkRespondSchema,
  bulkConfirmPrivateEventsSchema,
  bulkDeleteSchema,
} from '../../src/schemas/bulk.schema.js';

// OrgEvent schemas
import {
  orgEventCategorySchema,
  createOrgEventSchema,
  updateOrgEventSchema,
  listOrgEventsQuerySchema,
} from '../../src/schemas/orgEvent.schema.js';

// OpenRole schemas
import {
  createOpenRoleSchema,
  updateOpenRoleSchema,
  adminAssignUserSchema,
  openRoleParamsSchema,
  signupParamsSchema,
} from '../../src/schemas/openRole.schema.js';

// Notification schemas
import {
  notificationTypeSchema,
  notificationPreferenceGroupSchema,
  notificationGroupPreferenceSchema,
  notificationPreferencesSchema,
  notificationQuerySchema,
  markNotificationsReadSchema,
} from '../../src/schemas/notification.schema.js';

// Scheduler schemas
import {
  schedulerParamsSchema,
  schedulerDayDetailParamsSchema,
} from '../../src/schemas/scheduler.schema.js';

import { NotificationType, NotificationPreferenceGroup } from '../../src/types/notification.types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

const validDateRange = {
  start: now.toISOString(),
  end: oneHourLater.toISOString(),
};

// =========================================================================
// Search Schemas
// =========================================================================
describe('Search Schemas', () => {
  describe('dateRangeSchema', () => {
    it('should accept valid date range', () => {
      const result = dateRangeSchema.parse(validDateRange);
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should reject end before start', () => {
      const result = dateRangeSchema.safeParse({
        start: oneHourLater.toISOString(),
        end: now.toISOString(),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('End date must be after start date');
        expect(result.error.issues[0].path).toContain('end');
      }
    });

    it('should reject equal start and end', () => {
      const result = dateRangeSchema.safeParse({
        start: now.toISOString(),
        end: now.toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it('should coerce string dates', () => {
      const result = dateRangeSchema.parse({
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-02T00:00:00Z',
      });
      expect(result.start).toBeInstanceOf(Date);
    });
  });

  describe('searchPlayAvailabilitySchema', () => {
    const validInput = { playId: 'play-001', dateRange: validDateRange };

    it('should accept valid input with defaults', () => {
      const result = searchPlayAvailabilitySchema.parse(validInput);
      expect(result.playId).toBe('play-001');
      expect(result.minDuration).toBe(60);
      expect(result.allowMultipleRoles).toBe(false);
      expect(result.excludeUserIds).toEqual([]);
    });

    it('should reject empty playId', () => {
      expect(() =>
        searchPlayAvailabilitySchema.parse({ ...validInput, playId: '' })
      ).toThrow('Play ID is required');
    });

    it('should reject minDuration of 0', () => {
      expect(() =>
        searchPlayAvailabilitySchema.parse({ ...validInput, minDuration: 0 })
      ).toThrow();
    });

    it('should reject minDuration above 1440', () => {
      expect(() =>
        searchPlayAvailabilitySchema.parse({ ...validInput, minDuration: 1441 })
      ).toThrow();
    });

    it('should accept optional characterIds', () => {
      const result = searchPlayAvailabilitySchema.parse({
        ...validInput,
        characterIds: ['char-001'],
      });
      expect(result.characterIds).toEqual(['char-001']);
    });
  });

  describe('searchSceneAvailabilitySchema', () => {
    const validInput = { sceneId: 'scene-001', dateRange: validDateRange };

    it('should accept valid input', () => {
      const result = searchSceneAvailabilitySchema.parse(validInput);
      expect(result.sceneId).toBe('scene-001');
      expect(result.minDuration).toBe(60);
    });

    it('should reject empty sceneId', () => {
      expect(() =>
        searchSceneAvailabilitySchema.parse({ ...validInput, sceneId: '' })
      ).toThrow('Scene ID is required');
    });
  });

  describe('searchPlaysSchema', () => {
    it('should accept valid input', () => {
      const result = searchPlaysSchema.parse({
        orgId: 'org-001',
        dateRange: validDateRange,
      });
      expect(result.orgId).toBe('org-001');
      expect(result.minDuration).toBe(60);
    });

    it('should reject empty orgId', () => {
      expect(() =>
        searchPlaysSchema.parse({ orgId: '', dateRange: validDateRange })
      ).toThrow('Organization ID is required');
    });
  });

  describe('searchScenesSchema', () => {
    it('should accept valid input', () => {
      const result = searchScenesSchema.parse({
        playId: 'play-001',
        dateRange: validDateRange,
      });
      expect(result.playId).toBe('play-001');
    });
  });

  describe('batchSearchSchema', () => {
    it('should accept valid input', () => {
      const result = batchSearchSchema.parse({
        sceneIds: ['scene-001'],
        dateRange: validDateRange,
      });
      expect(result.sceneIds).toEqual(['scene-001']);
      expect(result.minDuration).toBe(60);
      expect(result.allowMultipleRoles).toBe(false);
    });

    it('should reject empty sceneIds', () => {
      expect(() =>
        batchSearchSchema.parse({ sceneIds: [], dateRange: validDateRange })
      ).toThrow('At least one scene ID is required');
    });

    it('should reject more than 50 sceneIds', () => {
      const sceneIds = Array.from({ length: 51 }, (_, i) => `scene-${i}`);
      expect(() =>
        batchSearchSchema.parse({ sceneIds, dateRange: validDateRange })
      ).toThrow('Maximum 50 scenes per batch');
    });
  });
});

// =========================================================================
// Availability Schemas
// =========================================================================
describe('Availability Schemas', () => {
  describe('userAvailabilityStatusSchema', () => {
    it('should accept valid statuses', () => {
      for (const status of ['FREE', 'TENTATIVE', 'BUSY', 'PARTIAL']) {
        expect(userAvailabilityStatusSchema.parse(status)).toBe(status);
      }
    });

    it('should reject invalid status', () => {
      expect(() => userAvailabilityStatusSchema.parse('UNKNOWN')).toThrow();
    });
  });

  describe('blockingReasonSchema', () => {
    it('should accept valid reasons', () => {
      const valid = [
        'PRIVATE_EVENT_CONFIRMED',
        'PRIVATE_EVENT_TENTATIVE',
        'ORG_EVENT_ACCEPTED',
        'ORG_EVENT_PENDING',
        'ORG_EVENT_DRAFT',
      ];
      for (const reason of valid) {
        expect(blockingReasonSchema.parse(reason)).toBe(reason);
      }
    });

    it('should reject invalid reason', () => {
      expect(() => blockingReasonSchema.parse('OTHER')).toThrow();
    });
  });

  describe('checkUserAvailabilityQuerySchema', () => {
    const validQuery = {
      start: now.toISOString(),
      end: oneHourLater.toISOString(),
    };

    it('should accept valid query with defaults', () => {
      const result = checkUserAvailabilityQuerySchema.parse(validQuery);
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
      expect(result.includeEventDetails).toBe(false);
      expect(result.minBlockDuration).toBe(15);
    });

    it('should transform includeEventDetails string to boolean', () => {
      const result = checkUserAvailabilityQuerySchema.parse({
        ...validQuery,
        includeEventDetails: 'true',
      });
      expect(result.includeEventDetails).toBe(true);
    });

    it('should transform non-true string to false', () => {
      const result = checkUserAvailabilityQuerySchema.parse({
        ...validQuery,
        includeEventDetails: 'false',
      });
      expect(result.includeEventDetails).toBe(false);
    });

    it('should clamp minBlockDuration to max 480', () => {
      const result = checkUserAvailabilityQuerySchema.parse({
        ...validQuery,
        minBlockDuration: '999',
      });
      expect(result.minBlockDuration).toBe(480);
    });

    it('should default minBlockDuration for invalid string', () => {
      const result = checkUserAvailabilityQuerySchema.parse({
        ...validQuery,
        minBlockDuration: 'abc',
      });
      expect(result.minBlockDuration).toBe(15);
    });

    it('should reject end before start', () => {
      const result = checkUserAvailabilityQuerySchema.safeParse({
        start: oneHourLater.toISOString(),
        end: now.toISOString(),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('checkBulkAvailabilityBodySchema', () => {
    const validBody = {
      userIds: ['user-001'],
      start: now.toISOString(),
      end: oneHourLater.toISOString(),
    };

    it('should accept valid body with defaults', () => {
      const result = checkBulkAvailabilityBodySchema.parse(validBody);
      expect(result.userIds).toEqual(['user-001']);
      expect(result.includeEventDetails).toBe(false);
      expect(result.minBlockDuration).toBe(15);
    });

    it('should reject empty userIds', () => {
      expect(() =>
        checkBulkAvailabilityBodySchema.parse({ ...validBody, userIds: [] })
      ).toThrow('At least one user ID is required');
    });

    it('should reject more than 50 userIds', () => {
      const userIds = Array.from({ length: 51 }, (_, i) => `user-${i}`);
      expect(() =>
        checkBulkAvailabilityBodySchema.parse({ ...validBody, userIds })
      ).toThrow('Maximum 50 users per request');
    });

    it('should reject empty string in userIds', () => {
      expect(() =>
        checkBulkAvailabilityBodySchema.parse({ ...validBody, userIds: [''] })
      ).toThrow();
    });

    it('should reject end before start', () => {
      const result = checkBulkAvailabilityBodySchema.safeParse({
        ...validBody,
        start: oneHourLater.toISOString(),
        end: now.toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it('should reject minBlockDuration above 480', () => {
      expect(() =>
        checkBulkAvailabilityBodySchema.parse({
          ...validBody,
          minBlockDuration: 481,
        })
      ).toThrow();
    });
  });
});

// =========================================================================
// Bulk Schemas
// =========================================================================
describe('Bulk Schemas', () => {
  describe('bulkIdsSchema', () => {
    it('should accept valid ids', () => {
      const result = bulkIdsSchema.parse({ ids: ['id-001', 'id-002'] });
      expect(result.ids).toHaveLength(2);
    });

    it('should reject empty ids array', () => {
      expect(() => bulkIdsSchema.parse({ ids: [] })).toThrow();
    });

    it('should reject empty string in ids', () => {
      expect(() => bulkIdsSchema.parse({ ids: [''] })).toThrow();
    });
  });

  describe('bulkPublishSchema', () => {
    it('should accept valid input with defaults', () => {
      const result = bulkPublishSchema.parse({ ids: ['id-001'] });
      expect(result.skipHealthcheck).toBe(false);
      expect(result.adminNotes).toBeUndefined();
    });

    it('should accept all fields', () => {
      const result = bulkPublishSchema.parse({
        ids: ['id-001'],
        skipHealthcheck: true,
        adminNotes: 'Force publish',
      });
      expect(result.skipHealthcheck).toBe(true);
      expect(result.adminNotes).toBe('Force publish');
    });
  });

  describe('bulkUpdateLocationSchema', () => {
    it('should accept valid input', () => {
      const result = bulkUpdateLocationSchema.parse({
        ids: ['id-001'],
        locationId: 'loc-001',
      });
      expect(result.locationId).toBe('loc-001');
    });

    it('should reject empty locationId', () => {
      expect(() =>
        bulkUpdateLocationSchema.parse({ ids: ['id-001'], locationId: '' })
      ).toThrow();
    });
  });

  describe('bulkRespondSchema', () => {
    it('should accept ACCEPTED status', () => {
      const result = bulkRespondSchema.parse({
        ids: ['id-001'],
        status: 'ACCEPTED',
      });
      expect(result.status).toBe('ACCEPTED');
    });

    it('should accept DECLINED status', () => {
      const result = bulkRespondSchema.parse({
        ids: ['id-001'],
        status: 'DECLINED',
      });
      expect(result.status).toBe('DECLINED');
    });

    it('should reject PENDING status', () => {
      const result = bulkRespondSchema.safeParse({
        ids: ['id-001'],
        status: 'PENDING',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Status must be ACCEPTED or DECLINED');
      }
    });
  });

  describe('bulkConfirmPrivateEventsSchema', () => {
    it('should accept valid ids', () => {
      const result = bulkConfirmPrivateEventsSchema.parse({ ids: ['id-001'] });
      expect(result.ids).toEqual(['id-001']);
    });
  });

  describe('bulkDeleteSchema', () => {
    it('should accept valid ids', () => {
      const result = bulkDeleteSchema.parse({ ids: ['id-001', 'id-002'] });
      expect(result.ids).toHaveLength(2);
    });
  });
});

// =========================================================================
// OrgEvent Schemas
// =========================================================================
describe('OrgEvent Schemas', () => {
  describe('orgEventCategorySchema', () => {
    it('should accept PLAY, REHEARSAL, TRIAL, TECHNICAL, OTHER', () => {
      for (const cat of ['PLAY', 'REHEARSAL', 'TRIAL', 'TECHNICAL', 'OTHER']) {
        expect(orgEventCategorySchema.parse(cat)).toBe(cat);
      }
    });

    it('should reject PRIVATE', () => {
      expect(() => orgEventCategorySchema.parse('PRIVATE')).toThrow();
    });
  });

  describe('createOrgEventSchema', () => {
    const validInput = {
      title: 'Team Meeting',
      category: 'OTHER' as const,
      startDate: now.toISOString(),
      endDate: oneHourLater.toISOString(),
    };

    it('should accept valid input with defaults', () => {
      const result = createOrgEventSchema.parse(validInput);
      expect(result.title).toBe('Team Meeting');
      expect(result.status).toBe('DRAFT');
      expect(result.tagIds).toEqual([]);
    });

    it('should reject endDate before startDate', () => {
      const result = createOrgEventSchema.safeParse({
        ...validInput,
        startDate: oneHourLater.toISOString(),
        endDate: now.toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it('should require playId for PLAY category', () => {
      const result = createOrgEventSchema.safeParse({
        ...validInput,
        category: 'PLAY',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.message === 'playId is required for PLAY and REHEARSAL events'
        );
        expect(issue).toBeDefined();
      }
    });

    it('should require playId for REHEARSAL category', () => {
      const result = createOrgEventSchema.safeParse({
        ...validInput,
        category: 'REHEARSAL',
      });
      expect(result.success).toBe(false);
    });

    it('should accept PLAY category with playId', () => {
      const result = createOrgEventSchema.parse({
        ...validInput,
        category: 'PLAY',
        playId: 'play-001',
      });
      expect(result.playId).toBe('play-001');
    });

    it('should not require playId for OTHER category', () => {
      const result = createOrgEventSchema.parse(validInput);
      expect(result.playId).toBeUndefined();
    });

    it('should not require playId for TRIAL category', () => {
      const result = createOrgEventSchema.parse({
        ...validInput,
        category: 'TRIAL',
      });
      expect(result.category).toBe('TRIAL');
    });

    it('should reject empty title', () => {
      expect(() =>
        createOrgEventSchema.parse({ ...validInput, title: '' })
      ).toThrow();
    });
  });

  describe('updateOrgEventSchema', () => {
    it('should accept empty object', () => {
      const result = updateOrgEventSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept partial updates', () => {
      const result = updateOrgEventSchema.parse({ title: 'Updated Title' });
      expect(result.title).toBe('Updated Title');
    });

    it('should reject endDate before startDate when both provided', () => {
      const result = updateOrgEventSchema.safeParse({
        startDate: oneHourLater.toISOString(),
        endDate: now.toISOString(),
      });
      expect(result.success).toBe(false);
    });

    it('should accept single date without the other', () => {
      const result = updateOrgEventSchema.parse({
        startDate: now.toISOString(),
      });
      expect(result.startDate).toBeInstanceOf(Date);
    });
  });

  describe('listOrgEventsQuerySchema', () => {
    it('should apply defaults', () => {
      const result = listOrgEventsQuerySchema.parse({});
      expect(result.includeParticipants).toBe(false);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(50);
    });

    it('should coerce string values', () => {
      const result = listOrgEventsQuerySchema.parse({
        page: '3',
        pageSize: '100',
        includeParticipants: 'true',
      });
      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(100);
      expect(result.includeParticipants).toBe(true);
    });

    it('should reject pageSize above 200', () => {
      expect(() =>
        listOrgEventsQuerySchema.parse({ pageSize: 201 })
      ).toThrow();
    });

    it('should reject search longer than 100 chars', () => {
      expect(() =>
        listOrgEventsQuerySchema.parse({ search: 'a'.repeat(101) })
      ).toThrow();
    });

    it('should accept all optional filters', () => {
      const result = listOrgEventsQuerySchema.parse({
        category: 'PLAY',
        status: 'DRAFT',
        playId: 'play-001',
        locationId: 'loc-001',
        startAfter: '2024-01-01',
        endBefore: '2024-12-31',
      });
      expect(result.category).toBe('PLAY');
      expect(result.status).toBe('DRAFT');
    });
  });
});

// =========================================================================
// OpenRole Schemas
// =========================================================================
describe('OpenRole Schemas', () => {
  describe('createOpenRoleSchema', () => {
    const validInput = {
      roleName: 'Sound Technician',
      requiredTagIds: ['tag-001'],
    };

    it('should accept valid input with default slotsNeeded', () => {
      const result = createOpenRoleSchema.parse(validInput);
      expect(result.roleName).toBe('Sound Technician');
      expect(result.slotsNeeded).toBe(1);
      expect(result.requiredTagIds).toEqual(['tag-001']);
    });

    it('should reject empty roleName', () => {
      expect(() =>
        createOpenRoleSchema.parse({ ...validInput, roleName: '' })
      ).toThrow('Role name is required');
    });

    it('should reject roleName longer than 100 chars', () => {
      expect(() =>
        createOpenRoleSchema.parse({ ...validInput, roleName: 'a'.repeat(101) })
      ).toThrow('Role name must be 100 characters or less');
    });

    it('should reject empty requiredTagIds', () => {
      expect(() =>
        createOpenRoleSchema.parse({ ...validInput, requiredTagIds: [] })
      ).toThrow('At least one required tag is needed');
    });

    it('should reject slotsNeeded above 99', () => {
      expect(() =>
        createOpenRoleSchema.parse({ ...validInput, slotsNeeded: 100 })
      ).toThrow();
    });

    it('should reject slotsNeeded of 0', () => {
      expect(() =>
        createOpenRoleSchema.parse({ ...validInput, slotsNeeded: 0 })
      ).toThrow();
    });
  });

  describe('updateOpenRoleSchema', () => {
    it('should accept empty object', () => {
      const result = updateOpenRoleSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept partial updates', () => {
      const result = updateOpenRoleSchema.parse({
        roleName: 'Light Tech',
        slotsNeeded: 2,
      });
      expect(result.roleName).toBe('Light Tech');
      expect(result.slotsNeeded).toBe(2);
    });

    it('should reject empty requiredTagIds when provided', () => {
      expect(() =>
        updateOpenRoleSchema.parse({ requiredTagIds: [] })
      ).toThrow();
    });
  });

  describe('adminAssignUserSchema', () => {
    it('should accept valid userId', () => {
      const result = adminAssignUserSchema.parse({ userId: 'user-001' });
      expect(result.userId).toBe('user-001');
    });

    it('should reject empty userId', () => {
      expect(() => adminAssignUserSchema.parse({ userId: '' })).toThrow('User ID is required');
    });
  });

  describe('openRoleParamsSchema', () => {
    it('should accept valid params', () => {
      const result = openRoleParamsSchema.parse({
        eventId: 'evt-001',
        roleId: 'role-001',
      });
      expect(result.eventId).toBe('evt-001');
      expect(result.roleId).toBe('role-001');
    });

    it('should reject empty eventId', () => {
      expect(() =>
        openRoleParamsSchema.parse({ eventId: '', roleId: 'role-001' })
      ).toThrow();
    });

    it('should reject empty roleId', () => {
      expect(() =>
        openRoleParamsSchema.parse({ eventId: 'evt-001', roleId: '' })
      ).toThrow();
    });
  });

  describe('signupParamsSchema', () => {
    it('should accept valid params', () => {
      const result = signupParamsSchema.parse({
        eventId: 'evt-001',
        roleId: 'role-001',
        signupId: 'signup-001',
      });
      expect(result.signupId).toBe('signup-001');
    });

    it('should reject empty signupId', () => {
      expect(() =>
        signupParamsSchema.parse({
          eventId: 'evt-001',
          roleId: 'role-001',
          signupId: '',
        })
      ).toThrow();
    });
  });
});

// =========================================================================
// Notification Schemas
// =========================================================================
describe('Notification Schemas', () => {
  describe('notificationTypeSchema', () => {
    it('should accept all NotificationType values', () => {
      for (const type of Object.values(NotificationType)) {
        expect(notificationTypeSchema.parse(type)).toBe(type);
      }
    });

    it('should reject invalid type', () => {
      expect(() => notificationTypeSchema.parse('INVALID')).toThrow();
    });
  });

  describe('notificationPreferenceGroupSchema', () => {
    it('should accept all groups', () => {
      for (const group of Object.values(NotificationPreferenceGroup)) {
        expect(notificationPreferenceGroupSchema.parse(group)).toBe(group);
      }
    });

    it('should reject invalid group', () => {
      expect(() => notificationPreferenceGroupSchema.parse('INVALID')).toThrow();
    });
  });

  describe('notificationGroupPreferenceSchema', () => {
    it('should accept valid preferences', () => {
      const result = notificationGroupPreferenceSchema.parse({
        inApp: true,
        email: false,
      });
      expect(result.inApp).toBe(true);
      expect(result.email).toBe(false);
    });

    it('should reject missing fields', () => {
      expect(() =>
        notificationGroupPreferenceSchema.parse({ inApp: true })
      ).toThrow();
    });

    it('should reject non-boolean values', () => {
      expect(() =>
        notificationGroupPreferenceSchema.parse({ inApp: 'yes', email: false })
      ).toThrow();
    });
  });

  describe('notificationPreferencesSchema', () => {
    const validPrefs = {
      EVENTS_SCHEDULING: { inApp: true, email: false },
      ROLES_CASTING: { inApp: true, email: true },
      ADMIN_RESPONSES: { inApp: false, email: false },
      ADMIN_SYSTEM: { inApp: true, email: false },
    };

    it('should accept valid full preferences', () => {
      const result = notificationPreferencesSchema.parse(validPrefs);
      expect(result.EVENTS_SCHEDULING.inApp).toBe(true);
      expect(result.ADMIN_SYSTEM.email).toBe(false);
    });

    it('should reject missing group', () => {
      const { ADMIN_SYSTEM, ...incomplete } = validPrefs;
      expect(() => notificationPreferencesSchema.parse(incomplete)).toThrow();
    });
  });

  describe('notificationQuerySchema', () => {
    it('should apply defaults', () => {
      const result = notificationQuerySchema.parse({});
      expect(result.limit).toBe(20);
    });

    it('should coerce limit from string', () => {
      const result = notificationQuerySchema.parse({ limit: '50' });
      expect(result.limit).toBe(50);
    });

    it('should reject limit above 100', () => {
      expect(() => notificationQuerySchema.parse({ limit: 101 })).toThrow();
    });

    it('should reject limit below 1', () => {
      expect(() => notificationQuerySchema.parse({ limit: 0 })).toThrow();
    });

    it('should transform unreadOnly string to boolean', () => {
      const result = notificationQuerySchema.parse({ unreadOnly: 'true' });
      expect(result.unreadOnly).toBe(true);
    });

    it('should transform non-true unreadOnly to false', () => {
      const result = notificationQuerySchema.parse({ unreadOnly: 'false' });
      expect(result.unreadOnly).toBe(false);
    });

    it('should accept optional filters', () => {
      const result = notificationQuerySchema.parse({
        cursor: 'abc-123',
        type: NotificationType.EVENT_PUBLISHED,
        orgId: 'org-001',
      });
      expect(result.cursor).toBe('abc-123');
      expect(result.type).toBe('EVENT_PUBLISHED');
    });
  });

  describe('markNotificationsReadSchema', () => {
    it('should accept empty object (mark all)', () => {
      const result = markNotificationsReadSchema.parse({});
      expect(result.notificationIds).toBeUndefined();
    });

    it('should accept specific notification IDs', () => {
      const result = markNotificationsReadSchema.parse({
        notificationIds: ['uuid-1', 'uuid-2'],
      });
      expect(result.notificationIds).toEqual(['uuid-1', 'uuid-2']);
    });
  });
});

// =========================================================================
// Scheduler Schemas
// =========================================================================
describe('Scheduler Schemas', () => {
  describe('schedulerParamsSchema', () => {
    const validInput = {
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      dailyStartTime: '09:00',
      dailyEndTime: '17:00',
    };

    it('should accept valid input', () => {
      const result = schedulerParamsSchema.parse(validInput);
      expect(result.startDate).toBe('2024-06-01');
      expect(result.dailyStartTime).toBe('09:00');
    });

    it('should accept optional playIds', () => {
      const result = schedulerParamsSchema.parse({
        ...validInput,
        playIds: ['play-001'],
      });
      expect(result.playIds).toEqual(['play-001']);
    });

    it('should reject invalid startDate format', () => {
      expect(() =>
        schedulerParamsSchema.parse({ ...validInput, startDate: '01/06/2024' })
      ).toThrow('Start date must be in YYYY-MM-DD format');
    });

    it('should reject invalid endDate format', () => {
      expect(() =>
        schedulerParamsSchema.parse({ ...validInput, endDate: '2024-6-7' })
      ).toThrow('End date must be in YYYY-MM-DD format');
    });

    it('should reject invalid time format', () => {
      expect(() =>
        schedulerParamsSchema.parse({ ...validInput, dailyStartTime: '9:00' })
      ).toThrow('Start time must be in HH:mm format (00:00 - 23:59)');
    });

    it('should reject time with hours > 23', () => {
      expect(() =>
        schedulerParamsSchema.parse({ ...validInput, dailyStartTime: '25:00' })
      ).toThrow();
    });

    it('should reject startDate after endDate', () => {
      const result = schedulerParamsSchema.safeParse({
        ...validInput,
        startDate: '2024-06-10',
        endDate: '2024-06-01',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Start date must be on or before end date'
        );
      }
    });

    it('should accept same startDate and endDate', () => {
      const result = schedulerParamsSchema.parse({
        ...validInput,
        startDate: '2024-06-01',
        endDate: '2024-06-01',
      });
      expect(result.startDate).toBe('2024-06-01');
    });

    it('should reject date range exceeding 366 days', () => {
      const result = schedulerParamsSchema.safeParse({
        ...validInput,
        startDate: '2024-01-01',
        endDate: '2025-01-03',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.message.includes('366 days')
        );
        expect(issue).toBeDefined();
      }
    });

    it('should reject dailyStartTime >= dailyEndTime', () => {
      const result = schedulerParamsSchema.safeParse({
        ...validInput,
        dailyStartTime: '17:00',
        dailyEndTime: '09:00',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Daily start time must be before daily end time'
        );
      }
    });

    it('should reject equal dailyStartTime and dailyEndTime', () => {
      const result = schedulerParamsSchema.safeParse({
        ...validInput,
        dailyStartTime: '10:00',
        dailyEndTime: '10:00',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty playId in playIds array', () => {
      expect(() =>
        schedulerParamsSchema.parse({ ...validInput, playIds: [''] })
      ).toThrow('Play ID must not be empty');
    });
  });

  describe('schedulerDayDetailParamsSchema', () => {
    const validInput = {
      date: '2024-06-01',
      startTime: '09:00',
      endTime: '17:00',
    };

    it('should accept valid input', () => {
      const result = schedulerDayDetailParamsSchema.parse(validInput);
      expect(result.date).toBe('2024-06-01');
      expect(result.startTime).toBe('09:00');
      expect(result.endTime).toBe('17:00');
    });

    it('should accept optional playId', () => {
      const result = schedulerDayDetailParamsSchema.parse({
        ...validInput,
        playId: 'play-001',
      });
      expect(result.playId).toBe('play-001');
    });

    it('should reject invalid date format', () => {
      expect(() =>
        schedulerDayDetailParamsSchema.parse({ ...validInput, date: '06/01/2024' })
      ).toThrow('Date must be in YYYY-MM-DD format');
    });

    it('should reject startTime >= endTime', () => {
      const result = schedulerDayDetailParamsSchema.safeParse({
        ...validInput,
        startTime: '18:00',
        endTime: '09:00',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Start time must be before end time'
        );
      }
    });

    it('should reject empty playId', () => {
      expect(() =>
        schedulerDayDetailParamsSchema.parse({ ...validInput, playId: '' })
      ).toThrow('Play ID must not be empty');
    });
  });
});
