/**
 * Event types for the Actbeat theater management system.
 * Events represent calendar entries for rehearsals, performances, and personal schedules.
 * @module types/event
 */

import type { Location } from './location.types.js';
import type { Tag } from './tag.types.js';
import type { TimeBlock } from './search.types.js';

/**
 * Event category enumeration matching Prisma schema.
 * Determines the type and behavior of calendar events.
 */
export enum EventCategory {
  /** Personal events visible only to the owner */
  PRIVATE = 'PRIVATE',
  /** Play rehearsals and performances */
  PLAY = 'PLAY',
  /** Rehearsal events (practice sessions) */
  REHEARSAL = 'REHEARSAL',
  /** Trial/audition events */
  TRIAL = 'TRIAL',
  /** Technical rehearsals and setup */
  TECHNICAL = 'TECHNICAL',
  /** Miscellaneous organization events */
  OTHER = 'OTHER',
}

/**
 * Workflow status for organization events (PLAY, TRIAL, TECHNICAL).
 * Controls visibility and invitation workflow.
 */
export enum EventStatus {
  /** Working version, not visible to participants */
  DRAFT = 'DRAFT',
  /** Invitations sent, awaiting responses */
  PLANNED = 'PLANNED',
  /** All required participants accepted */
  SCHEDULED = 'SCHEDULED',
  /** Event completed, for statistics */
  COMPLETED = 'COMPLETED',
  /** Event cancelled */
  CANCELLED = 'CANCELLED',
}

/**
 * Status for PRIVATE events only.
 * Affects availability calculation.
 */
export enum PrivateEventStatus {
  /** Confirmed personal event - marks time as BUSY */
  CONFIRMED = 'CONFIRMED',
  /** Tentative personal event - marks time as TENTATIVE */
  TENTATIVE = 'TENTATIVE',
}

/**
 * Response status for event participants.
 */
export enum ParticipantStatus {
  /** Invitation sent, no response yet */
  PENDING = 'PENDING',
  /** Participant accepted the invitation */
  ACCEPTED = 'ACCEPTED',
  /** Participant declined the invitation */
  DECLINED = 'DECLINED',
}

/**
 * Availability status for a time period.
 */
export enum AvailabilityStatus {
  /** No events blocking this time */
  FREE = 'FREE',
  /** Has tentative PRIVATE or unaccepted PLANNED org event */
  TENTATIVE = 'TENTATIVE',
  /** Has confirmed PRIVATE or accepted org event */
  BUSY = 'BUSY',
}

/**
 * Rehearsal type for play events.
 */
export enum RehearsalType {
  /** Full run-through of the play */
  FULL_RUN = 'FULL_RUN',
  /** Working on specific scenes */
  SCENE_WORK = 'SCENE_WORK',
  /** Technical rehearsal (lights, sound, etc.) */
  TECHNICAL = 'TECHNICAL',
  /** Dress rehearsal */
  DRESS_REHEARSAL = 'DRESS_REHEARSAL',
}

/**
 * External person information for guests without Clerk accounts.
 */
export interface ExternalPerson {
  /** Name of the external person */
  name: string;
  /** Contact information (phone, etc.) */
  contact?: string;
  /** Email address */
  email?: string;
}

/**
 * Character assignment in PlayEventMetadata.
 * Maps a character to an actor (internal or external).
 */
export interface CharacterAssignment {
  /** ID of the character being played */
  characterId: string;
  /** Clerk user ID if internal actor */
  userId: string | null;
  /** External actor info if not a Clerk user */
  externalActor?: ExternalPerson;
  /** Invitation/response status */
  status?: ParticipantStatus;
  /** Notes about this assignment */
  notes?: string;
}

/**
 * Crew role assignment in PlayEventMetadata.
 * Maps a crew role to a person (internal or external).
 */
export interface CrewAssignment {
  /** ID of the role definition (from UserTag or similar) */
  roleDefinitionId: string;
  /** Human-readable role name */
  roleName: string;
  /** Clerk user ID if internal crew member */
  userId: string | null;
  /** External person info if not a Clerk user */
  externalPerson?: ExternalPerson;
  /** Invitation/response status */
  status?: ParticipantStatus;
  /** Notes about this assignment */
  notes?: string;
}

