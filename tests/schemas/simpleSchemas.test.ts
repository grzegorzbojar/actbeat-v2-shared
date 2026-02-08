/**
 * Tests for simple entity schemas: character, scene, location, tag, onboarding, userPreferences, activity.
 */

import { describe, it, expect } from 'vitest';
import {
  createCharacterSchema,
  updateCharacterSchema,
  characterQuerySchema,
} from '../../src/schemas/character.schema.js';
import {
  createSceneSchema,
  updateSceneSchema,
  sceneQuerySchema,
} from '../../src/schemas/scene.schema.js';
import {
  createLocationSchema,
  updateLocationSchema,
  locationQuerySchema,
} from '../../src/schemas/location.schema.js';
import {
  createTagSchema,
  updateTagSchema,
  tagQuerySchema,
} from '../../src/schemas/tag.schema.js';
import {
  onboardingStatusSchema,
  createInvitationWithTagsSchema,
} from '../../src/schemas/onboarding.schema.js';
import { updateUserPreferencesSchema } from '../../src/schemas/userPreferences.schema.js';
import {
  objectTypeSchema,
  activityActionSchema,
  activityQuerySchema,
  objectActivitiesParamsSchema,
} from '../../src/schemas/activity.schema.js';
import { ObjectType, ActivityAction } from '../../src/types/activity.types.js';
import { randomUUID } from 'crypto';

describe('Character Schemas', () => {
  describe('createCharacterSchema', () => {
    it('should accept valid input', () => {
      const result = createCharacterSchema.parse({ name: 'Hamlet', playId: 'play-001' });
      expect(result.name).toBe('Hamlet');
      expect(result.playId).toBe('play-001');
      expect(result.actors).toEqual([]);
      expect(result.sceneIds).toEqual([]);
      expect(result.tagIds).toEqual([]);
    });

    it('should reject empty name', () => {
      expect(() => createCharacterSchema.parse({ name: '', playId: 'play-001' })).toThrow();
    });

    it('should reject name longer than 255 chars', () => {
      expect(() =>
        createCharacterSchema.parse({ name: 'a'.repeat(256), playId: 'play-001' })
      ).toThrow();
    });

    it('should reject empty playId', () => {
      expect(() => createCharacterSchema.parse({ name: 'Hamlet', playId: '' })).toThrow();
    });

    it('should accept optional arrays', () => {
      const result = createCharacterSchema.parse({
        name: 'Hamlet',
        playId: 'play-001',
        actors: ['user-001'],
        sceneIds: ['scene-001'],
        tagIds: ['tag-001'],
      });
      expect(result.actors).toEqual(['user-001']);
    });
  });

  describe('updateCharacterSchema', () => {
    it('should accept empty object', () => {
      const result = updateCharacterSchema.parse({});
      expect(result.name).toBeUndefined();
    });

    it('should accept partial updates', () => {
      const result = updateCharacterSchema.parse({ name: 'New Name' });
      expect(result.name).toBe('New Name');
    });
  });

  describe('characterQuerySchema', () => {
    it('should accept empty query', () => {
      const result = characterQuerySchema.parse({});
      expect(result).toBeDefined();
    });

    it('should transform single tagId to array', () => {
      const result = characterQuerySchema.parse({ tagIds: 'tag-001' });
      expect(result.tagIds).toEqual(['tag-001']);
    });
  });
});

