/**
 * Activity types for the Actbeat theater management system.
 * Activities represent audit log entries for tracking changes in the system.
 * @module types/activity
 */

/**
 * Object type enumeration matching Prisma schema.
 * Defines the types of entities that can be tracked in the activity log.
 */
export enum ObjectType {
  /** Event entity */
  EVENT = 'EVENT',
  /** Play entity */
  PLAY = 'PLAY',
  /** Scene entity */
  SCENE = 'SCENE',
  /** Character entity */
  CHARACTER = 'CHARACTER',
  /** User entity */
  USER = 'USER',
  /** Location entity */
  LOCATION = 'LOCATION',
}

/**
 * Activity action enumeration matching Prisma schema.
 * Defines the types of actions that are logged.
 */
export enum ActivityAction {
  /** Event was accepted by a participant */
  EVENT_ACCEPTED = 'EVENT_ACCEPTED',
  /** Entity was created */
  CREATE = 'CREATE',
  /** Entity was updated */
  UPDATE = 'UPDATE',
  /** Entity was deleted */
  DELETE = 'DELETE',
  /** Entity was renamed */
  RENAME = 'RENAME',
  /** User was invited to organization */
  INVITE = 'INVITE',
}

/**
 * Details stored with activity entries.
 * Contains before/after state for change tracking.
 */
export interface ActivityDetails {
  /** State before the change */
  before?: Record<string, unknown>;
  /** State after the change */
  after?: Record<string, unknown>;
  /** Additional context about the action */
  context?: Record<string, unknown>;
}

/**
 * Core Activity entity matching the Prisma Activity model.
 * Represents an audit log entry for tracking system changes.
 */
export interface Activity {
  /** Unique identifier (UUID) */
  id: string;
  /** Type of object that was affected */
  objectType: ObjectType;
  /** ID of the affected object */
  objectId: string;
  /** ID of the user who performed the action */
  userId: string;
  /** Type of action performed */
  action: ActivityAction;
  /** Timestamp when the action occurred */
  timestamp: Date;
  /** Additional details about the action */
  details: ActivityDetails | null;
}

/**
 * Input type for creating a new activity log entry.
 * Used internally by the system when logging changes.
 */
export interface CreateActivityInput {
  /** Type of object that was affected */
  objectType: ObjectType;
  /** ID of the affected object */
  objectId: string;
  /** ID of the user who performed the action */
  userId: string;
  /** Type of action performed */
  action: ActivityAction;
  /** Additional details about the action */
  details?: ActivityDetails | null;
}

/**
 * Query parameters for filtering activities.
 */
export interface ActivityQueryParams {
  /** Filter by object type */
  objectType?: ObjectType;
  /** Filter by object ID */
  objectId?: string;
  /** Filter by user ID */
  userId?: string;
  /** Filter by action type */
  action?: ActivityAction;
  /** Filter activities after this timestamp */
  after?: Date | string;
  /** Filter activities before this timestamp */
  before?: Date | string;
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Activity response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface ActivityResponse {
  /** Unique identifier */
  id: string;
  /** Type of object that was affected */
  objectType: ObjectType;
  /** ID of the affected object */
  objectId: string;
  /** ID of the user who performed the action */
  userId: string;
  /** Type of action performed */
  action: ActivityAction;
  /** Timestamp as ISO string */
  timestamp: string;
  /** Additional details about the action */
  details: ActivityDetails | null;
}

/**
 * Activity with resolved entity names for display.
 */
export interface ActivityWithNames extends ActivityResponse {
  /** Name of the user who performed the action */
  userName: string;
  /** Name of the affected object */
  objectName: string;
}