/**
 * Event metadata for PLAY category events.
 * Stores play-specific information like scene and character assignments.
 */
export interface PlayEventMetadata {
  /** ID of the associated play */
  playId: string;
  /** IDs of scenes being rehearsed */
  sceneIds?: string[];
  /** Character assignments with actor mappings */
  characterAssignments: CharacterAssignment[];
  /** Crew role assignments */
  crewAssignments: CrewAssignment[];
  /** Type of rehearsal */
  rehearsalType?: RehearsalType;
  /** Special requirements for this event */
  specialRequirements?: string[];
  /** @deprecated Use characterAssignments instead */
  characterIds?: string[];
}

/**
 * Event metadata for TRIAL category events.
 * Stores audition-specific information.
 */
export interface TrialEventMetadata {
  /** IDs of characters being auditioned for */
  characterIds?: string[];
  /** Notes about the audition */
  notes?: string;
}

/**
 * Event metadata for OTHER category events.
 * Stores miscellaneous event information.
 */
export interface OtherEventMetadata {
  /** User IDs of invitees */
  invitees?: string[];
}

/**
 * Actor assignment for rehearsal events.
 * Multiple actors can be assigned to a single character in rehearsals.
 */
export interface RehearsalActorAssignment {
  /** Clerk user ID if internal actor */
  userId: string | null;
  /** External actor info if not a Clerk user */
  externalActor?: ExternalPerson;
}

/**
 * Character assignment for rehearsal events.
 * Differs from CharacterAssignment in that it supports multiple actors and skipping.
 */
export interface RehearsalCharacterAssignment {
  /** ID of the character */
  characterId: string;
  /** Multiple actors can be assigned to one character in rehearsals */
  actors: RehearsalActorAssignment[];
  /** Whether to skip this character for partial rehearsal */
  skip?: boolean;
}

/**
 * Event metadata for REHEARSAL category events.
 * Rehearsals differ from performances:
 * - Multiple actors per character
 * - Characters can be skipped
 * - No crew members required
 * - Can select specific scenes
 * - Has "others" field for additional invitees
 */
export interface RehearsalEventMetadata {
  /** ID of the associated play */
  playId: string;
  /** IDs of scenes being rehearsed (optional - empty means all scenes) */
  sceneIds?: string[];
  /** Character assignments with multiple actors */
  characterAssignments: RehearsalCharacterAssignment[];
  /** Additional org member userIds to invite (not actors) */
  othersInvitees?: string[];
  /** Type of rehearsal */
  rehearsalType?: RehearsalType;
  /** Notes about this rehearsal */
  notes?: string;
}

/**
 * Specification for auto-creating an EventOpenRole when an event is created.
 * Used to automatically create open shift roles from crew role definitions
 * that have allowSelfSignup enabled.
 */
export interface AutoOpenRoleSpec {
  /** ID of the crew role definition from the play */
  roleDefinitionId: string;
  /** Human-readable role name */
  roleName: string;
  /** Number of people needed for this role */
  slotsNeeded: number;
  /** IDs of required user tags for eligibility */
  requiredTagIds: string[];
}

/**
 * Union type for event metadata based on category.
 */
export type EventMetadata = PlayEventMetadata | RehearsalEventMetadata | TrialEventMetadata | OtherEventMetadata | Record<string, unknown>;

/**
 * Core Event entity matching the Prisma Event model.
 * Represents a calendar event in the system.
 */