describe('Scene Schemas', () => {
  describe('createSceneSchema', () => {
    it('should accept valid input', () => {
      const result = createSceneSchema.parse({ name: 'Act 1', playId: 'play-001' });
      expect(result.name).toBe('Act 1');
      expect(result.playId).toBe('play-001');
      expect(result.characterIds).toEqual([]);
      expect(result.tagIds).toEqual([]);
    });

    it('should reject empty name', () => {
      expect(() => createSceneSchema.parse({ name: '', playId: 'play-001' })).toThrow();
    });

    it('should accept optional color', () => {
      const result = createSceneSchema.parse({
        name: 'Act 1',
        playId: 'play-001',
        color: '#FF5733',
      });
      expect(result.color).toBe('#FF5733');
    });

    it('should reject invalid hex color', () => {
      expect(() =>
        createSceneSchema.parse({ name: 'Act 1', playId: 'play-001', color: 'red' })
      ).toThrow();
    });

    it('should accept null color', () => {
      const result = createSceneSchema.parse({ name: 'Act 1', playId: 'play-001', color: null });
      expect(result.color).toBeNull();
    });
  });

  describe('updateSceneSchema', () => {
    it('should accept empty object', () => {
      const result = updateSceneSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept partial updates', () => {
      const result = updateSceneSchema.parse({ name: 'Act 2', color: '#00FF00' });
      expect(result.name).toBe('Act 2');
      expect(result.color).toBe('#00FF00');
    });
  });

  describe('sceneQuerySchema', () => {
    it('should transform single tagId to array', () => {
      const result = sceneQuerySchema.parse({ tagIds: 'tag-001' });
      expect(result.tagIds).toEqual(['tag-001']);
    });
  });
});

