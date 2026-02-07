/**
 * Zod validation schemas for the Actbeat theater management system.
 * @module schemas
 */

// Event schemas
export {
  eventCategorySchema,
  eventStatusSchema,
  privateEventStatusSchema,
  participantStatusSchema,
  availabilityStatusSchema,
  rehearsalTypeSchema,
  externalPersonSchema,
  characterAssignmentSchema,
  crewAssignmentSchema,
  playEventMetadataSchema,
  rehearsalActorAssignmentSchema,
  rehearsalCharacterAssignmentSchema,
  rehearsalEventMetadataSchema,
  trialEventMetadataSchema,
  eventMetadataSchema,
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  createEventParticipantSchema,
  updateParticipantStatusSchema,
  bulkUpdateParticipantsSchema,
  type CreateEventSchemaInput,
  type CreateEventSchemaOutput,
  type UpdateEventSchemaInput,
  type UpdateEventSchemaOutput,
  type EventQuerySchemaInput,
  type EventQuerySchemaOutput,
  type CreateEventParticipantSchemaInput,
  type CreateEventParticipantSchemaOutput,
  type UpdateParticipantStatusSchemaInput,
  type UpdateParticipantStatusSchemaOutput,
  type BulkUpdateParticipantsSchemaInput,
  type BulkUpdateParticipantsSchemaOutput,
  type CharacterAssignmentSchemaInput,
  type CharacterAssignmentSchemaOutput,
  type CrewAssignmentSchemaInput,
  type CrewAssignmentSchemaOutput,
  type ExternalPersonSchemaInput,
  type ExternalPersonSchemaOutput,
  type RehearsalActorAssignmentSchemaInput,
  type RehearsalActorAssignmentSchemaOutput,
  type RehearsalCharacterAssignmentSchemaInput,
  type RehearsalCharacterAssignmentSchemaOutput,
  type RehearsalEventMetadataSchemaInput,
  type RehearsalEventMetadataSchemaOutput,
  respondToInvitationSchema,
  publishEventSchema,
  cancelEventSchema,
  type RespondToInvitationSchemaInput,
  type RespondToInvitationSchemaOutput,
  type PublishEventSchemaInput,
  type PublishEventSchemaOutput,
  type CancelEventSchemaInput,
  type CancelEventSchemaOutput,
} from './event.schema.js';

// Play schemas
export {
  crewRoleAssignmentTypeSchema,
  crewRoleDefinitionSchema,
  crewRolesArraySchema,
  createPlaySchema,
  updatePlaySchema,
  playQuerySchema,
  type CreatePlaySchemaInput,
  type CreatePlaySchemaOutput,
  type UpdatePlaySchemaInput,
  type UpdatePlaySchemaOutput,
  type PlayQuerySchemaInput,
  type PlayQuerySchemaOutput,
} from './play.schema.js';

// Character schemas
export {
  createCharacterSchema,
  updateCharacterSchema,
  characterQuerySchema,
  type CreateCharacterSchemaInput,
  type CreateCharacterSchemaOutput,
  type UpdateCharacterSchemaInput,
  type UpdateCharacterSchemaOutput,
  type CharacterQuerySchemaInput,
  type CharacterQuerySchemaOutput,
} from './character.schema.js';

// Scene schemas
export {
  createSceneSchema,
  updateSceneSchema,
  sceneQuerySchema,
  type CreateSceneSchemaInput,
  type CreateSceneSchemaOutput,
  type UpdateSceneSchemaInput,
  type UpdateSceneSchemaOutput,
  type SceneQuerySchemaInput,
  type SceneQuerySchemaOutput,
} from './scene.schema.js';

// Location schemas
export {
  createLocationSchema,
  updateLocationSchema,
  locationQuerySchema,
  type CreateLocationSchemaInput,
  type CreateLocationSchemaOutput,
  type UpdateLocationSchemaInput,
  type UpdateLocationSchemaOutput,
  type LocationQuerySchemaInput,
  type LocationQuerySchemaOutput,
} from './location.schema.js';

// Tag schemas
export {
  createTagSchema,
  updateTagSchema,
  tagQuerySchema,
  type CreateTagSchemaInput,
  type CreateTagSchemaOutput,
  type UpdateTagSchemaInput,
  type UpdateTagSchemaOutput,
  type TagQuerySchemaInput,
  type TagQuerySchemaOutput,
} from './tag.schema.js';

// Search schemas
export {
  dateRangeSchema,
  searchPlayAvailabilitySchema,
  searchSceneAvailabilitySchema,
  searchPlaysSchema,
  searchScenesSchema,
  batchSearchSchema,
  type DateRangeSchemaInput,
  type DateRangeSchemaOutput,
  type SearchPlayAvailabilitySchemaInput,
  type SearchPlayAvailabilitySchemaOutput,
  type SearchSceneAvailabilitySchemaInput,
  type SearchSceneAvailabilitySchemaOutput,
  type SearchPlaysSchemaInput,
  type SearchPlaysSchemaOutput,
  type SearchScenesSchemaInput,
  type SearchScenesSchemaOutput,
  type BatchSearchSchemaInput,
  type BatchSearchSchemaOutput,
} from './search.schema.js';

