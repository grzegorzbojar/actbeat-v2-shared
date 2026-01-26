/**
 * Organization-related type definitions.
 * @module organization.types
 */

/**
 * Response type for organization statistics.
 * Used by the GET /api/organizations/stats endpoint.
 */
export interface OrgStatsResponse {
  plays: number;
  characters: number;
  actors: number;
  scenes: number;
  events: number;
}
