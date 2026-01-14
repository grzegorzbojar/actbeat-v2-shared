/**
 * Location types for the Actbeat theater management system.
 * Locations represent venues where events can take place.
 * @module types/location
 */

/**
 * Core Location entity matching the Prisma Location model.
 * Represents a venue or place where events occur.
 */
export interface Location {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Location name (e.g., "Main Stage", "Rehearsal Room A") */
  name: string | null;
  /** Full address of the location */
  address: string | null;
  /** Geographic latitude coordinate */
  latitude: number | null;
  /** Geographic longitude coordinate */
  longitude: number | null;
  /** Organization ID from Clerk */
  orgId: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Input type for creating a new location.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateLocationInput {
  /** Location name */
  name?: string | null;
  /** Full address of the location */
  address?: string | null;
  /** Geographic latitude coordinate */
  latitude?: number | null;
  /** Geographic longitude coordinate */
  longitude?: number | null;
  /** Organization ID from Clerk */
  orgId: string;
}

/**
 * Input type for updating an existing location.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateLocationInput {
  /** Location name */
  name?: string | null;
  /** Full address of the location */
  address?: string | null;
  /** Geographic latitude coordinate */
  latitude?: number | null;
  /** Geographic longitude coordinate */
  longitude?: number | null;
}

/**
 * Query parameters for filtering locations.
 */
export interface LocationQueryParams {
  /** Filter by organization ID */
  orgId?: string;
  /** Search by name or address (partial match) */
  search?: string;
}

/**
 * Location response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface LocationResponse {
  /** Unique identifier */
  id: string;
  /** Location name */
  name: string | null;
  /** Full address of the location */
  address: string | null;
  /** Geographic latitude coordinate */
  latitude: number | null;
  /** Geographic longitude coordinate */
  longitude: number | null;
  /** Organization ID from Clerk */
  orgId: string;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Geographic coordinates for map display.
 */
export interface GeoCoordinates {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
}
