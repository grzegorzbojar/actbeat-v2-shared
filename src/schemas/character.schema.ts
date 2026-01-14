/**
 * Zod validation schemas for Character entities.
 * @module schemas/character
 */

import { z } from 'zod';

/**
 * Schema for creating a new character.
 */
export const createCharacterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  playId: z.string().min(1, 'Play ID is required'),
  actors: z.array(z.string()).default([]),
  sceneIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

/**
 * Schema for updating an existing character.
 */
export const updateCharacterSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  actors: z.array(z.string()).optional(),
  sceneIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

/**
 * Schema for character query parameters.
 */
export const characterQuerySchema = z.object({
  playId: z.string().optional(),
  search: z.string().max(100).optional(),
  actorId: z.string().optional(),
  sceneId: z.string().optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
});

/**
 * Type inference from schemas.
 */
export type CreateCharacterSchemaInput = z.input<typeof createCharacterSchema>;
export type CreateCharacterSchemaOutput = z.output<typeof createCharacterSchema>;
export type UpdateCharacterSchemaInput = z.input<typeof updateCharacterSchema>;
export type UpdateCharacterSchemaOutput = z.output<typeof updateCharacterSchema>;
export type CharacterQuerySchemaInput = z.input<typeof characterQuerySchema>;
export type CharacterQuerySchemaOutput = z.output<typeof characterQuerySchema>;
