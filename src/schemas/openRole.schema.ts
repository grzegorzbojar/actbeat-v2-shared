/**
 * Zod validation schemas for Open Roles.
 * @module schemas/openRole
 */

import { z } from 'zod';

/**
 * Schema for creating a new open role on an event.
 */
export const createOpenRoleSchema = z.object({
  /** Name of the role */
  roleName: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role name must be 100 characters or less'),
  /** Number of people needed for this role */
  slotsNeeded: z.number().int().min(1).max(99).default(1),
  /** IDs of required user tags (at least one required for eligibility) */
  requiredTagIds: z.array(z.string()).min(1, 'At least one required tag is needed'),
});

export type CreateOpenRoleSchemaInput = z.input<typeof createOpenRoleSchema>;
export type CreateOpenRoleSchemaOutput = z.output<typeof createOpenRoleSchema>;

/**
 * Schema for updating an existing open role.
 */
export const updateOpenRoleSchema = z.object({
  /** Updated role name */
  roleName: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role name must be 100 characters or less')
    .optional(),
  /** Updated number of slots */
  slotsNeeded: z.number().int().min(1).max(99).optional(),
  /** Updated required tag IDs */
  requiredTagIds: z.array(z.string()).min(1, 'At least one required tag is needed').optional(),
});

export type UpdateOpenRoleSchemaInput = z.input<typeof updateOpenRoleSchema>;
export type UpdateOpenRoleSchemaOutput = z.output<typeof updateOpenRoleSchema>;

/**
 * Schema for admin-assigning a user to a role.
 */
export const adminAssignUserSchema = z.object({
  /** Clerk user ID of the user to assign */
  userId: z.string().min(1, 'User ID is required'),
});

export type AdminAssignUserSchemaInput = z.input<typeof adminAssignUserSchema>;
export type AdminAssignUserSchemaOutput = z.output<typeof adminAssignUserSchema>;

/**
 * Path parameters schema for open role routes.
 */
export const openRoleParamsSchema = z.object({
  /** Event ID */
  eventId: z.string().min(1),
  /** Open role ID */
  roleId: z.string().min(1),
});

export type OpenRoleParamsSchemaInput = z.input<typeof openRoleParamsSchema>;
export type OpenRoleParamsSchemaOutput = z.output<typeof openRoleParamsSchema>;

/**
 * Path parameters schema for signup routes.
 */
export const signupParamsSchema = z.object({
  /** Event ID */
  eventId: z.string().min(1),
  /** Open role ID */
  roleId: z.string().min(1),
  /** Signup ID */
  signupId: z.string().min(1),
});

export type SignupParamsSchemaInput = z.input<typeof signupParamsSchema>;
export type SignupParamsSchemaOutput = z.output<typeof signupParamsSchema>;
