# @actbeat/shared - Task List

## Dependencies
- **Blocks**: v2-backend (needs types), v2-frontend (needs types)
- **Blocked by**: None (first to implement)

---

## Phase 1: Project Setup

- [ ] Initialize npm package with TypeScript
- [ ] Configure tsconfig.json for library build
- [ ] Set up Vitest for testing
- [ ] Configure ESLint + Prettier
- [ ] Set up build scripts (tsc or tsup)

---

## Phase 2: Types (Extract from v1 Prisma Schema)

### Event Types
- [ ] `EventCategory` enum (PRIVATE, PLAY, TRIAL, TECHNICAL)
- [ ] `Event` interface
- [ ] `CreateEventInput` type
- [ ] `UpdateEventInput` type

### Play Types
- [ ] `Play` interface
- [ ] `CreatePlayInput` type
- [ ] `UpdatePlayInput` type

### Character Types
- [ ] `Character` interface
- [ ] `CreateCharacterInput` type
- [ ] `UpdateCharacterInput` type

### Scene Types
- [ ] `Scene` interface
- [ ] `CreateSceneInput` type
- [ ] `UpdateSceneInput` type

### Location Types
- [ ] `Location` interface
- [ ] `CreateLocationInput` type
- [ ] `UpdateLocationInput` type

### Tag Types
- [ ] `Tag` interface
- [ ] `CreateTagInput` type

### Activity Types
- [ ] `ActivityAction` enum (CREATE, UPDATE, DELETE, RENAME, INVITE, EVENT_ACCEPTED)
- [ ] `ActivityObjectType` enum
- [ ] `Activity` interface

### User Types
- [ ] `User` interface (from Clerk)
- [ ] `Organization` interface
- [ ] `OrganizationMembership` interface

### API Types
- [ ] `ApiResponse<T>` wrapper type
- [ ] `ApiError` type
- [ ] `PaginatedResponse<T>` type

### Search Types
- [ ] `TimeBlock` interface
- [ ] `SearchPlayAvailabilityParams` type
- [ ] `SearchSceneAvailabilityParams` type
- [ ] `AvailabilityResult` type
- [ ] `ActorAssignment` type

---

## Phase 3: Zod Schemas

### Event Schema
- [ ] `createEventSchema`
- [ ] `updateEventSchema`
- [ ] `eventQuerySchema` (for filtering)

### Play Schema
- [ ] `createPlaySchema`
- [ ] `updatePlaySchema`

### Character Schema
- [ ] `createCharacterSchema`
- [ ] `updateCharacterSchema`

### Scene Schema
- [ ] `createSceneSchema`
- [ ] `updateSceneSchema`

### Location Schema
- [ ] `createLocationSchema`
- [ ] `updateLocationSchema`

### Search Schemas
- [ ] `searchPlayAvailabilitySchema`
- [ ] `searchSceneAvailabilitySchema`
- [ ] `searchPlaysSchema`
- [ ] `searchScenesSchema`

---

## Phase 4: Constants

### Permissions (from v1 config/roles.js)
- [ ] `Permission` enum
- [ ] `Role` enum
- [ ] `ROLE_PERMISSIONS` mapping
  - basic: personal:read, personal:edit
  - ghost: personal:read
  - actor: org:basic:read
  - admin: org:basic:read, org:basic:edit

### Event Categories
- [ ] `EVENT_CATEGORIES` constant
- [ ] Category color mappings

### Error Codes (from v1 helpers/errorMessages.js)
- [ ] `ErrorCode` enum
- [ ] `ERROR_MESSAGES` mapping

---

## Phase 5: Utilities

### Date Utilities (from v1 helpers/dateUtils.js)
- [ ] `TimeBlock` interface
- [ ] `mergeTimeBlocks(blocks: TimeBlock[]): TimeBlock[]`
- [ ] `subtractTimeBlocks(from: TimeBlock, subtract: TimeBlock[]): TimeBlock[]`
- [ ] `intersectTimeBlocks(a: TimeBlock, b: TimeBlock): TimeBlock | null`
- [ ] `isTimeBlockOverlapping(a: TimeBlock, b: TimeBlock): boolean`
- [ ] Write unit tests for all date utilities

### Combinations (from v1 helpers/combinations.js)
- [ ] `cartesianProduct<T>(...arrays: T[][]): T[][]`
- [ ] `combinations<T>(array: T[], k: number): T[][]`
- [ ] Write unit tests for combination utilities

### Validation Helpers
- [ ] `isValidHexColor(color: string): boolean`
- [ ] `isValidDuration(minutes: number): boolean`

---

## Phase 6: Testing

- [ ] Unit tests for all date utilities (100% coverage)
- [ ] Unit tests for combination utilities
- [ ] Unit tests for Zod schema validation
- [ ] Test type inference from Zod schemas

---

## Phase 7: Publishing

- [ ] Configure package.json for npm publish
- [ ] Set up npm link for local development
- [ ] Create build script that outputs CommonJS + ESM
- [ ] Add exports field to package.json
- [ ] Document npm link workflow for v2-backend and v2-frontend

---

## Reference Files (v1)

| v1 File | Extract To |
|---------|-----------|
| `actbeat-api/prisma/schema.prisma` | `types/*.types.ts` |
| `actbeat-api/config/roles.js` | `constants/permissions.ts` |
| `actbeat-api/helpers/errorMessages.js` | `constants/errors.ts` |
| `actbeat-api/helpers/dateUtils.js` | `utils/date.utils.ts` |
| `actbeat-api/helpers/combinations.js` | `utils/combinations.ts` |

---

## Unblocks

When this package is complete:
- v2-backend can start using types and schemas
- v2-frontend can start using types for API calls
