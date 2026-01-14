# @actbeat/shared

Shared TypeScript types, Zod validation schemas, and utilities for the Actbeat theater management platform.

## Installation

```bash
npm install @actbeat/shared
# or link locally during development
npm link
```

## Contents

### Types
- **Event** - Calendar events with categories (PRIVATE, PLAY, TRIAL, TECHNICAL)
- **Play** - Theater productions with duration and color coding
- **Character** - Roles in plays with actor assignments
- **Scene** - Scenes within plays with character associations
- **Location** - Event venues with addresses
- **Tag** - Categorization labels (organization-scoped)
- **Activity** - Audit log entries
- **User** - User profiles (from Clerk)

### Schemas (Zod)
- Validation schemas for all entities
- Request/response type inference
- Input validation for API endpoints

### Constants
- **Permissions** - Role-based permission definitions
- **Categories** - Event category enums
- **Errors** - Standardized error codes

### Utilities
- **Date Utils** - Time block operations (merge, subtract, intersect)
- **Combinations** - Combinatorial functions for availability calculations

## Development

```bash
npm install
npm run build
npm run test
npm run lint
```

## Project Structure

```
src/
├── index.ts              # Main exports
├── types/
│   ├── event.types.ts
│   ├── play.types.ts
│   ├── character.types.ts
│   ├── scene.types.ts
│   ├── location.types.ts
│   ├── tag.types.ts
│   ├── activity.types.ts
│   ├── user.types.ts
│   ├── api.types.ts
│   └── search.types.ts
├── schemas/
│   ├── event.schema.ts
│   ├── play.schema.ts
│   ├── character.schema.ts
│   ├── scene.schema.ts
│   ├── location.schema.ts
│   └── search.schema.ts
├── constants/
│   ├── permissions.ts
│   ├── categories.ts
│   └── errors.ts
└── utils/
    ├── date.utils.ts
    └── combinations.ts
```

## Used By

- [actbeat-backend](../v2-backend) - TypeScript Express API
- [actbeat-frontend](../v2-frontend) - TypeScript Vue 3 application

## License

Private - Actbeat
