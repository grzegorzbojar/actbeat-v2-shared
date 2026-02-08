/**
 * Tests for PlayEvent mapper utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  eventToPlayEvent,
  playEventToCreateInput,
  isPlayEvent,
  isDraftEvent,
  isOrgEvent,
} from '../../src/utils/playEvent.mapper.js';
import type { Event, EventResponse } from '../../src/types/event.types.js';
import { EventCategory, EventStatus } from '../../src/types/event.types.js';

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 'evt-001',
  title: 'Test Event',
  organizerId: 'org-001',
  startDate: new Date('2024-06-01T10:00:00Z'),
  endDate: new Date('2024-06-01T12:00:00Z'),
  category: EventCategory.PLAY,
  comment: null,
  color: null,
  locationId: null,
  parentId: null,
  metadata: {
    playId: 'play-001',
    characterAssignments: [
      { characterId: 'char-001', userId: 'user-001' },
    ],
    crewAssignments: [],
    sceneIds: ['scene-001'],
    rehearsalType: 'FULL_RUN' as any,
  },
  participants: [],
  status: EventStatus.DRAFT,
  privateStatus: null,
  playId: 'play-001',
  adminNotes: null,
  minimumNoticePeriod: null,
  healthcheckResult: null,
  healthcheckAt: null,
  googleEventId: null,
  googleCalendarId: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const makeEventResponse = (overrides: Partial<EventResponse> = {}): EventResponse => ({
  id: 'evt-001',
  title: 'Test Event',
  organizerId: 'org-001',
  startDate: '2024-06-01T10:00:00.000Z',
  endDate: '2024-06-01T12:00:00.000Z',
  category: EventCategory.PLAY,
  comment: null,
  color: null,
  locationId: null,
  parentId: null,
  metadata: {
    playId: 'play-001',
    characterAssignments: [
      { characterId: 'char-001', userId: 'user-001' },
    ],
    crewAssignments: [],
    sceneIds: ['scene-001'],
  },
  participants: [],
  status: EventStatus.DRAFT,
  privateStatus: null,
  playId: 'play-001',
  adminNotes: null,
  minimumNoticePeriod: null,
  healthcheckResult: null,
  healthcheckAt: null,
  googleEventId: null,
  googleCalendarId: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('PlayEvent Mapper', () => {
  describe('eventToPlayEvent', () => {
    it('should convert PLAY event to PlayEvent', () => {
      const event = makeEvent();
      const result = eventToPlayEvent(event);

      expect(result).not.toBeNull();
      expect(result!.id).toBe('evt-001');
      expect(result!.title).toBe('Test Event');
      expect(result!.category).toBe('PLAY');
      expect(result!.playId).toBe('play-001');
      expect(result!.characterAssignments).toHaveLength(1);
      expect(result!.characterAssignments[0]?.characterId).toBe('char-001');
      expect(result!.sceneIds).toEqual(['scene-001']);
      expect(result!.crewAssignments).toEqual([]);
    });

    it('should return null for non-PLAY events', () => {
      const event = makeEvent({ category: EventCategory.PRIVATE });
      expect(eventToPlayEvent(event)).toBeNull();
    });

    it('should return null for REHEARSAL events', () => {
      const event = makeEvent({ category: EventCategory.REHEARSAL });
      expect(eventToPlayEvent(event)).toBeNull();
    });

    it('should return null for TRIAL events', () => {
      const event = makeEvent({ category: EventCategory.TRIAL });
      expect(eventToPlayEvent(event)).toBeNull();
    });

    it('should handle event with null metadata', () => {
      const event = makeEvent({ metadata: null });
      const result = eventToPlayEvent(event);

      expect(result).not.toBeNull();
      expect(result!.characterAssignments).toEqual([]);
      expect(result!.sceneIds).toEqual([]);
      expect(result!.rehearsalType).toBeNull();
    });

    it('should handle event without playId by using metadata playId', () => {
      const event = makeEvent({
        playId: null,
        metadata: {
          playId: 'meta-play-001',
          characterAssignments: [],
          crewAssignments: [],
        },
      });
      const result = eventToPlayEvent(event);
      expect(result!.playId).toBe('meta-play-001');
    });

    it('should prefer direct playId over metadata playId', () => {
      const event = makeEvent({
        playId: 'direct-play-001',
        metadata: {
          playId: 'meta-play-001',
          characterAssignments: [],
          crewAssignments: [],
        },
      });
      const result = eventToPlayEvent(event);
      expect(result!.playId).toBe('direct-play-001');
    });

    it('should convert EventResponse to PlayEvent', () => {
      const response = makeEventResponse();
      const result = eventToPlayEvent(response);

      expect(result).not.toBeNull();
      expect(result!.id).toBe('evt-001');
      expect(result!.category).toBe('PLAY');
    });

    it('should preserve all fields from event', () => {
      const event = makeEvent({
        adminNotes: 'some notes',
        minimumNoticePeriod: 24,
        color: '#FF5733',
        locationId: 'loc-001',
        comment: 'test comment',
      });
      const result = eventToPlayEvent(event);

      expect(result!.adminNotes).toBe('some notes');
      expect(result!.minimumNoticePeriod).toBe(24);
      expect(result!.color).toBe('#FF5733');
      expect(result!.locationId).toBe('loc-001');
      expect(result!.comment).toBe('test comment');
    });
  });

  describe('playEventToCreateInput', () => {
    it('should convert CreatePlayEventInput to API format', () => {
      const input = {
        title: 'New Play Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
      };
      const result = playEventToCreateInput(input);

      expect(result.title).toBe('New Play Event');
      expect(result.category).toBe('PLAY');
      expect(result.status).toBe('DRAFT');
      expect(result.playId).toBe('play-001');
      expect(result.startDate).toBe('2024-06-01T10:00:00Z');
      expect(result.endDate).toBe('2024-06-01T12:00:00Z');
      expect(result.metadata.playId).toBe('play-001');
      expect(result.metadata.characterAssignments).toEqual([]);
      expect(result.metadata.crewAssignments).toEqual([]);
    });

    it('should include character assignments in metadata', () => {
      const input = {
        title: 'Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
        characterAssignments: [
          { characterId: 'char-001', userId: 'user-001' },
        ],
      };
      const result = playEventToCreateInput(input);
      expect(result.metadata.characterAssignments).toHaveLength(1);
      expect(result.metadata.characterAssignments[0]?.characterId).toBe('char-001');
    });

    it('should include sceneIds in metadata when provided', () => {
      const input = {
        title: 'Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
        sceneIds: ['scene-001', 'scene-002'],
      };
      const result = playEventToCreateInput(input);
      expect(result.metadata.sceneIds).toEqual(['scene-001', 'scene-002']);
    });

    it('should not include sceneIds when not provided', () => {
      const input = {
        title: 'Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
      };
      const result = playEventToCreateInput(input);
      expect(result.metadata.sceneIds).toBeUndefined();
    });

    it('should include rehearsalType when provided', () => {
      const input = {
        title: 'Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
        rehearsalType: 'FULL_RUN' as any,
      };
      const result = playEventToCreateInput(input);
      expect(result.metadata.rehearsalType).toBe('FULL_RUN');
    });

    it('should pass through optional fields', () => {
      const input = {
        title: 'Event',
        playId: 'play-001',
        startDate: '2024-06-01T10:00:00Z',
        endDate: '2024-06-01T12:00:00Z',
        comment: 'A comment',
        color: '#FF0000',
        locationId: 'loc-001',
      };
      const result = playEventToCreateInput(input);
      expect(result.comment).toBe('A comment');
      expect(result.color).toBe('#FF0000');
      expect(result.locationId).toBe('loc-001');
    });
  });

  describe('isPlayEvent', () => {
    it('should return true for PLAY events', () => {
      expect(isPlayEvent({ category: 'PLAY' })).toBe(true);
      expect(isPlayEvent(makeEvent())).toBe(true);
      expect(isPlayEvent(makeEventResponse())).toBe(true);
    });

    it('should return false for non-PLAY events', () => {
      expect(isPlayEvent({ category: 'PRIVATE' })).toBe(false);
      expect(isPlayEvent({ category: 'REHEARSAL' })).toBe(false);
      expect(isPlayEvent({ category: 'TRIAL' })).toBe(false);
      expect(isPlayEvent({ category: 'TECHNICAL' })).toBe(false);
      expect(isPlayEvent({ category: 'OTHER' })).toBe(false);
    });
  });

  describe('isDraftEvent', () => {
    it('should return true for DRAFT status events', () => {
      expect(isDraftEvent({ status: 'DRAFT' })).toBe(true);
      expect(isDraftEvent({ status: EventStatus.DRAFT })).toBe(true);
    });

    it('should return false for non-DRAFT status events', () => {
      expect(isDraftEvent({ status: 'PLANNED' })).toBe(false);
      expect(isDraftEvent({ status: 'SCHEDULED' })).toBe(false);
      expect(isDraftEvent({ status: 'COMPLETED' })).toBe(false);
      expect(isDraftEvent({ status: 'CANCELLED' })).toBe(false);
    });

    it('should return false for null status', () => {
      expect(isDraftEvent({ status: null })).toBe(false);
    });
  });

  describe('isOrgEvent', () => {
    it('should return true for non-PRIVATE events', () => {
      expect(isOrgEvent({ category: 'PLAY' })).toBe(true);
      expect(isOrgEvent({ category: 'REHEARSAL' })).toBe(true);
      expect(isOrgEvent({ category: 'TRIAL' })).toBe(true);
      expect(isOrgEvent({ category: 'TECHNICAL' })).toBe(true);
      expect(isOrgEvent({ category: 'OTHER' })).toBe(true);
    });

    it('should return false for PRIVATE events', () => {
      expect(isOrgEvent({ category: 'PRIVATE' })).toBe(false);
    });
  });
});
