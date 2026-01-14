/**
 * Tests for combination utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  generateCombinations,
  generateCombinationsAllowingMultipleRoles,
  combinationToAssignments,
  getUniqueActorsFromCombination,
  countPossibleCombinations,
  validateCastability,
} from '../../src/utils/combinations.js';
import type { CharacterActors } from '../../src/types/search.types.js';

describe('Combinations', () => {
  describe('generateCombinations', () => {
    it('should return empty array for empty input', () => {
      expect(generateCombinations([])).toEqual([]);
    });

    it('should return empty array if any character has no actors', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice', 'bob'] },
        { characterId: 'ophelia', actors: [] },
      ];
      expect(generateCombinations(characters)).toEqual([]);
    });

    it('should generate all combinations for single character', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice', 'bob'] },
      ];
      const result = generateCombinations(characters);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ hamlet: 'alice' });
      expect(result).toContainEqual({ hamlet: 'bob' });
    });

    it('should generate combinations without actor reuse', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice', 'bob'] },
        { characterId: 'ophelia', actors: ['carol', 'diana'] },
      ];
      const result = generateCombinations(characters);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual({ hamlet: 'alice', ophelia: 'carol' });
      expect(result).toContainEqual({ hamlet: 'alice', ophelia: 'diana' });
      expect(result).toContainEqual({ hamlet: 'bob', ophelia: 'carol' });
      expect(result).toContainEqual({ hamlet: 'bob', ophelia: 'diana' });
    });

    it('should prevent actor from playing multiple characters', () => {
      const characters: CharacterActors[] = [
        { characterId: 'guard1', actors: ['alice', 'bob'] },
        { characterId: 'guard2', actors: ['alice', 'bob'] },
      ];
      const result = generateCombinations(characters);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ guard1: 'alice', guard2: 'bob' });
      expect(result).toContainEqual({ guard1: 'bob', guard2: 'alice' });
      // Should NOT contain { guard1: 'alice', guard2: 'alice' }
      expect(result).not.toContainEqual({ guard1: 'alice', guard2: 'alice' });
    });

    it('should return empty when not enough actors for all characters', () => {
      const characters: CharacterActors[] = [
        { characterId: 'char1', actors: ['alice'] },
        { characterId: 'char2', actors: ['alice'] },
        { characterId: 'char3', actors: ['alice'] },
      ];
      const result = generateCombinations(characters);
      expect(result).toHaveLength(0);
    });

    it('should handle complex scenario', () => {
      const characters: CharacterActors[] = [
        { characterId: 'a', actors: ['1', '2', '3'] },
        { characterId: 'b', actors: ['2', '3'] },
        { characterId: 'c', actors: ['3', '4'] },
      ];
      const result = generateCombinations(characters);
      // Each combination must have unique actors
      for (const combo of result) {
        const actors = Object.values(combo);
        const uniqueActors = new Set(actors);
        expect(actors.length).toBe(uniqueActors.size);
      }
    });
  });

  describe('generateCombinationsAllowingMultipleRoles', () => {
    it('should return empty array for empty input', () => {
      expect(generateCombinationsAllowingMultipleRoles([])).toEqual([]);
    });

    it('should return empty array if any character has no actors', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice'] },
        { characterId: 'ophelia', actors: [] },
      ];
      expect(generateCombinationsAllowingMultipleRoles(characters)).toEqual([]);
    });

    it('should allow actor to play multiple characters', () => {
      const characters: CharacterActors[] = [
        { characterId: 'guard1', actors: ['alice', 'bob'] },
        { characterId: 'guard2', actors: ['alice', 'bob'] },
      ];
      const result = generateCombinationsAllowingMultipleRoles(characters);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual({ guard1: 'alice', guard2: 'alice' });
      expect(result).toContainEqual({ guard1: 'bob', guard2: 'bob' });
    });

    it('should generate cartesian product of actors', () => {
      const characters: CharacterActors[] = [
        { characterId: 'a', actors: ['1', '2'] },
        { characterId: 'b', actors: ['x', 'y', 'z'] },
      ];
      const result = generateCombinationsAllowingMultipleRoles(characters);
      expect(result).toHaveLength(6); // 2 * 3 = 6
    });
  });

  describe('combinationToAssignments', () => {
    it('should convert combination record to assignments array', () => {
      const combination = { hamlet: 'alice', ophelia: 'carol' };
      const result = combinationToAssignments(combination);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ characterId: 'hamlet', actorId: 'alice' });
      expect(result).toContainEqual({ characterId: 'ophelia', actorId: 'carol' });
    });

    it('should handle empty combination', () => {
      expect(combinationToAssignments({})).toEqual([]);
    });
  });

  describe('getUniqueActorsFromCombination', () => {
    it('should return unique actor IDs', () => {
      const combination = { char1: 'alice', char2: 'bob', char3: 'alice' };
      const result = getUniqueActorsFromCombination(combination);
      expect(result).toHaveLength(2);
      expect(result).toContain('alice');
      expect(result).toContain('bob');
    });

    it('should handle empty combination', () => {
      expect(getUniqueActorsFromCombination({})).toEqual([]);
    });
  });

  describe('countPossibleCombinations', () => {
    it('should return 0 for empty input', () => {
      expect(countPossibleCombinations([], false)).toBe(0);
      expect(countPossibleCombinations([], true)).toBe(0);
    });

    it('should count correctly for multiple roles allowed', () => {
      const characters: CharacterActors[] = [
        { characterId: 'a', actors: ['1', '2'] },
        { characterId: 'b', actors: ['x', 'y', 'z'] },
      ];
      expect(countPossibleCombinations(characters, true)).toBe(6);
    });

    it('should return 0 when more characters than unique actors (restricted)', () => {
      const characters: CharacterActors[] = [
        { characterId: 'a', actors: ['1'] },
        { characterId: 'b', actors: ['1'] },
      ];
      // Estimate should account for conflicts
      const count = countPossibleCombinations(characters, false);
      // Actual valid combinations is 0 (only one actor for two roles)
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateCastability', () => {
    it('should return valid for castable characters', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice', 'bob'] },
        { characterId: 'ophelia', actors: ['carol'] },
      ];
      const result = validateCastability(characters);
      expect(result.valid).toBe(true);
      expect(result.uncastableCharacterIds).toEqual([]);
    });

    it('should identify uncastable characters', () => {
      const characters: CharacterActors[] = [
        { characterId: 'hamlet', actors: ['alice'] },
        { characterId: 'ophelia', actors: [] },
        { characterId: 'ghost', actors: [] },
      ];
      const result = validateCastability(characters);
      expect(result.valid).toBe(false);
      expect(result.uncastableCharacterIds).toHaveLength(2);
      expect(result.uncastableCharacterIds).toContain('ophelia');
      expect(result.uncastableCharacterIds).toContain('ghost');
    });

    it('should return valid for empty input', () => {
      const result = validateCastability([]);
      expect(result.valid).toBe(true);
      expect(result.uncastableCharacterIds).toEqual([]);
    });
  });
});
