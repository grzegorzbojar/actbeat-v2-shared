/**
 * Zod validation schemas for Location entities.
 * @module schemas/location
 */

import { z } from 'zod';

/**
 * Schema for creating a new location.
 */
export const createLocationSchema = z.object({
  name: z.string().max(255).nullish(),
  address: z.string().max(500).nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  orgId: z.string().min(1, 'Organization ID is required'),
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
 * Schema for updating an existing location.
 */
export const updateLocationSchema = z.object({
  name: z.string().max(255).nullish(),
  address: z.string().max(500).nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
}).refine(
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
  orgId: z.string().optional(),
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
