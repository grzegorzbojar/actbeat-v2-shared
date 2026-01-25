/**
 * Type definitions for the Actbeat theater management system.
 * @module types
 */

// Event types
export {
  EventCategory,
  EventStatus,
  PrivateEventStatus,
  ParticipantStatus,
  AvailabilityStatus,
  RehearsalType,
  HealthcheckSeverity,
  HealthcheckIssueType,
  type Event,
  type EventWithRelations,
  type CreateEventInput,
  type UpdateEventInput,
  type EventQueryParams,
  type EventResponse,
  type EventResponseWithRelations,
  type EventMetadata,
  type PlayEventMetadata,
  type TrialEventMetadata,
  type ExternalPerson,
  type CharacterAssignment,
  type CrewAssignment,
  type EventParticipant,
  type EventParticipantResponse,
  type CreateEventParticipantInput,
  type UpdateParticipantStatusInput,
  type HealthcheckIssue,
  type ActorConflict,
  type LocationConflict,
  type HealthcheckResult,
  type AvailabilityBlock,
  type AvailabilityCheckResult,
  type BulkAvailabilityResult,
  type PublishEventResponse,
  type UnpublishEventResponse,
  type RespondToInvitationResponse,
  type PendingInvitation,
  type UserInvitationsResponse,
  type UserOrgCalendarEvent,
  type ParticipantEventDetail,
} from './event.types.js';

// Play types
export {
  type Play,
  type PlayWithRelations,
  type CreatePlayInput,
  type UpdatePlayInput,
  type PlayQueryParams,
  type PlayResponse,
  type PlayResponseWithRelations,
  type PlayStats,
} from './play.types.js';

// Character types
export {
  type Character,
  type CharacterWithRelations,
  type CreateCharacterInput,
  type UpdateCharacterInput,
  type CharacterQueryParams,
  type CharacterResponse,
  type CharacterResponseWithRelations,
  type CharacterWithActors,
} from './character.types.js';

// Scene types
export {
  type Scene,
  type SceneWithRelations,
  type CreateSceneInput,
  type UpdateSceneInput,
  type SceneQueryParams,
  type SceneResponse,
  type SceneResponseWithRelations,
} from './scene.types.js';

// Location types
export {
  type Location,
  type LocationWithRelations,
  type CreateLocationInput,
  type UpdateLocationInput,
  type LocationQueryParams,
  type LocationResponse,
  type LocationResponseWithRelations,
  type GeoCoordinates,
} from './location.types.js';

// Tag types
export {
  type Tag,
  type CreateTagInput,
  type UpdateTagInput,
  type TagQueryParams,
  type TagResponse,
  type TagUsageStats,
} from './tag.types.js';

// Activity types
export {
  ObjectType,
  ActivityAction,
  type Activity,
  type CreateActivityInput,
  type ActivityQueryParams,
  type ActivityResponse,
  type ActivityWithNames,
  type ActivityDetails,
} from './activity.types.js';

// User types
export {
  type User,
  type UserSummary,
  type Organization,
  type OrganizationRole,
  type OrganizationMembership,
  type OrganizationMembershipWithUser,
  type OrganizationInvitation,
  type CreateInvitationInput,
  type UserResponse,
  type AuthenticatedUser,
} from './user.types.js';

// API types
export {
  type ApiResponse,
  type ApiError,
  type ApiResult,
  type PaginatedResponse,
  type PaginatedResponseMeta,
  type PaginationParams,
  type SortParams,
  type DateRangeFilter,
  type BulkOperationResult,
  type BulkActionResultItem,
  type BulkActionResponse,
  type HealthCheckResponse,
  type RequestMetadata,
} from './api.types.js';

// Search types
export {
  type TimeBlock,
  type DayjsTimeBlock,
  type ActorAssignment,
  type CharacterActors,
  type SearchPlayAvailabilityParams,
  type SearchSceneAvailabilityParams,
  type SearchPlaysParams,
  type SearchScenesParams,
  type AvailabilitySlot,
  type AvailabilityResult,
  type AvailabilityResponse,
  type ActorAvailability,
  type BatchSearchRequest,
  type BatchSearchResult,
} from './search.types.js';

// User preferences types
export {
  type UserPreferences,
  type UserPreferencesResponse,
  type UpdateUserPreferencesInput,
  type GoogleCalendarInfo,
} from './userPreferences.types.js';

// Availability types
export {
  UserAvailabilityStatus,
  BlockingReason,
  type BlockingEvent,
  type UserAvailabilityResult,
  type BulkUserAvailabilityResult,
  type CheckUserAvailabilityParams,
  type CheckBulkAvailabilityParams,
  type UserAvailabilityResponse,
  type BulkUserAvailabilityResponse,
} from './availability.types.js';

// Google Calendar types
export {
  type CreateGoogleEventResult,
  type ParticipantGoogleResult,
  type RsvpSyncResult,
  type CalendarSyncState,
  type CalendarSyncStateResponse,
  type GoogleResponseStatus,
  GOOGLE_TO_PARTICIPANT_STATUS,
  PARTICIPANT_TO_GOOGLE_STATUS,
} from './googleCalendar.types.js';

