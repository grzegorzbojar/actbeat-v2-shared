# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-25

### Added

- **Google Calendar Types** (M4.3): Types for Google Calendar export and RSVP sync
  - `CreateGoogleEventResult`: Result of exporting an event to Google Calendar
  - `ParticipantGoogleResult`: Per-participant export result
  - `RsvpSyncResult`: Result of syncing RSVP status from Google Calendar
  - `CalendarSyncState`: Calendar sync state for incremental sync operations
  - `CalendarSyncStateResponse`: API response DTO for sync state
  - `GoogleResponseStatus`: Google Calendar RSVP response status values
  - `GOOGLE_TO_PARTICIPANT_STATUS`: Mapping from Google to Actbeat status
  - `PARTICIPANT_TO_GOOGLE_STATUS`: Mapping from Actbeat to Google status

---

## [0.1.0] - 2024-01-14

### Added

- Initial release of @actbeat/shared package
- **Types**: Complete TypeScript type definitions for all entities
  - Event types with categories (PRIVATE, PLAY, TRIAL, TECHNICAL)
  - Play, Character, Scene, Location, Tag entity types
  - Activity audit log types
  - User and Organization types (Clerk integration)
  - API response wrapper types (ApiResponse, PaginatedResponse)
  - Search and availability types (TimeBlock, AvailabilityResult)
- **Schemas**: Zod validation schemas for all entities
  - Create/Update schemas for all CRUD operations
  - Query parameter schemas
  - Search parameter schemas
- **Constants**: Application constants
  - Role and Permission enums with RBAC helpers
  - ErrorCode enum with HTTP status mappings
  - Event category definitions with colors
- **Utilities**: Shared utility functions
  - Day.js configuration with required plugins
  - Date/time block operations (merge, subtract, intersect)
  - Combination generators for actor assignments
  - Validation helpers

### Infrastructure

- TypeScript 5.7+ with strict mode
- Dual ESM/CJS output via tsup
- Vitest for testing
- Full JSDoc documentation

---

## Migration Guide

### From v1 (actbeat-api)

This package replaces the following v1 files:

| v1 File | v2 Module |
|---------|-----------|
| `config/roles.js` | `constants/permissions.ts` |
| `helpers/errorMessages.js` | `constants/errors.ts` |
| `helpers/dateUtils.js` | `utils/date.utils.ts` |
| `helpers/combinations.js` | `utils/combinations.ts` |
| Prisma-generated types | `types/*.types.ts` |

### Installation

```bash
# In v2-backend or v2-frontend
npm install @actbeat/shared@0.1.0
# or link for local development
npm link @actbeat/shared
```

### Usage

```typescript
import {
  // Types
  type Event,
  type Play,
  EventCategory,
  
  // Schemas
  createEventSchema,
  createPlaySchema,
  
  // Constants
  Role,
  Permission,
  hasPermission,
  
  // Utils
  mergeTimeBlocks,
  generateCombinations,
} from '@actbeat/shared';
```