// Common schemas
export {
  paginationSchema,
  idParamSchema,
  hexColorSchema,
  idArraySchema,
  dateSchema,
  optionalDateSchema,
  type PaginationSchemaInput,
  type PaginationSchemaOutput,
  type IdParamSchemaInput,
  type IdParamSchemaOutput,
} from './common.schema.js';

// User preferences schemas
export {
  updateUserPreferencesSchema,
  type UpdateUserPreferencesSchemaInput,
  type UpdateUserPreferencesSchemaOutput,
} from './userPreferences.schema.js';

// Organization event schemas
export {
  orgEventCategorySchema,
  createOrgEventSchema,
  updateOrgEventSchema,
  listOrgEventsQuerySchema,
  type OrgEventCategory,
  type CreateOrgEventInput,
  type UpdateOrgEventInput,
  type ListOrgEventsQuery,
} from './orgEvent.schema.js';

// Availability schemas
export {
  userAvailabilityStatusSchema,
  blockingReasonSchema,
  timeBlockResponseSchema,
  blockingEventResponseSchema,
  checkUserAvailabilityQuerySchema,
  checkBulkAvailabilityBodySchema,
  userAvailabilityResponseSchema,
  bulkUserAvailabilityResponseSchema,
  type UserAvailabilityStatusSchema,
  type BlockingReasonSchema,
  type TimeBlockResponseSchema,
  type BlockingEventResponseSchema,
  type CheckUserAvailabilityQuerySchema,
  type CheckBulkAvailabilityBodySchema,
  type UserAvailabilityResponseSchema,
  type BulkUserAvailabilityResponseSchema,
} from './availability.schema.js';

// Bulk action schemas
export {
  bulkIdsSchema,
  bulkPublishSchema,
  bulkUpdateLocationSchema,
  bulkRespondSchema,
  bulkConfirmPrivateEventsSchema,
  bulkDeleteSchema,
  type BulkIdsSchemaInput,
  type BulkIdsSchemaOutput,
  type BulkPublishSchemaInput,
  type BulkPublishSchemaOutput,
  type BulkUpdateLocationSchemaInput,
  type BulkUpdateLocationSchemaOutput,
  type BulkRespondSchemaInput,
  type BulkRespondSchemaOutput,
  type BulkConfirmPrivateEventsSchemaInput,
  type BulkConfirmPrivateEventsSchemaOutput,
  type BulkDeleteSchemaInput,
  type BulkDeleteSchemaOutput,
} from './bulk.schema.js';

// Onboarding schemas
export {
  onboardingStatusSchema,
  createInvitationWithTagsSchema,
  type OnboardingStatusSchemaInput,
  type OnboardingStatusSchemaOutput,
  type CreateInvitationWithTagsSchemaInput,
  type CreateInvitationWithTagsSchemaOutput,
} from './onboarding.schema.js';

// Scheduler schemas
export {
  schedulerParamsSchema,
  schedulerDayDetailParamsSchema,
  type SchedulerParamsSchemaInput,
  type SchedulerParamsSchemaOutput,
  type SchedulerDayDetailParamsSchemaInput,
  type SchedulerDayDetailParamsSchemaOutput,
} from './scheduler.schema.js';

// Activity schemas
export {
  objectTypeSchema,
  activityActionSchema,
  activityQuerySchema,
  objectActivitiesParamsSchema,
  type ActivityQuerySchemaInput,
  type ActivityQuerySchemaOutput,
  type ObjectActivitiesParamsSchemaInput,
  type ObjectActivitiesParamsSchemaOutput,
} from './activity.schema.js';

// Open Role schemas
export {
  createOpenRoleSchema,
  updateOpenRoleSchema,
  adminAssignUserSchema,
  openRoleParamsSchema,
  signupParamsSchema,
  type CreateOpenRoleSchemaInput,
  type CreateOpenRoleSchemaOutput,
  type UpdateOpenRoleSchemaInput,
  type UpdateOpenRoleSchemaOutput,
  type AdminAssignUserSchemaInput,
  type AdminAssignUserSchemaOutput,
  type OpenRoleParamsSchemaInput,
  type OpenRoleParamsSchemaOutput,
  type SignupParamsSchemaInput,
  type SignupParamsSchemaOutput,
} from './openRole.schema.js';

// Notification schemas
export {
  notificationTypeSchema,
  notificationPreferenceGroupSchema,
  notificationGroupPreferenceSchema,
  notificationPreferencesSchema,
  notificationQuerySchema,
  markNotificationsReadSchema,
  type NotificationQuerySchemaInput,
  type NotificationQuerySchemaOutput,
  type NotificationPreferencesSchemaInput,
  type NotificationPreferencesSchemaOutput,
  type MarkNotificationsReadSchemaInput,
  type MarkNotificationsReadSchemaOutput,
} from './notification.schema.js';
