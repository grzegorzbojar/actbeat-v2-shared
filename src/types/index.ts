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
  type RehearsalEventMetadata,
  type RehearsalCharacterAssignment,
  type RehearsalActorAssignment,
  type TrialEventMetadata,
  type OtherEventMetadata,
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
  type DeclinedParticipantIssue,
  type NewConflictSinceInviteIssue,
  type HealthcheckResult,
  type HealthcheckRunResponse,
  type AvailabilityBlock,
  type AvailabilityCheckResult,
  type BulkAvailabilityResult,
  type AutoOpenRoleSpec,
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
  type CrewRoleAssignmentType,
  type CrewRoleDefinition,
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
  type FieldValueType,
  type ActivityFieldChange,
  type Activity,
  type CreateActivityInput,
  type ActivityQueryParams,
  type ActivityResponse,
  type ActivityWithNames,
  type ActivityDetails,
  type ActivitiesListResponse,
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
  type EmailDeliveryMode,
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
  type SyncEventResult,
  GOOGLE_TO_PARTICIPANT_STATUS,
  PARTICIPANT_TO_GOOGLE_STATUS,
} from './googleCalendar.types.js';

// Onboarding types
export {
  type OnboardingStatusResponse,
  type InvitationTagPreAssignment,
  type CreateInvitationWithTagsInput,
} from './onboarding.types.js';

// User tag types
export {
  type UserTag,
  type UserTagAssignment,
  type UserTagResponse,
  type UserWithTags,
  type UserOrganizationTagsEntry,
} from './userTag.types.js';

// Organization types
export {
  type OrgStatsResponse,
} from './organization.types.js';

// Scheduler types
export {
  type SchedulerAvailability,
  type SchedulerParams,
  type SchedulerConflict,
  type SchedulerActorResult,
  type SchedulerCharacterResult,
  type SchedulerCrewUserResult,
  type SchedulerCrewRoleResult,
  type SchedulerPlayResult,
  type SchedulerDayResult,
  type SchedulerProgress,
  type SchedulerComplete,
  type SchedulerUserEnrichment,
  type SchedulerSSEEvent,
} from './scheduler.types.js';

// Calendar types
export {
  type CalendarEventSource,
  type ParticipantSummary,
  type CalendarEvent,
} from './calendar.types.js';

// Statistics types
export {
  statisticsQuerySchema,
  type StatisticsQuery,
  type PlayStatItem,
  type ActorStatItem,
  type CrewRoleBreakdownItem,
  type CrewStatItem,
  type StatisticsSummary,
  type StatisticsResponse,
} from './statistics.types.js';

// Open Role types
export {
  type EventOpenRole,
  type EventOpenRoleWithRelations,
  type EventRoleSignup,
  type EventOpenRoleResponse,
  type EventRoleSignupResponse,
  type CreateOpenRoleInput,
  type UpdateOpenRoleInput,
  type SignupForRoleResponse,
  type AdminAssignRoleResponse,
  type AvailableOpenRole,
  type AvailableRolesResponse,
  type AdminAssignUserInput,
} from './openRole.types.js';

// Inbound email types
export {
  type IcsEmailEventMetadata,
} from './inboundEmail.types.js';

// Notification types
export {
  NotificationType,
  NotificationPreferenceGroup,
  type NotificationGroupPreference,
  type NotificationPreferences,
  type Notification,
  type NotificationResponse,
  type CreateNotificationInput,
  type NotificationQueryParams,
  type NotificationsListResponse,
  type EventNotificationPayload,
  type HealthcheckNotificationPayload,
} from './notification.types.js';
