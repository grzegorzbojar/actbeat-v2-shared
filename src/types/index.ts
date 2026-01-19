/**
 * Type definitions for the Actbeat theater management system.
 * @module types
 */

// Event types
export {
  EventCategory,
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
  type CreateLocationInput,
  type UpdateLocationInput,
  type LocationQueryParams,
  type LocationResponse,
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
  type PaginationParams,
  type SortParams,
  type DateRangeFilter,
  type BulkOperationResult,
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

