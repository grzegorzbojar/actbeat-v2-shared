/**
 * Zod validation schemas for Location entities.
 * @module schemas/location
 */

import { z } from 'zod';

/**
 * Coordinate validation helpers.
 */
const latitudeSchema = z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90');
const longitudeSchema = z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180');

/**
 * Schema for creating a new location.
 */
export const createLocationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  latitude: latitudeSchema.optional().nullable(),
  longitude: longitudeSchema.optional().nullable(),
}).refine(
  (data) => {
    // If one coordinate is provided, the other must be too
    const hasLat = data.latitude != null;
    const hasLng = data.longitude != null;
    return hasLat === hasLng;
  },
  { message: 'Both latitude and longitude must be provided together', path: ['latitude'] }
);

/**
 * Base schema for update location (without refinement).
 */
const updateLocationBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long').optional(),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  latitude: latitudeSchema.optional().nullable(),
  longitude: longitudeSchema.optional().nullable(),
});

/**
 * Schema for updating an existing location.
 * All fields are optional.
 */
export const updateLocationSchema = updateLocationBaseSchema.refine(
  (data) => {
    // If one coordinate is provided, the other must be too
    const hasLat = data.latitude !== undefined;
    const hasLng = data.longitude !== undefined;
    if (hasLat !== hasLng) {
      return false;
    }
    // If both are provided, check they're either both null or both numbers
    if (hasLat && hasLng) {
      const latIsNull = data.latitude === null;
      const lngIsNull = data.longitude === null;
      return latIsNull === lngIsNull;
    }
    return true;
  },
  { message: 'Both latitude and longitude must be provided together', path: ['latitude'] }
);

/**
 * Schema for location query parameters.
 */
export const locationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
  search: z.string().max(100).optional(),
});

/**
 * Type inference from schemas.
 */
export type CreateLocationSchemaInput = z.input<typeof createLocationSchema>;
export type CreateLocationSchemaOutput = z.output<typeof createLocationSchema>;
export type UpdateLocationSchemaInput = z.input<typeof updateLocationSchema>;
export type UpdateLocationSchemaOutput = z.output<typeof updateLocationSchema>;
export type LocationQuerySchemaInput = z.input<typeof locationQuerySchema>;
export type LocationQuerySchemaOutput = z.output<typeof locationQuerySchema>;
