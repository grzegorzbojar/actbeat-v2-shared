/**
 * Combinatorial utility functions for actor assignment.
 * Used in availability search to find valid actor combinations.
 * Based on v1 helpers/combinations.js
 * @module utils/combinations
 */

import type { ActorAssignment, CharacterActors } from '../types/search.types.js';

/**
 * Generates all possible combinations of actor assignments,
 * preventing actors from playing multiple characters.
 *
 * Based on v1 helpers/combinations.js generateCombinations
 *
 * @param characterActors - Array of characters with their available actors
 * @returns Array of valid actor assignment combinations
 *
 * @example
 * ```typescript
 * const characters = [
 *   { characterId: 'hamlet', actors: ['alice', 'bob'] },
 *   { characterId: 'ophelia', actors: ['carol', 'diana'] },
 * ];
 * const combinations = generateCombinations(characters);
 * // [
 * //   { hamlet: 'alice', ophelia: 'carol' },
 * //   { hamlet: 'alice', ophelia: 'diana' },
 * //   { hamlet: 'bob', ophelia: 'carol' },
 * //   { hamlet: 'bob', ophelia: 'diana' },
 * // ]
 * ```
 */
export function generateCombinations(
  characterActors: CharacterActors[]
): Record<string, string>[] {
  // Empty input means no combinations possible
  if (characterActors.length === 0) {
    return [];
  }

  const results: Record<string, string>[] = [];

  function recurse(
    index: number,
    current: Record<string, string>,
    usedActors: Set<string>
  ): void {
    if (index === characterActors.length) {
      results.push({ ...current });
      return;
    }

    const charInfo = characterActors[index];
    if (!charInfo) return;

    const { characterId, actors } = charInfo;

    if (actors.length === 0) {
      // No actors available for this character - no valid combinations
      return;
    }

    for (const actorId of actors) {
      // Skip if actor is already assigned to another character
      if (usedActors.has(actorId)) continue;

      current[characterId] = actorId;
      usedActors.add(actorId);

      recurse(index + 1, current, usedActors);

      delete current[characterId];
      usedActors.delete(actorId);
    }
  }

  recurse(0, {}, new Set());
  return results;
}

/**
 * Generates all possible combinations of actor assignments,
 * allowing actors to play multiple characters.
 *
 * Based on v1 helpers/combinations.js generateCombinationsAllowingMultipleRoles
 *
 * @param characterActors - Array of characters with their available actors
 * @returns Array of actor assignment combinations
 *
 * @example
 * ```typescript
 * const characters = [
 *   { characterId: 'guard1', actors: ['alice', 'bob'] },
 *   { characterId: 'guard2', actors: ['alice', 'bob'] },
 * ];
 * const combinations = generateCombinationsAllowingMultipleRoles(characters);
 * // Includes { guard1: 'alice', guard2: 'alice' } - same actor plays both
 * ```
 */
export function generateCombinationsAllowingMultipleRoles(
  characterActors: CharacterActors[]
): Record<string, string>[] {
  // Empty input means no combinations possible
  if (characterActors.length === 0) {
    return [];
  }

  const results: Record<string, string>[] = [];

  function recurse(index: number, current: Record<string, string>): void {
    if (index === characterActors.length) {
      results.push({ ...current });
      return;
    }

    const charInfo = characterActors[index];
    if (!charInfo) return;

    const { characterId, actors } = charInfo;

    if (actors.length === 0) {
      // No actors available for this character - no valid combinations
      return;
    }

    for (const actorId of actors) {
      current[characterId] = actorId;
      recurse(index + 1, current);
      delete current[characterId];
    }
  }

  recurse(0, {});
  return results;
}

/**
 * Converts a combination record to an array of ActorAssignment objects.
 *
 * @param combination - Record mapping character IDs to actor IDs
 * @returns Array of ActorAssignment objects
 */
export function combinationToAssignments(
  combination: Record<string, string>
): ActorAssignment[] {
  return Object.entries(combination).map(([characterId, actorId]) => ({
    characterId,
    actorId,
  }));
}

/**
 * Gets unique actor IDs from a combination.
 *
 * @param combination - Record mapping character IDs to actor IDs
 * @returns Array of unique actor IDs
 */
export function getUniqueActorsFromCombination(
  combination: Record<string, string>
): string[] {
  return [...new Set(Object.values(combination))];
}

/**
 * Counts the number of possible combinations without generating them.
 * Useful for performance estimation.
 *
 * @param characterActors - Array of characters with their available actors
 * @param allowMultipleRoles - Whether actors can play multiple characters
 * @returns Number of possible combinations (or estimate if too complex)
 */
export function countPossibleCombinations(
  characterActors: CharacterActors[],
  allowMultipleRoles: boolean
): number {
  if (characterActors.length === 0) return 0;

  if (allowMultipleRoles) {
    // Simple product of actor counts
    return characterActors.reduce((total, char) => total * char.actors.length, 1);
  }

  // For restricted combinations, we need to actually count
  // This is computationally intensive for large inputs
  // For estimation, we use the permutation formula as upper bound

  const actorCounts = characterActors.map((c) => c.actors.length);
  const totalActors = new Set(characterActors.flatMap((c) => c.actors)).size;
  const numCharacters = characterActors.length;

  if (numCharacters > totalActors) {
    // More characters than actors - no valid combinations
    return 0;
  }

  // Upper bound estimate: product of available actors per character
  // Actual count could be lower due to actor conflicts
  let estimate = 1;
  for (let i = 0; i < actorCounts.length; i++) {
    const count = actorCounts[i];
    if (count !== undefined) {
      estimate *= Math.max(0, count - i);
    }
  }

  return Math.max(0, estimate);
}

/**
 * Validates that all characters have at least one available actor.
 *
 * @param characterActors - Array of characters with their available actors
 * @returns Object with validation result and list of uncastable characters
 */
export function validateCastability(
  characterActors: CharacterActors[]
): { valid: boolean; uncastableCharacterIds: string[] } {
  const uncastable = characterActors
    .filter((c) => c.actors.length === 0)
    .map((c) => c.characterId);

  return {
    valid: uncastable.length === 0,
    uncastableCharacterIds: uncastable,
  };
}
