/**
 * Zod validation schemas for Scene entities.
 * @module schemas/scene
 */

import { z } from 'zod';

/**
 * Schema for creating a new scene.
 */
export const createSceneSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  playId: z.string().min(1, 'Play ID is required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  characterIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

/**
 * Schema for updating an existing scene.
 */
export const updateSceneSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  characterIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

/**
 * Schema for scene query parameters.
 */
export const sceneQuerySchema = z.object({
  playId: z.string().optional(),
  search: z.string().max(100).optional(),
  characterId: z.string().optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
});

/**
 * Type inference from schemas.
 */
export type CreateSceneSchemaInput = z.input<typeof createSceneSchema>;
export type CreateSceneSchemaOutput = z.output<typeof createSceneSchema>;
export type UpdateSceneSchemaInput = z.input<typeof updateSceneSchema>;
export type UpdateSceneSchemaOutput = z.output<typeof updateSceneSchema>;
export type SceneQuerySchemaInput = z.input<typeof sceneQuerySchema>;
export type SceneQuerySchemaOutput = z.output<typeof sceneQuerySchema>;