export interface Event {
  /** Unique identifier (12-character random ID) */
  id: string;
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId: string | null;
  /** Event start date and time */
  startDate: Date;
  /** Event end date and time */
  endDate: Date;
  /** Category determining event type and behavior */
  category: EventCategory;
  /** Optional comment or description */
  comment: string | null;
  /** Optional hex color code for display */
  color: string | null;
  /** ID of the associated location */
  locationId: string | null;
  /** ID of the parent event for hierarchical events */
  parentId: string | null;
  /** Category-specific metadata stored as JSON */
  metadata: EventMetadata | null;
  /** Array of participant user IDs (from Clerk) - legacy field */
  participants: string[];
  /** Workflow status for org events (PLAY, TRIAL, TECHNICAL) */
  status: EventStatus | null;
  /** Status for PRIVATE events (CONFIRMED or TENTATIVE) */
  privateStatus: PrivateEventStatus | null;
  /** Direct play reference for PLAY events */
  playId: string | null;
  /** Admin notes for overriding healthcheck warnings */
  adminNotes: string | null;
  /** Minimum notice period in hours */
  minimumNoticePeriod: number | null;
  /** Persisted healthcheck result (JSON) */
  healthcheckResult: HealthcheckResult | null;
  /** Timestamp of the last healthcheck run */
  healthcheckAt: Date | null;
  /** Google Calendar event ID */
  googleEventId: string | null;
  /** Google Calendar ID */
  googleCalendarId: string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Event participant record matching Prisma EventParticipant model.
 */
export interface EventParticipant {
  /** Unique identifier */
  id: string;
  /** ID of the event */
  eventId: string;
  /** Clerk user ID for internal participants */
  userId: string | null;
  /** External participant name */
  externalName: string | null;
  /** External participant contact info */
  externalContact: string | null;
  /** External participant email */
  externalEmail: string | null;
  /** Invitation response status */
  status: ParticipantStatus;
  /** When the participant responded */
  responseAt: Date | null;
  /** Role (actor, director, crew, etc.) */
  role: string | null;
  /** Character ID if role is actor */
  characterId: string | null;
  /** Whether this participant is required for the event */
  isRequired: boolean;
  /** Whether conflicts were overridden for this participant */
  conflictOverride: boolean;
  /** Reason for conflict override */
  overrideReason: string | null;
  /** Google Calendar event ID for this participant */
  googleEventId: string | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Event with all relations loaded.
 */
export interface EventWithRelations extends Event {
  /** Associated location details */
  location: Location | null;
  /** Associated tags */
  tags: Tag[];
  /** Child events for hierarchical structures */
  children: Event[];
  /** Parent event if this is a child */
  parent: Event | null;
  /** Detailed participant records */
  participantRecords: EventParticipant[];
}

/**
 * Input type for creating a new event.
 * Omits auto-generated fields like id, createdAt, updatedAt.
 */
export interface CreateEventInput {
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId?: string | null;
  /** Event start date and time (ISO string or Date) */
  startDate: Date | string;
  /** Event end date and time (ISO string or Date) */
  endDate: Date | string;
  /** Category determining event type and behavior */
  category?: EventCategory;
  /** Optional comment or description */
  comment?: string | null;
  /** Optional hex color code for display */
  color?: string | null;
  /** ID of the associated location */
  locationId?: string | null;
  /** ID of the parent event for hierarchical events */
  parentId?: string | null;
  /** Category-specific metadata */
  metadata?: EventMetadata | null;
  /** Array of participant user IDs */
  participants?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
  /** Workflow status for org events */
  status?: EventStatus | null;
  /** Status for PRIVATE events */
  privateStatus?: PrivateEventStatus | null;
  /** Direct play reference for PLAY events */
  playId?: string | null;
  /** Admin notes for overriding warnings */
  adminNotes?: string | null;
  /** Minimum notice period in hours */
  minimumNoticePeriod?: number | null;
}

/**
 * Input type for updating an existing event.
 * All fields are optional except the implicit id in the route.
 */
export interface UpdateEventInput {
  /** Event title/name */
  title?: string;
  /** ID of the user or organization that owns this event */
  organizerId?: string | null;
  /** Event start date and time */
  startDate?: Date | string;
  /** Event end date and time */
  endDate?: Date | string;
  /** Category determining event type and behavior */
  category?: EventCategory;
  /** Optional comment or description */
  comment?: string | null;
  /** Optional hex color code for display */
  color?: string | null;
  /** ID of the associated location */
  locationId?: string | null;
  /** ID of the parent event for hierarchical events */
  parentId?: string | null;
  /** Category-specific metadata */
  metadata?: EventMetadata | null;
  /** Array of participant user IDs */
  participants?: string[];
  /** Array of tag IDs to associate */
  tagIds?: string[];
  /** Workflow status for org events */
  status?: EventStatus | null;
  /** Status for PRIVATE events */
  privateStatus?: PrivateEventStatus | null;
  /** Direct play reference for PLAY events */
  playId?: string | null;
  /** Admin notes for overriding warnings */
  adminNotes?: string | null;
  /** Minimum notice period in hours */
  minimumNoticePeriod?: number | null;
}

/**
 * Query parameters for filtering events.
 */
export interface EventQueryParams {
  /** Filter by organizer ID */
  organizerId?: string;
  /** Filter by category */
  category?: EventCategory;
  /** Filter events starting after this date */
  startAfter?: Date | string;
  /** Filter events starting before this date */
  startBefore?: Date | string;
  /** Filter events ending after this date */
  endAfter?: Date | string;
  /** Filter events ending before this date */
  endBefore?: Date | string;
  /** Filter by location ID */
  locationId?: string;
  /** Filter by tag IDs (any match) */
  tagIds?: string[];
  /** Include child events in results */
  includeChildren?: boolean;
  /** Filter by workflow status */
  status?: EventStatus;
  /** Filter by play ID */
  playId?: string;
  /** Include participant records in response */
  includeParticipants?: boolean;
}

/**
 * Event response DTO for API responses.
 * Converts dates to ISO strings for JSON serialization.
 */
export interface EventResponse {
  /** Unique identifier */
  id: string;
  /** Event title/name */
  title: string;
  /** ID of the user or organization that owns this event */
  organizerId: string | null;
  /** Event start date and time as ISO string */
  startDate: string;
  /** Event end date and time as ISO string */
  endDate: string;
  /** Category determining event type and behavior */
  category: EventCategory;
  /** Optional comment or description */
  comment: string | null;
  /** Optional hex color code for display */
  color: string | null;
  /** ID of the associated location */
  locationId: string | null;
  /** ID of the parent event */
  parentId: string | null;
  /** Category-specific metadata */
  metadata: EventMetadata | null;
  /** Array of participant user IDs */
  participants: string[];
  /** Workflow status for org events */
  status: EventStatus | null;
  /** Status for PRIVATE events */
  privateStatus: PrivateEventStatus | null;
  /** Direct play ID */
  playId: string | null;
  /** Admin notes */
  adminNotes: string | null;
  /** Minimum notice period in hours */
  minimumNoticePeriod: number | null;
  /** Persisted healthcheck result (JSON) */
  healthcheckResult: HealthcheckResult | null;
  /** Timestamp of the last healthcheck run as ISO string */
  healthcheckAt: string | null;
  /** Google Calendar event ID */
  googleEventId: string | null;
  /** Google Calendar ID */
  googleCalendarId: string | null;
  /** Creation timestamp as ISO string */
  createdAt: string;
  /** Last update timestamp as ISO string */
  updatedAt: string;
}

/**
 * Event participant response for API.
 */
export interface EventParticipantResponse {
  /** Unique identifier */
  id: string;
  /** Event ID */
  eventId: string;
  /** Clerk user ID */
  userId: string | null;
  /** External participant name */
  externalName: string | null;
  /** External participant contact */
  externalContact: string | null;
  /** External participant email */
  externalEmail: string | null;
  /** Response status */
  status: ParticipantStatus;
  /** When responded (ISO string) */
  responseAt: string | null;
  /** Role */
  role: string | null;
  /** Character ID */
  characterId: string | null;
  /** Is required */
  isRequired: boolean;
  /** Conflict override */
  conflictOverride: boolean;
  /** Override reason */
  overrideReason: string | null;
  /** Google event ID */
  googleEventId: string | null;
  /** Created at (ISO string) */
  createdAt: string;
  /** Updated at (ISO string) */
  updatedAt: string;
}

/**
 * Event response with relations for detailed views.
 */
export interface EventResponseWithRelations extends EventResponse {
  /** Associated location details */
  location: Location | null;
  /** Associated tags */
  tags: Tag[];
  /** Participant records */
  participantRecords?: EventParticipantResponse[];
}

// =============================================================================
// Healthcheck Types
// =============================================================================

/**
 * Severity level for healthcheck issues.
 */
export enum HealthcheckSeverity {
  /** Informational - does not block publishing */
  INFO = 'INFO',
  /** Warning - can be overridden with admin notes */
  WARNING = 'WARNING',
  /** Error - blocks publishing, must be resolved */
  ERROR = 'ERROR',
}

/**
 * Type of healthcheck issue.
 */
export enum HealthcheckIssueType {
  /** Actor has a scheduling conflict */
  ACTOR_CONFLICT = 'ACTOR_CONFLICT',
  /** Character has no actor assigned */
  UNASSIGNED_CHARACTER = 'UNASSIGNED_CHARACTER',
  /** Required crew role not filled */
  UNFILLED_CREW_ROLE = 'UNFILLED_CREW_ROLE',
  /** Location has a conflict */
  LOCATION_CONFLICT = 'LOCATION_CONFLICT',
  /** Location is not set */
  MISSING_LOCATION = 'MISSING_LOCATION',
  /** Notice period not met */
  NOTICE_PERIOD = 'NOTICE_PERIOD',
  /** Conflict with another play event (even draft) */
  PLAY_EVENT_CONFLICT = 'PLAY_EVENT_CONFLICT',
  /** A participant has declined the invitation */
  DECLINED_PARTICIPANT = 'DECLINED_PARTICIPANT',
  /** A new scheduling conflict appeared after the invitation was sent */
  NEW_CONFLICT_SINCE_INVITE = 'NEW_CONFLICT_SINCE_INVITE',
  /** General warning */
  GENERAL = 'GENERAL',
}

/**
 * A single healthcheck issue.
 */
export interface HealthcheckIssue {
  /** Type of issue */
  type: HealthcheckIssueType;
  /** Severity level */
  severity: HealthcheckSeverity;
  /** Human-readable message */
  message: string;
  /** Related entity ID (actor, character, location, etc.) */
  entityId?: string;
  /** Related entity name for display */
  entityName?: string;
  /** Additional context */
  details?: Record<string, unknown>;
}

/**
 * Actor conflict details.
 */
export interface ActorConflict {
  /** Clerk user ID of the actor */
  userId: string;
  /** Actor name for display */
  actorName: string;
  /** Character they're assigned to */
  characterId: string;
  /** Character name */
  characterName: string;
  /** Conflicting event ID */
  conflictingEventId: string;
  /** Conflicting event title */
  conflictingEventTitle: string;
  /** Start of conflict */
  conflictStart: Date;
  /** End of conflict */
  conflictEnd: Date;
  /** Type of conflicting event */
  conflictType: 'PRIVATE' | 'ORG_EVENT';
}

/**
 * Location conflict details.
 */
export interface LocationConflict {
  /** Location ID */
  locationId: string;
  /** Location name */
  locationName: string;
  /** Conflicting event ID */
  conflictingEventId: string;
  /** Conflicting event title */
  conflictingEventTitle: string;
  /** Start of conflict */
  conflictStart: Date;
  /** End of conflict */
  conflictEnd: Date;
}

/**
 * Issue detail for a participant who declined an event invitation.
 */
export interface DeclinedParticipantIssue {
  /** Clerk user ID of the participant who declined */
  userId: string;
  /** Display name of the participant */
  userName: string;
  /** Character ID if the participant was assigned as an actor */
  characterId?: string;
  /** Character name for display */
  characterName?: string;
  /** Role of the participant (actor, crew, etc.) */
  role?: string;
  /** Whether this participant was marked as required */
  isRequired: boolean;
  /** ISO timestamp when the participant declined */
  declinedAt: string;
}

/**
 * Issue detail for a new scheduling conflict that appeared after an invitation was sent.
 * This occurs when a participant creates or accepts another event that overlaps
 * with this event after they were already invited.
 */
export interface NewConflictSinceInviteIssue {
  /** Clerk user ID of the participant with the new conflict */
  userId: string;
  /** Display name of the participant */
  userName: string;
  /** Character ID if the participant was assigned as an actor */
  characterId?: string;
  /** Character name for display */
  characterName?: string;
  /** ID of the event causing the conflict */
  conflictingEventId: string;
  /** Title of the event causing the conflict */
  conflictingEventTitle: string;
  /** ISO timestamp for the start of the conflicting event */
  conflictStart: string;
  /** ISO timestamp for the end of the conflicting event */
  conflictEnd: string;
  /** Type of the conflicting event for severity assessment */
  conflictType: 'PRIVATE_CONFIRMED' | 'PRIVATE_TENTATIVE' | 'ORG_ACCEPTED' | 'ORG_PENDING';
  /** Severity: ERROR for confirmed conflicts, WARNING for tentative/pending */
  severity: 'ERROR' | 'WARNING';
}

/**
 * Result of healthcheck validation before publishing.
 */
export interface HealthcheckResult {
  /** Whether the event can be published */
  canPublish: boolean;
  /** Whether there are warnings (but still publishable) */
  hasWarnings: boolean;
  /** All issues found */
  issues: HealthcheckIssue[];
  /** Detailed actor conflicts */
  actorConflicts: ActorConflict[];
  /** Character IDs without actors assigned */
  unassignedCharacters: string[];
  /** Crew role IDs not filled */
  unfilledCrewRoles: string[];
  /** Location conflict if any */
  locationConflict?: LocationConflict;
  /** Whether minimum notice period is met */
  noticePeriodMet: boolean;
  /** Hours until event starts */
  hoursUntilEvent: number;
  /** Required notice period in hours */
  requiredNoticePeriod: number;
  /** Event workflow status at the time of the healthcheck (string to avoid backend enum dependency) */
  eventStatus: string;
  /** ISO timestamp when the healthcheck was performed */
  checkedAt: string;
  /** Summary counts of issues by severity */
  summary: {
    /** Number of ERROR-level issues */
    errors: number;
    /** Number of WARNING-level issues */
    warnings: number;
    /** Number of INFO-level issues */
    infos: number;
  };
  /** Participants who have declined the event invitation */
  declinedParticipants: DeclinedParticipantIssue[];
  /** New scheduling conflicts detected since invitations were sent */
  newConflictsSinceInvite: NewConflictSinceInviteIssue[];
}

/**
 * Response from running a healthcheck on an event.
 * Returned by the POST /api/events/:id/healthcheck endpoint.
 */
export interface HealthcheckRunResponse {
  /** ID of the event that was checked */
  eventId: string;
  /** The healthcheck result */
  result: HealthcheckResult;
  /** Whether the result was persisted to the database */
  persisted: boolean;
}

// =============================================================================
// Availability Types
// =============================================================================

// TimeBlock is imported from search.types.ts to avoid duplication

/**
 * An availability block with status.
 */
export interface AvailabilityBlock extends TimeBlock {
  /** Availability status for this block */
  status: AvailabilityStatus;
  /** Event causing this availability status (if any) */
  eventId?: string;
  /** Event title for display */
  eventTitle?: string;
}

/**
 * Result of checking a user's availability for a time period.
 */
export interface AvailabilityCheckResult {
  /** Clerk user ID */
  userId: string;
  /** Overall status for the queried period */
  overallStatus: AvailabilityStatus;
  /** All availability blocks in the period */
  blocks: AvailabilityBlock[];
  /** Free time blocks within the period */
  freeBlocks: TimeBlock[];
  /** Total free minutes in the period */
  totalFreeMinutes: number;
}

/**
 * Bulk availability check result for multiple users.
 */
export interface BulkAvailabilityResult {
  /** Start of the queried period */
  periodStart: Date;
  /** End of the queried period */
  periodEnd: Date;
  /** Availability results per user */
  userAvailability: AvailabilityCheckResult[];
  /** Users who are free for the entire period */
  fullyAvailableUserIds: string[];
  /** Users who have some availability */
  partiallyAvailableUserIds: string[];
  /** Users who are completely unavailable */
  unavailableUserIds: string[];
}

// =============================================================================
// Input Types for Participant Management
// =============================================================================

/**
 * Input for creating an event participant.
 */
export interface CreateEventParticipantInput {
  /** Clerk user ID for internal participants */
  userId?: string | null;
  /** External participant name */
  externalName?: string | null;
  /** External participant contact */
  externalContact?: string | null;
  /** External participant email */
  externalEmail?: string | null;
  /** Role */
  role?: string | null;
  /** Character ID if actor */
  characterId?: string | null;
  /** Is required */
  isRequired?: boolean;
}

/**
 * Input for updating participant status (responding to invitation).
 */
export interface UpdateParticipantStatusInput {
  /** New status */
  status: ParticipantStatus;
  /** Override conflicts (requires admin permission) */
  conflictOverride?: boolean;
  /** Reason for override */
  overrideReason?: string;
}

// =============================================================================
// Workflow Response Types
// =============================================================================

/**
 * Response from publishing an event (DRAFT → PLANNED).
 */
export interface PublishEventResponse {
  /** Updated event with relations */
  event: EventResponseWithRelations;
  /** Number of participant records created */
  participantsCreated: number;
}

/**
 * Response from unpublishing an event (PLANNED → DRAFT).
 */
export interface UnpublishEventResponse {
  /** Updated event with relations */
  event: EventResponseWithRelations;
  /** Number of participant records removed */
  participantsRemoved: number;
}

/**
 * Response from responding to an invitation.
 */
export interface RespondToInvitationResponse {
  /** Updated participant record */
  participant: EventParticipantResponse;
  /** Updated event with relations */
  event: EventResponseWithRelations;
  /** True if event transitioned to SCHEDULED as a result */
  eventTransitioned: boolean;
}

/**
 * A pending invitation for a user.
 */
export interface PendingInvitation {
  /** Event ID */
  eventId: string;
  /** Event title */
  eventTitle: string;
  /** Event start date (ISO string) */
  startDate: string;
  /** Event end date (ISO string) */
  endDate: string;
  /** Event category */
  category: EventCategory;
  /** Organization ID */
  orgId: string;
  /** Organization slug (for routing) */
  orgSlug: string;
  /** Organization name (for display) */
  orgName: string;
  /** Play ID if applicable */
  playId: string | null;
  /** Play name if applicable */
  playName: string | null;
  /** Character ID if applicable */
  characterId: string | null;
  /** Character name if applicable */
  characterName: string | null;
  /** Role (actor, crew, etc.) */
  role: string | null;
  /** Participant record ID */
  participantId: string;
  /** Whether this participant is required */
  isRequired: boolean;
}

/**
 * Response containing user's invitations.
 */
export interface UserInvitationsResponse {
  /** Pending invitations awaiting response */
  pending: PendingInvitation[];
  /** Upcoming events user has accepted */
  upcoming: PendingInvitation[];
}

/**
 * An organization event for display in the user's personal calendar.
 * Includes both pending and accepted invitations.
 */
export interface UserOrgCalendarEvent {
  /** Event ID */
  id: string;
  /** Event title */
  title: string;
  /** Event start date (ISO string) */
  startDate: string;
  /** Event end date (ISO string) */
  endDate: string;
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Event category */
  category: EventCategory;
  /** Event status */
  status: EventStatus;
  /** User's participation status */
  participantStatus: ParticipantStatus;
  /** Whether this participant is required */
  isRequired: boolean;
  /** Organization ID */
  orgId: string;
  /** Organization slug (for routing) */
  orgSlug: string;
  /** Organization name (for display) */
  orgName: string;
  /** Play name if applicable */
  playName: string | null;
  /** Character name if applicable */
  characterName: string | null;
  /** Location name if applicable */
  locationName: string | null;
}

/**
 * Event detail for participant view (personal space).
 * Used when viewing an org event from the personal calendar.
 */
export interface ParticipantEventDetail {
  /** Event ID */
  id: string;
  /** Event title */
  title: string;
  /** Event start date (ISO string) */
  startDate: string;
  /** Event end date (ISO string) */
  endDate: string;
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Event category */
  category: EventCategory;
  /** Event status */
  status: EventStatus;
  /** Event description/comment */
  description: string | null;

  /** Location info */
  location: {
    id: string;
    name: string;
    address: string | null;
  } | null;

  /** Play info (for PLAY category) */
  play: {
    id: string;
    name: string;
    color: string | null;
  } | null;

  /** Organization ID */
  orgId: string;
  /** Organization slug (for routing) */
  orgSlug: string;
  /** Organization name (for display) */
  orgName: string;

  /** Current user's participation (null if user is owner but not participant) */
  myParticipation: {
    participantId: string;
    status: ParticipantStatus;
    isRequired: boolean;
    characterId: string | null;
    characterName: string | null;
    role: string | null;
    responseAt: string | null;
  } | null;

  /** Other participants (visible to all participants) */
  participants: Array<{
    userId: string | null;
    displayName: string;
    status: ParticipantStatus;
    isRequired: boolean;
    characterName: string | null;
    role: string | null;
  }>;

  /** Creation timestamp (ISO string) */
  createdAt: string;
  /** Last update timestamp (ISO string) */
  updatedAt: string;
}
