/**
 * Tests for Play Zod validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  createPlaySchema,
  updatePlaySchema,
  playQuerySchema,
  crewRoleDefinitionSchema,
  crewRolesArraySchema,
} from '../../src/schemas/play.schema.js';
import { randomUUID } from 'crypto';

describe('Play Schemas', () => {
  describe('createPlaySchema', () => {
    const validInput = {
      name: 'Hamlet',
      orgId: 'org-001',
      duration: 120,
    };

    it('should accept valid input with required fields only', () => {
      const result = createPlaySchema.parse(validInput);
      expect(result.name).toBe('Hamlet');
      expect(result.orgId).toBe('org-001');
      expect(result.duration).toBe(120);
      expect(result.tagIds).toEqual([]);
    });

    it('should accept input with all optional fields', () => {
      const result = createPlaySchema.parse({
        ...validInput,
        color: '#FF5733',
        defaultLocationId: 'loc-001',
        tagIds: ['tag-001'],
      });
      expect(result.color).toBe('#FF5733');
      expect(result.defaultLocationId).toBe('loc-001');
      expect(result.tagIds).toEqual(['tag-001']);
    });

    it('should reject empty name', () => {
      expect(() => createPlaySchema.parse({ ...validInput, name: '' })).toThrow();
    });

    it('should reject name longer than 255 chars', () => {
      expect(() => createPlaySchema.parse({ ...validInput, name: 'a'.repeat(256) })).toThrow();
    });

    it('should reject empty orgId', () => {
      expect(() => createPlaySchema.parse({ ...validInput, orgId: '' })).toThrow();
    });

    it('should reject duration of 0', () => {
      expect(() => createPlaySchema.parse({ ...validInput, duration: 0 })).toThrow();
    });

    it('should reject non-integer duration', () => {
      expect(() => createPlaySchema.parse({ ...validInput, duration: 1.5 })).toThrow();
    });

    it('should reject duration above 1440', () => {
      expect(() => createPlaySchema.parse({ ...validInput, duration: 1441 })).toThrow();
    });

    it('should accept null color', () => {
      const result = createPlaySchema.parse({ ...validInput, color: null });
      expect(result.color).toBeNull();
    });

    it('should reject invalid hex color', () => {
      expect(() => createPlaySchema.parse({ ...validInput, color: 'red' })).toThrow();
    });

    it('should default tagIds to empty array', () => {
      const result = createPlaySchema.parse(validInput);
      expect(result.tagIds).toEqual([]);
    });
  });

  describe('updatePlaySchema', () => {
    it('should accept all fields as optional', () => {
      const result = updatePlaySchema.parse({});
      expect(result.name).toBeUndefined();
      expect(result.duration).toBeUndefined();
    });

    it('should accept valid name update', () => {
      const result = updatePlaySchema.parse({ name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('should reject empty name', () => {
      expect(() => updatePlaySchema.parse({ name: '' })).toThrow();
    });

    it('should accept valid duration update', () => {
      const result = updatePlaySchema.parse({ duration: 90 });
      expect(result.duration).toBe(90);
    });

    it('should accept color null to clear it', () => {
      const result = updatePlaySchema.parse({ color: null });
      expect(result.color).toBeNull();
    });
  });

  describe('playQuerySchema', () => {
    it('should accept empty query', () => {
      const result = playQuerySchema.parse({});
      expect(result.orgId).toBeUndefined();
      expect(result.search).toBeUndefined();
    });

    it('should accept orgId filter', () => {
      const result = playQuerySchema.parse({ orgId: 'org-001' });
      expect(result.orgId).toBe('org-001');
    });

    it('should accept search string', () => {
      const result = playQuerySchema.parse({ search: 'hamlet' });
      expect(result.search).toBe('hamlet');
    });

    it('should reject search longer than 100 chars', () => {
      expect(() => playQuerySchema.parse({ search: 'a'.repeat(101) })).toThrow();
    });

    it('should transform single tagId string into array', () => {
      const result = playQuerySchema.parse({ tagIds: 'tag-001' });
      expect(result.tagIds).toEqual(['tag-001']);
    });

    it('should accept tagIds as array', () => {
      const result = playQuerySchema.parse({ tagIds: ['tag-001', 'tag-002'] });
      expect(result.tagIds).toEqual(['tag-001', 'tag-002']);
    });
  });

  describe('crewRoleDefinitionSchema', () => {
    const validRole = {
      id: randomUUID(),
      name: 'Sound Technician',
      color: '#FF5733',
      requiredCount: 1,
      orderIndex: 0,
      assignmentType: 'userTag' as const,
      userTagId: 'tag-001',
    };

    it('should accept valid crew role with userTag assignment', () => {
      const result = crewRoleDefinitionSchema.parse(validRole);
      expect(result.name).toBe('Sound Technician');
      expect(result.assignmentType).toBe('userTag');
    });

    it('should accept valid crew role with specificUsers assignment', () => {
      const result = crewRoleDefinitionSchema.parse({
        ...validRole,
        assignmentType: 'specificUsers',
        assignedUserIds: ['user-001'],
      });
      expect(result.assignmentType).toBe('specificUsers');
    });

    it('should reject userTag assignment without userTagId', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({
          ...validRole,
          userTagId: undefined,
        })
      ).toThrow('User tag is required');
    });

    it('should reject specificUsers assignment without assignedUserIds', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({
          ...validRole,
          assignmentType: 'specificUsers',
          assignedUserIds: undefined,
        })
      ).toThrow('At least one user must be assigned');
    });

    it('should reject specificUsers assignment with empty assignedUserIds', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({
          ...validRole,
          assignmentType: 'specificUsers',
          assignedUserIds: [],
        })
      ).toThrow('At least one user must be assigned');
    });

    it('should reject empty name', () => {
      expect(() => crewRoleDefinitionSchema.parse({ ...validRole, name: '' })).toThrow();
    });

    it('should reject name longer than 50 chars', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({ ...validRole, name: 'a'.repeat(51) })
      ).toThrow();
    });

    it('should reject requiredCount of 0', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({ ...validRole, requiredCount: 0 })
      ).toThrow();
    });

    it('should reject requiredCount above 99', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({ ...validRole, requiredCount: 100 })
      ).toThrow();
    });

    it('should reject invalid UUID format for id', () => {
      expect(() =>
        crewRoleDefinitionSchema.parse({ ...validRole, id: 'not-a-uuid' })
      ).toThrow();
    });
  });

  describe('crewRolesArraySchema', () => {
    it('should accept null', () => {
      const result = crewRolesArraySchema.parse(null);
      expect(result).toBeNull();
    });

    it('should accept undefined', () => {
      const result = crewRolesArraySchema.parse(undefined);
      expect(result).toBeUndefined();
    });

    it('should accept empty array', () => {
      const result = crewRolesArraySchema.parse([]);
      expect(result).toEqual([]);
    });

    it('should reject duplicate IDs', () => {
      const id = randomUUID();
      const role = {
        id,
        name: 'Role',
        color: '#FF5733',
        requiredCount: 1,
        orderIndex: 0,
        assignmentType: 'userTag' as const,
        userTagId: 'tag-001',
      };
      expect(() =>
        crewRolesArraySchema.parse([role, { ...role, name: 'Other' }])
      ).toThrow('Crew role IDs must be unique');
    });

    it('should reject duplicate names (case-insensitive)', () => {
      const role1 = {
        id: randomUUID(),
        name: 'Sound',
        color: '#FF5733',
        requiredCount: 1,
        orderIndex: 0,
        assignmentType: 'userTag' as const,
        userTagId: 'tag-001',
      };
      const role2 = {
        ...role1,
        id: randomUUID(),
        name: 'SOUND',
      };
      expect(() => crewRolesArraySchema.parse([role1, role2])).toThrow(
        'Crew role names must be unique'
      );
    });
  });
});
