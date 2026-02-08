/**
 * Tests for Event Zod validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  eventCategorySchema,
  eventStatusSchema,
  privateEventStatusSchema,
  participantStatusSchema,
  availabilityStatusSchema,
  rehearsalTypeSchema,
  externalPersonSchema,
  characterAssignmentSchema,
  crewAssignmentSchema,
  playEventMetadataSchema,
  trialEventMetadataSchema,
  otherEventMetadataSchema,
  rehearsalActorAssignmentSchema,
  rehearsalCharacterAssignmentSchema,
  rehearsalEventMetadataSchema,
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  createEventParticipantSchema,
  updateParticipantStatusSchema,
  bulkUpdateParticipantsSchema,
  respondToInvitationSchema,
  publishEventSchema,
  cancelEventSchema,
} from '../../src/schemas/event.schema.js';
import {
  EventCategory,
  EventStatus,
  PrivateEventStatus,
  ParticipantStatus,
  AvailabilityStatus,
  RehearsalType,
} from '../../src/types/event.types.js';

// ---------------------------------------------------------------------------
// Helper: create dates where end > start
// ---------------------------------------------------------------------------
const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

describe('Event Enum Schemas', () => {
  describe('eventCategorySchema', () => {
    it('should accept all EventCategory values', () => {
      for (const val of Object.values(EventCategory)) {
        expect(eventCategorySchema.parse(val)).toBe(val);
      }
    });

    it('should reject invalid values', () => {
      expect(() => eventCategorySchema.parse('INVALID')).toThrow();
    });
  });

  describe('eventStatusSchema', () => {
    it('should accept all EventStatus values', () => {
      for (const val of Object.values(EventStatus)) {
        expect(eventStatusSchema.parse(val)).toBe(val);
      }
    });

    it('should reject invalid values', () => {
      expect(() => eventStatusSchema.parse('INVALID')).toThrow();
    });
  });

  describe('privateEventStatusSchema', () => {
    it('should accept CONFIRMED and TENTATIVE', () => {
      expect(privateEventStatusSchema.parse('CONFIRMED')).toBe('CONFIRMED');
      expect(privateEventStatusSchema.parse('TENTATIVE')).toBe('TENTATIVE');
    });

    it('should reject invalid values', () => {
      expect(() => privateEventStatusSchema.parse('ACTIVE')).toThrow();
    });
  });

  describe('participantStatusSchema', () => {
    it('should accept all ParticipantStatus values', () => {
      for (const val of Object.values(ParticipantStatus)) {
        expect(participantStatusSchema.parse(val)).toBe(val);
      }
    });

    it('should reject invalid values', () => {
      expect(() => participantStatusSchema.parse('MAYBE')).toThrow();
    });
  });

  describe('availabilityStatusSchema', () => {
    it('should accept all AvailabilityStatus values', () => {
      for (const val of Object.values(AvailabilityStatus)) {
        expect(availabilityStatusSchema.parse(val)).toBe(val);
      }
    });

    it('should reject invalid values', () => {
      expect(() => availabilityStatusSchema.parse('UNKNOWN')).toThrow();
    });
  });

  describe('rehearsalTypeSchema', () => {
    it('should accept all RehearsalType values', () => {
      for (const val of Object.values(RehearsalType)) {
        expect(rehearsalTypeSchema.parse(val)).toBe(val);
      }
    });

    it('should reject invalid values', () => {
      expect(() => rehearsalTypeSchema.parse('WARM_UP')).toThrow();
    });
  });
});

describe('externalPersonSchema', () => {
  it('should accept valid person with name only', () => {
    const result = externalPersonSchema.parse({ name: 'John' });
    expect(result.name).toBe('John');
    expect(result.contact).toBeUndefined();
    expect(result.email).toBeUndefined();
  });

  it('should accept person with all fields', () => {
    const result = externalPersonSchema.parse({
      name: 'John',
      contact: '555-1234',
      email: 'john@example.com',
    });
    expect(result.email).toBe('john@example.com');
  });

  it('should reject empty name', () => {
    expect(() => externalPersonSchema.parse({ name: '' })).toThrow();
  });

  it('should reject invalid email', () => {
    expect(() =>
      externalPersonSchema.parse({ name: 'John', email: 'not-an-email' })
    ).toThrow();
  });
});

describe('characterAssignmentSchema', () => {
  it('should accept valid assignment with userId', () => {
    const result = characterAssignmentSchema.parse({
      characterId: 'char-001',
      userId: 'user-001',
    });
    expect(result.characterId).toBe('char-001');
    expect(result.userId).toBe('user-001');
  });

  it('should accept null userId (external actor)', () => {
    const result = characterAssignmentSchema.parse({
      characterId: 'char-001',
      userId: null,
      externalActor: { name: 'Guest Actor' },
    });
    expect(result.userId).toBeNull();
    expect(result.externalActor?.name).toBe('Guest Actor');
  });

  it('should reject empty characterId', () => {
    expect(() =>
      characterAssignmentSchema.parse({ characterId: '', userId: 'user-001' })
    ).toThrow();
  });

  it('should accept optional status and notes', () => {
    const result = characterAssignmentSchema.parse({
      characterId: 'char-001',
      userId: 'user-001',
      status: ParticipantStatus.ACCEPTED,
      notes: 'Lead role',
    });
    expect(result.status).toBe('ACCEPTED');
    expect(result.notes).toBe('Lead role');
  });
});

describe('crewAssignmentSchema', () => {
  it('should accept valid crew assignment', () => {
    const result = crewAssignmentSchema.parse({
      roleDefinitionId: 'role-001',
      roleName: 'Sound Tech',
      userId: 'user-001',
    });
    expect(result.roleName).toBe('Sound Tech');
  });

  it('should reject empty roleDefinitionId', () => {
    expect(() =>
      crewAssignmentSchema.parse({
        roleDefinitionId: '',
        roleName: 'Sound Tech',
        userId: 'user-001',
      })
    ).toThrow();
  });

  it('should reject empty roleName', () => {
    expect(() =>
      crewAssignmentSchema.parse({
        roleDefinitionId: 'role-001',
        roleName: '',
        userId: 'user-001',
      })
    ).toThrow();
  });
});

describe('Metadata Schemas', () => {
  describe('playEventMetadataSchema', () => {
    it('should accept valid play metadata', () => {
      const result = playEventMetadataSchema.parse({ playId: 'play-001' });
      expect(result.playId).toBe('play-001');
      expect(result.characterAssignments).toEqual([]);
      expect(result.crewAssignments).toEqual([]);
    });

    it('should accept full play metadata', () => {
      const result = playEventMetadataSchema.parse({
        playId: 'play-001',
        sceneIds: ['scene-001'],
        characterAssignments: [{ characterId: 'char-001', userId: 'user-001' }],
        crewAssignments: [{ roleDefinitionId: 'role-001', roleName: 'Lights', userId: null }],
        rehearsalType: RehearsalType.FULL_RUN,
        specialRequirements: ['Fog machine'],
      });
      expect(result.sceneIds).toEqual(['scene-001']);
      expect(result.characterAssignments).toHaveLength(1);
      expect(result.rehearsalType).toBe('FULL_RUN');
    });

    it('should reject empty playId', () => {
      expect(() => playEventMetadataSchema.parse({ playId: '' })).toThrow();
    });
  });

  describe('trialEventMetadataSchema', () => {
    it('should accept empty object', () => {
      const result = trialEventMetadataSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept characterIds and notes', () => {
      const result = trialEventMetadataSchema.parse({
        characterIds: ['char-001'],
        notes: 'Audition notes',
      });
      expect(result.characterIds).toEqual(['char-001']);
      expect(result.notes).toBe('Audition notes');
    });
  });

  describe('otherEventMetadataSchema', () => {
    it('should accept empty object', () => {
      const result = otherEventMetadataSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept invitees list', () => {
      const result = otherEventMetadataSchema.parse({
        invitees: ['user-001', 'user-002'],
      });
      expect(result.invitees).toEqual(['user-001', 'user-002']);
    });
  });

  describe('rehearsalActorAssignmentSchema', () => {
    it('should accept userId', () => {
      const result = rehearsalActorAssignmentSchema.parse({ userId: 'user-001' });
      expect(result.userId).toBe('user-001');
    });

    it('should accept null userId with external actor', () => {
      const result = rehearsalActorAssignmentSchema.parse({
        userId: null,
        externalActor: { name: 'Guest' },
      });
      expect(result.userId).toBeNull();
    });
  });

  describe('rehearsalCharacterAssignmentSchema', () => {
    it('should accept valid assignment', () => {
      const result = rehearsalCharacterAssignmentSchema.parse({
        characterId: 'char-001',
      });
      expect(result.characterId).toBe('char-001');
      expect(result.actors).toEqual([]);
    });

    it('should accept skip flag', () => {
      const result = rehearsalCharacterAssignmentSchema.parse({
        characterId: 'char-001',
        skip: true,
      });
      expect(result.skip).toBe(true);
    });

    it('should reject empty characterId', () => {
      expect(() =>
        rehearsalCharacterAssignmentSchema.parse({ characterId: '' })
      ).toThrow();
    });
  });

  describe('rehearsalEventMetadataSchema', () => {
    it('should accept valid rehearsal metadata', () => {
      const result = rehearsalEventMetadataSchema.parse({ playId: 'play-001' });
      expect(result.playId).toBe('play-001');
      expect(result.characterAssignments).toEqual([]);
    });

    it('should accept full rehearsal metadata', () => {
      const result = rehearsalEventMetadataSchema.parse({
        playId: 'play-001',
        sceneIds: ['scene-001'],
        characterAssignments: [
          { characterId: 'char-001', actors: [{ userId: 'user-001' }], skip: false },
        ],
        othersInvitees: ['user-002'],
        rehearsalType: RehearsalType.SCENE_WORK,
        notes: 'Focus on Act 2',
      });
      expect(result.characterAssignments).toHaveLength(1);
      expect(result.notes).toBe('Focus on Act 2');
    });

    it('should reject notes longer than 2000 chars', () => {
      expect(() =>
        rehearsalEventMetadataSchema.parse({
          playId: 'play-001',
          notes: 'a'.repeat(2001),
        })
      ).toThrow();
    });
  });
});

describe('createEventSchema', () => {
  const validInput = {
    title: 'Hamlet Rehearsal',
    startDate: now.toISOString(),
    endDate: oneHourLater.toISOString(),
  };

  it('should accept valid input with defaults', () => {
    const result = createEventSchema.parse(validInput);
    expect(result.title).toBe('Hamlet Rehearsal');
    expect(result.category).toBe(EventCategory.PRIVATE);
    expect(result.participants).toEqual([]);
    expect(result.tagIds).toEqual([]);
  });

  it('should coerce date strings to Date objects', () => {
    const result = createEventSchema.parse(validInput);
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.endDate).toBeInstanceOf(Date);
  });

  it('should reject empty title', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, title: '' })
    ).toThrow('Title is required');
  });

  it('should reject title longer than 255 chars', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, title: 'a'.repeat(256) })
    ).toThrow('Title is too long');
  });

  it('should reject endDate before startDate', () => {
    const result = createEventSchema.safeParse({
      ...validInput,
      startDate: oneHourLater.toISOString(),
      endDate: now.toISOString(),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('End date must be after start date');
      expect(result.error.issues[0].path).toContain('endDate');
    }
  });

  it('should reject endDate equal to startDate', () => {
    const result = createEventSchema.safeParse({
      ...validInput,
      startDate: now.toISOString(),
      endDate: now.toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid hex color', () => {
    const result = createEventSchema.parse({ ...validInput, color: '#FF5733' });
    expect(result.color).toBe('#FF5733');
  });

  it('should reject invalid hex color', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, color: 'red' })
    ).toThrow('Invalid hex color');
  });

  it('should accept null color', () => {
    const result = createEventSchema.parse({ ...validInput, color: null });
    expect(result.color).toBeNull();
  });

  it('should accept comment up to 2000 chars', () => {
    const result = createEventSchema.parse({ ...validInput, comment: 'a'.repeat(2000) });
    expect(result.comment).toHaveLength(2000);
  });

  it('should reject comment longer than 2000 chars', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, comment: 'a'.repeat(2001) })
    ).toThrow();
  });

  it('should accept all optional fields', () => {
    const result = createEventSchema.parse({
      ...validInput,
      organizerId: 'org-001',
      category: EventCategory.PLAY,
      locationId: 'loc-001',
      parentId: 'parent-001',
      status: EventStatus.DRAFT,
      privateStatus: PrivateEventStatus.CONFIRMED,
      playId: 'play-001',
      adminNotes: 'Override notes',
      minimumNoticePeriod: 24,
    });
    expect(result.organizerId).toBe('org-001');
    expect(result.status).toBe('DRAFT');
    expect(result.minimumNoticePeriod).toBe(24);
  });

  it('should reject negative minimumNoticePeriod', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, minimumNoticePeriod: -1 })
    ).toThrow();
  });

  it('should reject non-integer minimumNoticePeriod', () => {
    expect(() =>
      createEventSchema.parse({ ...validInput, minimumNoticePeriod: 1.5 })
    ).toThrow();
  });
});

describe('updateEventSchema', () => {
  it('should accept empty object', () => {
    const result = updateEventSchema.parse({});
    expect(result).toBeDefined();
  });

  it('should accept partial title update', () => {
    const result = updateEventSchema.parse({ title: 'New Title' });
    expect(result.title).toBe('New Title');
  });

  it('should pass when only startDate is provided (no endDate)', () => {
    const result = updateEventSchema.parse({ startDate: now.toISOString() });
    expect(result.startDate).toBeInstanceOf(Date);
  });

  it('should pass when only endDate is provided (no startDate)', () => {
    const result = updateEventSchema.parse({ endDate: oneHourLater.toISOString() });
    expect(result.endDate).toBeInstanceOf(Date);
  });

  it('should reject endDate before startDate when both provided', () => {
    const result = updateEventSchema.safeParse({
      startDate: oneHourLater.toISOString(),
      endDate: now.toISOString(),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('End date must be after start date');
    }
  });

  it('should accept valid dates when both provided', () => {
    const result = updateEventSchema.parse({
      startDate: now.toISOString(),
      endDate: oneHourLater.toISOString(),
    });
    expect(result.startDate).toBeInstanceOf(Date);
  });
});

describe('eventQuerySchema', () => {
  it('should accept empty query with defaults', () => {
    const result = eventQuerySchema.parse({});
    expect(result.includeChildren).toBe(false);
    expect(result.includeParticipants).toBe(false);
  });

  it('should accept category filter', () => {
    const result = eventQuerySchema.parse({ category: EventCategory.PLAY });
    expect(result.category).toBe('PLAY');
  });

  it('should coerce date strings', () => {
    const result = eventQuerySchema.parse({
      startAfter: '2024-01-01',
      startBefore: '2024-12-31',
    });
    expect(result.startAfter).toBeInstanceOf(Date);
    expect(result.startBefore).toBeInstanceOf(Date);
  });

  it('should transform single tagId string to array', () => {
    const result = eventQuerySchema.parse({ tagIds: 'tag-001' });
    expect(result.tagIds).toEqual(['tag-001']);
  });

  it('should accept tagIds as array', () => {
    const result = eventQuerySchema.parse({ tagIds: ['tag-001', 'tag-002'] });
    expect(result.tagIds).toEqual(['tag-001', 'tag-002']);
  });

  it('should coerce boolean strings', () => {
    const result = eventQuerySchema.parse({
      includeChildren: 'true',
      includeParticipants: 'true',
    });
    expect(result.includeChildren).toBe(true);
    expect(result.includeParticipants).toBe(true);
  });

  it('should accept status and playId filters', () => {
    const result = eventQuerySchema.parse({
      status: EventStatus.PLANNED,
      playId: 'play-001',
    });
    expect(result.status).toBe('PLANNED');
    expect(result.playId).toBe('play-001');
  });
});

describe('createEventParticipantSchema', () => {
  it('should accept userId participant', () => {
    const result = createEventParticipantSchema.parse({ userId: 'user-001' });
    expect(result.userId).toBe('user-001');
    expect(result.isRequired).toBe(true);
  });

  it('should accept external participant', () => {
    const result = createEventParticipantSchema.parse({ externalName: 'Guest' });
    expect(result.externalName).toBe('Guest');
  });

  it('should reject when neither userId nor externalName is provided', () => {
    const result = createEventParticipantSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Either userId or externalName must be provided'
      );
    }
  });

  it('should accept all optional fields', () => {
    const result = createEventParticipantSchema.parse({
      userId: 'user-001',
      externalContact: '555-1234',
      externalEmail: 'guest@example.com',
      role: 'actor',
      characterId: 'char-001',
      isRequired: false,
    });
    expect(result.role).toBe('actor');
    expect(result.isRequired).toBe(false);
  });

  it('should reject invalid external email', () => {
    expect(() =>
      createEventParticipantSchema.parse({
        externalName: 'Guest',
        externalEmail: 'not-email',
      })
    ).toThrow();
  });

  it('should reject externalName longer than 255 chars', () => {
    expect(() =>
      createEventParticipantSchema.parse({ externalName: 'a'.repeat(256) })
    ).toThrow();
  });

  it('should reject role longer than 100 chars', () => {
    expect(() =>
      createEventParticipantSchema.parse({
        userId: 'user-001',
        role: 'a'.repeat(101),
      })
    ).toThrow();
  });
});

describe('updateParticipantStatusSchema', () => {
  it('should accept valid status', () => {
    const result = updateParticipantStatusSchema.parse({
      status: ParticipantStatus.ACCEPTED,
    });
    expect(result.status).toBe('ACCEPTED');
  });

  it('should accept conflictOverride and reason', () => {
    const result = updateParticipantStatusSchema.parse({
      status: ParticipantStatus.ACCEPTED,
      conflictOverride: true,
      overrideReason: 'Director approved',
    });
    expect(result.conflictOverride).toBe(true);
    expect(result.overrideReason).toBe('Director approved');
  });

  it('should reject invalid status', () => {
    expect(() =>
      updateParticipantStatusSchema.parse({ status: 'MAYBE' })
    ).toThrow();
  });

  it('should reject overrideReason longer than 500 chars', () => {
    expect(() =>
      updateParticipantStatusSchema.parse({
        status: ParticipantStatus.ACCEPTED,
        overrideReason: 'a'.repeat(501),
      })
    ).toThrow();
  });
});

describe('bulkUpdateParticipantsSchema', () => {
  it('should accept valid input', () => {
    const result = bulkUpdateParticipantsSchema.parse({
      participantIds: ['p-001', 'p-002'],
      status: ParticipantStatus.ACCEPTED,
    });
    expect(result.participantIds).toHaveLength(2);
  });

  it('should reject empty participantIds', () => {
    expect(() =>
      bulkUpdateParticipantsSchema.parse({
        participantIds: [],
        status: ParticipantStatus.ACCEPTED,
      })
    ).toThrow();
  });

  it('should reject missing status', () => {
    expect(() =>
      bulkUpdateParticipantsSchema.parse({ participantIds: ['p-001'] })
    ).toThrow();
  });
});

describe('Workflow Schemas', () => {
  describe('respondToInvitationSchema', () => {
    it('should accept ACCEPTED', () => {
      const result = respondToInvitationSchema.parse({ status: 'ACCEPTED' });
      expect(result.status).toBe('ACCEPTED');
    });

    it('should accept DECLINED', () => {
      const result = respondToInvitationSchema.parse({ status: 'DECLINED' });
      expect(result.status).toBe('DECLINED');
    });

    it('should reject PENDING', () => {
      expect(() =>
        respondToInvitationSchema.parse({ status: 'PENDING' })
      ).toThrow();
    });
  });

  describe('publishEventSchema', () => {
    it('should accept empty object with defaults', () => {
      const result = publishEventSchema.parse({});
      expect(result.forcePublish).toBe(false);
    });

    it('should accept adminNotes and forcePublish', () => {
      const result = publishEventSchema.parse({
        adminNotes: 'Overriding warnings',
        forcePublish: true,
      });
      expect(result.forcePublish).toBe(true);
      expect(result.adminNotes).toBe('Overriding warnings');
    });

    it('should reject adminNotes longer than 2000 chars', () => {
      expect(() =>
        publishEventSchema.parse({ adminNotes: 'a'.repeat(2001) })
      ).toThrow();
    });
  });

  describe('cancelEventSchema', () => {
    it('should accept empty object', () => {
      const result = cancelEventSchema.parse({});
      expect(result).toBeDefined();
    });

    it('should accept reason', () => {
      const result = cancelEventSchema.parse({ reason: 'Scheduling conflict' });
      expect(result.reason).toBe('Scheduling conflict');
    });

    it('should reject reason longer than 2000 chars', () => {
      expect(() =>
        cancelEventSchema.parse({ reason: 'a'.repeat(2001) })
      ).toThrow();
    });
  });
});