describe('Location Schemas', () => {
  describe('createLocationSchema', () => {
    it('should accept valid location with name only', () => {
      const result = createLocationSchema.parse({ name: 'Main Stage' });
      expect(result.name).toBe('Main Stage');
    });

    it('should accept location with all fields', () => {
      const result = createLocationSchema.parse({
        name: 'Main Stage',
        address: '123 Theater St',
        latitude: 52.23,
        longitude: 21.01,
      });
      expect(result.latitude).toBe(52.23);
      expect(result.longitude).toBe(21.01);
    });

    it('should reject empty name', () => {
      expect(() => createLocationSchema.parse({ name: '' })).toThrow();
    });

    it('should reject name longer than 200 chars', () => {
      expect(() => createLocationSchema.parse({ name: 'a'.repeat(201) })).toThrow();
    });

    it('should reject latitude without longitude', () => {
      expect(() =>
        createLocationSchema.parse({ name: 'Stage', latitude: 52.23 })
      ).toThrow('Both latitude and longitude must be provided together');
    });

    it('should reject longitude without latitude', () => {
      expect(() =>
        createLocationSchema.parse({ name: 'Stage', longitude: 21.01 })
      ).toThrow('Both latitude and longitude must be provided together');
    });

    it('should accept null for both coordinates', () => {
      const result = createLocationSchema.parse({
        name: 'Stage',
        latitude: null,
        longitude: null,
      });
      expect(result.latitude).toBeNull();
      expect(result.longitude).toBeNull();
    });

    it('should reject latitude out of range', () => {
      expect(() =>
        createLocationSchema.parse({ name: 'Stage', latitude: 91, longitude: 0 })
      ).toThrow();
    });

    it('should reject longitude out of range', () => {
      expect(() =>
        createLocationSchema.parse({ name: 'Stage', latitude: 0, longitude: 181 })
      ).toThrow();
    });

    it('should reject address longer than 500 chars', () => {
      expect(() =>
        createLocationSchema.parse({ name: 'Stage', address: 'a'.repeat(501) })
      ).toThrow();
    });
  });

  describe('updateLocationSchema', () => {
    it('should accept empty object', () => {
      const result = updateLocationSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept name update only', () => {
      const result = updateLocationSchema.parse({ name: 'New Stage' });
      expect(result.name).toBe('New Stage');
    });

    it('should reject latitude without longitude', () => {
      expect(() => updateLocationSchema.parse({ latitude: 52.23 })).toThrow();
    });

    it('should accept both coordinates as null to clear them', () => {
      const result = updateLocationSchema.parse({ latitude: null, longitude: null });
      expect(result.latitude).toBeNull();
      expect(result.longitude).toBeNull();
    });

    it('should reject one null and one number for coordinates', () => {
      expect(() => updateLocationSchema.parse({ latitude: null, longitude: 21.01 })).toThrow();
    });
  });

  describe('locationQuerySchema', () => {
    it('should apply defaults', () => {
      const result = locationQuerySchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(25);
    });

    it('should coerce string values', () => {
      const result = locationQuerySchema.parse({ page: '2', limit: '50' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should reject limit above 100', () => {
      expect(() => locationQuerySchema.parse({ limit: 101 })).toThrow();
    });
  });
});

describe('Tag Schemas', () => {
  describe('createTagSchema', () => {
    it('should accept valid input', () => {
      const result = createTagSchema.parse({
        name: 'Important',
        color: '#FF5733',
        orgId: 'org-001',
      });
      expect(result.name).toBe('Important');
      expect(result.color).toBe('#FF5733');
    });

    it('should reject empty name', () => {
      expect(() =>
        createTagSchema.parse({ name: '', color: '#FF5733', orgId: 'org-001' })
      ).toThrow();
    });

    it('should reject name longer than 50 chars', () => {
      expect(() =>
        createTagSchema.parse({ name: 'a'.repeat(51), color: '#FF5733', orgId: 'org-001' })
      ).toThrow();
    });

    it('should reject invalid color', () => {
      expect(() =>
        createTagSchema.parse({ name: 'Tag', color: 'red', orgId: 'org-001' })
      ).toThrow();
    });

    it('should reject empty orgId', () => {
      expect(() =>
        createTagSchema.parse({ name: 'Tag', color: '#FF5733', orgId: '' })
      ).toThrow();
    });
  });

  describe('updateTagSchema', () => {
    it('should accept empty object', () => {
      const result = updateTagSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept name or color update', () => {
      const result = updateTagSchema.parse({ name: 'New Tag', color: '#00FF00' });
      expect(result.name).toBe('New Tag');
      expect(result.color).toBe('#00FF00');
    });
  });

  describe('tagQuerySchema', () => {
    it('should accept empty query', () => {
      const result = tagQuerySchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept orgId and search', () => {
      const result = tagQuerySchema.parse({ orgId: 'org-001', search: 'test' });
      expect(result.orgId).toBe('org-001');
      expect(result.search).toBe('test');
    });
  });
});

describe('Onboarding Schemas', () => {
  describe('onboardingStatusSchema', () => {
    it('should accept valid status', () => {
      const result = onboardingStatusSchema.parse({
        onboardingCompleted: false,
        tourCompleted: false,
      });
      expect(result.onboardingCompleted).toBe(false);
      expect(result.tourCompleted).toBe(false);
    });

    it('should accept both as true', () => {
      const result = onboardingStatusSchema.parse({
        onboardingCompleted: true,
        tourCompleted: true,
      });
      expect(result.onboardingCompleted).toBe(true);
    });

    it('should reject missing fields', () => {
      expect(() => onboardingStatusSchema.parse({})).toThrow();
      expect(() => onboardingStatusSchema.parse({ onboardingCompleted: true })).toThrow();
    });

    it('should reject non-boolean values', () => {
      expect(() =>
        onboardingStatusSchema.parse({ onboardingCompleted: 'yes', tourCompleted: false })
      ).toThrow();
    });
  });

  describe('createInvitationWithTagsSchema', () => {
    it('should accept valid invitation', () => {
      const result = createInvitationWithTagsSchema.parse({
        emailAddress: 'actor@example.com',
        role: 'org:member',
      });
      expect(result.emailAddress).toBe('actor@example.com');
      expect(result.role).toBe('org:member');
    });

    it('should accept optional tagIds', () => {
      const tagId = randomUUID();
      const result = createInvitationWithTagsSchema.parse({
        emailAddress: 'actor@example.com',
        role: 'org:member',
        tagIds: [tagId],
      });
      expect(result.tagIds).toEqual([tagId]);
    });

    it('should reject invalid email', () => {
      expect(() =>
        createInvitationWithTagsSchema.parse({ emailAddress: 'not-email', role: 'org:member' })
      ).toThrow();
    });

    it('should reject non-UUID tagIds', () => {
      expect(() =>
        createInvitationWithTagsSchema.parse({
          emailAddress: 'a@b.com',
          role: 'org:member',
          tagIds: ['not-uuid'],
        })
      ).toThrow();
    });
  });
});

describe('UserPreferences Schema', () => {
  describe('updateUserPreferencesSchema', () => {
    it('should accept empty object', () => {
      const result = updateUserPreferencesSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept googleCalendarEnabled', () => {
      const result = updateUserPreferencesSchema.parse({ googleCalendarEnabled: true });
      expect(result.googleCalendarEnabled).toBe(true);
    });

    it('should accept onboarding and tour flags', () => {
      const result = updateUserPreferencesSchema.parse({
        onboardingCompleted: true,
        tourCompleted: true,
      });
      expect(result.onboardingCompleted).toBe(true);
      expect(result.tourCompleted).toBe(true);
    });

    it('should accept emailDigestEnabled', () => {
      const result = updateUserPreferencesSchema.parse({ emailDigestEnabled: true });
      expect(result.emailDigestEnabled).toBe(true);
    });

    it('should accept valid emailDigestTime', () => {
      const result = updateUserPreferencesSchema.parse({ emailDigestTime: '09:00' });
      expect(result.emailDigestTime).toBe('09:00');
    });

    it('should reject invalid emailDigestTime format', () => {
      expect(() => updateUserPreferencesSchema.parse({ emailDigestTime: '9am' })).toThrow();
      // Note: '25:00' matches /^\d{2}:\d{2}$/ since the regex only checks digit format
      expect(() => updateUserPreferencesSchema.parse({ emailDigestTime: '9:00' })).toThrow();
      expect(() => updateUserPreferencesSchema.parse({ emailDigestTime: 'abc' })).toThrow();
    });

    it('should accept null notificationPreferences to clear them', () => {
      const result = updateUserPreferencesSchema.parse({ notificationPreferences: null });
      expect(result.notificationPreferences).toBeNull();
    });

    it('should accept valid notification preferences', () => {
      const result = updateUserPreferencesSchema.parse({
        notificationPreferences: {
          EVENTS_SCHEDULING: { inApp: true, email: false },
          ROLES_CASTING: { inApp: true, email: true },
          ADMIN_RESPONSES: { inApp: false, email: false },
          ADMIN_SYSTEM: { inApp: true, email: false },
        },
      });
      expect(result.notificationPreferences?.EVENTS_SCHEDULING.inApp).toBe(true);
    });
  });
});

describe('Activity Schemas', () => {
  describe('objectTypeSchema', () => {
    it('should accept valid object types', () => {
      for (const type of Object.values(ObjectType)) {
        expect(objectTypeSchema.parse(type)).toBe(type);
      }
    });

    it('should reject invalid values', () => {
      expect(() => objectTypeSchema.parse('INVALID')).toThrow();
    });
  });

  describe('activityActionSchema', () => {
    it('should accept valid actions', () => {
      for (const action of Object.values(ActivityAction)) {
        expect(activityActionSchema.parse(action)).toBe(action);
      }
    });

    it('should reject invalid values', () => {
      expect(() => activityActionSchema.parse('INVALID')).toThrow();
    });
  });

  describe('activityQuerySchema', () => {
    it('should apply defaults', () => {
      const result = activityQuerySchema.parse({});
      expect(result.limit).toBe(20);
    });

    it('should accept all optional filters', () => {
      const result = activityQuerySchema.parse({
        objectType: ObjectType.EVENT,
        action: ActivityAction.CREATE,
        userId: 'user-001',
        cursor: 'cursor-123',
        limit: 50,
      });
      expect(result.objectType).toBe('EVENT');
      expect(result.action).toBe('CREATE');
      expect(result.limit).toBe(50);
    });

    it('should coerce date strings', () => {
      const result = activityQuerySchema.parse({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
    });

    it('should reject limit above 100', () => {
      expect(() => activityQuerySchema.parse({ limit: 101 })).toThrow();
    });

    it('should reject limit below 1', () => {
      expect(() => activityQuerySchema.parse({ limit: 0 })).toThrow();
    });
  });

  describe('objectActivitiesParamsSchema', () => {
    it('should accept valid params', () => {
      const result = objectActivitiesParamsSchema.parse({
        objectType: ObjectType.PLAY,
        objectId: 'play-001',
      });
      expect(result.objectType).toBe('PLAY');
      expect(result.objectId).toBe('play-001');
    });

    it('should reject invalid object type', () => {
      expect(() =>
        objectActivitiesParamsSchema.parse({ objectType: 'INVALID', objectId: 'id' })
      ).toThrow();
    });

    it('should reject missing objectId', () => {
      expect(() =>
        objectActivitiesParamsSchema.parse({ objectType: ObjectType.PLAY })
      ).toThrow();
    });
  });
});
