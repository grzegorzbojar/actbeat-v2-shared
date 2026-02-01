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
  /** Tag entity */
  TAG = 'TAG',
  /** Organization invitation entity */
  INVITATION = 'INVITATION',
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
  /** Attendance response to an event (accepted, declined, tentative) */
  ATTENDANCE_RESPONSE = 'ATTENDANCE_RESPONSE',
  /** Workflow state change (e.g., draft -> published) */
  WORKFLOW_CHANGE = 'WORKFLOW_CHANGE',
  /** Access or permission revoked */
  REVOKE = 'REVOKE',
  /** Entity assigned to something (e.g., actor to character) */
  ASSIGN = 'ASSIGN',
  /** Entity unassigned from something */
  UNASSIGN = 'UNASSIGN',
}

/**
 * Type of value stored in an activity field change.
 * Used for proper rendering and formatting in the UI.
 */
export type FieldValueType = 'string' | 'date' | 'color' | 'relation' | 'array' | 'number' | 'boolean';

/**
 * Represents a single field change within an activity.
 * Used for detailed change tracking and UI display.
 */
export interface ActivityFieldChange {
  /** Unique identifier for the field change */
  id: string;
  /** Name of the changed field (database column name) */
  fieldName: string;
  /** i18n key for the field label, null if using fieldName directly */
  fieldLabel: string | null;
  /** Value before the change */
  oldValue: unknown;
  /** Value after the change */
  newValue: unknown;
  /** Type of the value for proper rendering */
  valueType: FieldValueType;
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
 * Enhanced with field changes and resolved names for rich UI display.
 */
export interface ActivityResponse {
  /** Unique identifier */
  id: string;
  /** Type of object that was affected */
  objectType: ObjectType;
  /** ID of the affected object */
  objectId: string;
  /** Name of the affected object (resolved for display) */
  objectName: string | null;
  /** ID of the user who performed the action */
  userId: string;
  /** Name of the user who performed the action (resolved from Clerk) */
  userName?: string;
  /** Avatar URL of the user (resolved from Clerk) */
  userAvatar?: string;
  /** Organization ID (null for personal/private activities) */
  orgId: string | null;
  /** Owner ID for personal events/activities */
  ownerId: string | null;
  /** Type of action performed */
  action: ActivityAction;
  /** Timestamp as ISO string */
  timestamp: string;
  /** Type of parent object (e.g., PLAY for a SCENE activity) */
  parentType: ObjectType | null;
  /** ID of the parent object */
  parentId: string | null;
  /** Name of the parent object (resolved for display) */
  parentName: string | null;
  /** Detailed field changes for UPDATE actions */
  fieldChanges: ActivityFieldChange[];
  /** Additional context about the action (flexible metadata) */
  context: Record<string, unknown> | null;
  /** @deprecated Use objectName, userName, and context instead */
  details?: ActivityDetails | null;
}

/**
 * Activity with resolved entity names for display.
 * @deprecated Use ActivityResponse directly - names are now included by default
 */
export interface ActivityWithNames extends ActivityResponse {
  /** Name of the user who performed the action */
  userName: string;
  /** Name of the affected object */
  objectName: string;
}

/**
 * Cursor-based pagination response for activities list.
 * More efficient than offset pagination for large activity logs.
 */
export interface ActivitiesListResponse {
  /** List of activity entries */
  data: ActivityResponse[];
  /** Pagination metadata */
  meta: {
    /** Cursor for fetching the next page, null if no more results */
    cursor: string | null;
    /** Whether there are more results after this page */
    hasMore: boolean;
  };
}
