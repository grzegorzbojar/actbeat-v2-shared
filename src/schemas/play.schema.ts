/**
 * Zod validation schemas for Play entities.
 * @module schemas/play
 */

import { z } from 'zod';
import { hexColorSchema } from './common.schema.js';

/**
 * Assignment type enum for crew roles.
 */
export const crewRoleAssignmentTypeSchema = z.enum(['userTag', 'specificUsers']);

/**
 * Schema for a single crew role definition.
 * Includes conditional validation based on assignmentType.
 */
export const crewRoleDefinitionSchema = z
  .object({
    id: z.string().uuid('Invalid crew role ID format'),
    name: z.string().min(1, 'Crew role name is required').max(50, 'Crew role name is too long (max 50 characters)'),
    description: z.string().max(500, 'Description is too long (max 500 characters)').optional(),
    color: hexColorSchema,
    requiredCount: z.number().int().min(1, 'Required count must be at least 1').max(99, 'Required count cannot exceed 99'),
    orderIndex: z.number().int().min(0),
    assignmentType: crewRoleAssignmentTypeSchema,
    userTagId: z.string().optional(),
    assignedUserIds: z.array(z.string()).optional(),
    isOptional: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // When assignmentType is 'userTag', userTagId must be provided
      if (data.assignmentType === 'userTag') {
        return data.userTagId !== undefined && data.userTagId.length > 0;
      }
      return true;
    },
    { message: 'User tag is required when assignment type is "userTag"', path: ['userTagId'] }
  )
  .refine(
    (data) => {
      // When assignmentType is 'specificUsers', assignedUserIds must have at least 1 user
      if (data.assignmentType === 'specificUsers') {
        return data.assignedUserIds !== undefined && data.assignedUserIds.length >= 1;
      }
      return true;
    },
    { message: 'At least one user must be assigned when assignment type is "specificUsers"', path: ['assignedUserIds'] }
  );

/**
 * Schema for an array of crew role definitions with uniqueness validation.
 */
export const crewRolesArraySchema = z
  .array(crewRoleDefinitionSchema)
  .max(100, 'Maximum 100 crew roles per play')
  .refine(
    (roles) => {
      const ids = roles.map((r) => r.id);
      return new Set(ids).size === ids.length;
    },
    { message: 'Crew role IDs must be unique' }
  )
  .refine(
    (roles) => {
      const names = roles.map((r) => r.name.toLowerCase());
      return new Set(names).size === names.length;
    },
    { message: 'Crew role names must be unique (case-insensitive)' }
  )
  .nullish();

/**
 * Schema for creating a new play.
 */
export const createPlaySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  orgId: z.string().min(1, 'Organization ID is required'),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  defaultLocationId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  crewRoles: crewRolesArraySchema,
});

/**
 * Schema for updating an existing play.
 */
export const updatePlaySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .nullish(),
  defaultLocationId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  crewRoles: crewRolesArraySchema,
});

/**
 * Schema for play query parameters.
 */
export const playQuerySchema = z.object({
  orgId: z.string().optional(),
  search: z.string().max(100).optional(),
  tagIds: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
    if (typeof val === 'string') return [val];
    return val;
  }),
});

/**
 * Type inference from schemas.
 */
export type CreatePlaySchemaInput = z.input<typeof createPlaySchema>;
export type CreatePlaySchemaOutput = z.output<typeof createPlaySchema>;
export type UpdatePlaySchemaInput = z.input<typeof updatePlaySchema>;
export type UpdatePlaySchemaOutput = z.output<typeof updatePlaySchema>;
export type PlayQuerySchemaInput = z.input<typeof playQuerySchema>;
export type PlayQuerySchemaOutput = z.output<typeof playQuerySchema>;
