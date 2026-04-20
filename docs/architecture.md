# Architecture

## Overview

The project is a monorepo with two runtime applications:

- `client` - browser PWA
- `server` - HTTP API and persistence layer

The goal of the current architecture is clean responsibility separation, testability, and easier long-term maintenance.

## Project infographic

```mermaid
flowchart LR
  User["User<br/>Browser / Installed PWA"]

  subgraph Client["Client PWA"]
    App["React App<br/>routing + providers"]
    UI["Pages / Widgets<br/>dashboard, auth, profile"]
    State["Zustand + LocalForage<br/>habits, auth user, sync status"]
    Sync["Sync feature<br/>auto sync + Sync now"]
    PWA["Service Worker<br/>precache app shell"]
  end

  subgraph Server["Node Backend API"]
    Routes["Express Routes"]
    Controllers["Controllers<br/>HTTP input/output"]
    Services["Services<br/>business rules"]
    Repositories["Repositories<br/>Prisma access"]
    Prisma["Prisma Client"]
  end

  subgraph Database["SQLite"]
    Users["User"]
    Habits["Habit<br/>completedDates + deletedAt"]
  end

  User --> App
  App --> UI
  UI --> State
  State --> Sync
  PWA --> App
  Sync -->|"POST /api/sync/push<br/>GET /api/sync/pull"| Routes
  App -->|"auth requests"| Routes
  Routes --> Controllers --> Services --> Repositories --> Prisma
  Prisma --> Users
  Prisma --> Habits
  State -.->|"offline reads/writes"| User
```

## Offline-first sync flow

```mermaid
sequenceDiagram
  participant U as User
  participant UI as React UI
  participant Store as Zustand + LocalForage
  participant Sync as Sync feature
  participant API as Express API
  participant DB as SQLite

  U->>UI: Create, check-in, or delete habit
  UI->>Store: Update local state
  Store->>Store: hasPendingChanges = true
  UI-->>U: Show "Saved locally" / "Sync pending"

  alt Online
    Sync->>API: POST /api/sync/push
    API->>DB: Upsert habits / store deletedAt tombstones
    Sync->>API: GET /api/sync/pull
    API->>DB: Read latest user habits
    API-->>Sync: Habits including deletedAt
    Sync->>Store: Merge server state
    Store->>Store: lastSyncedAt = now
    UI-->>U: Show "Synced"
  else Offline
    Sync-->>Store: Do not send network requests
    UI-->>U: Show "Offline mode"
  end
```

## Backend request flow

```mermaid
flowchart TD
  Request["HTTP request"]
  Route["Route<br/>URL + middleware"]
  Auth["Auth middleware<br/>JWT cookie / Bearer token"]
  Validate["Validation middleware<br/>Zod schema"]
  Controller["Controller<br/>request/response only"]
  Service["Service<br/>use case logic"]
  Repository["Repository<br/>database operations"]
  Prisma["Shared Prisma client"]
  DB["SQLite database"]
  Response["JSON response"]

  Request --> Route --> Auth --> Validate --> Controller --> Service --> Repository --> Prisma --> DB
  DB --> Prisma --> Repository --> Service --> Controller --> Response
```

## Backend architecture

The backend uses a modular composition-root approach inspired by Nest-style separation of concerns, while still running on Express.

### Layers

- `routes` map URLs to controller handlers
- `controllers` work with HTTP details only
- `services` implement use cases and domain behavior
- `repositories` encapsulate Prisma access
- `modules` assemble dependencies
- `infrastructure` contains shared technical providers
- `common` contains cross-cutting middleware, error handling, and shared request types

### Dependency flow

`route -> controller -> service -> repository -> prisma`

Each lower layer does not depend on upper layers.

### Composition root

Module files create and connect concrete implementations:

- `server/src/modules/auth.module.ts`
- `server/src/modules/sync.module.ts`

This gives the project dependency injection style wiring without adding a full Nest runtime.

## Frontend architecture

The frontend uses a Feature-Sliced Design style structure.

### Layers

- `app` - providers, routing, application entry
- `pages` - full page composition
- `widgets` - assembled screen blocks
- `features` - user scenarios like auth and sync
- `entities` - domain state such as user and habits
- `shared` - UI primitives, API helpers, and utilities

### Responsibility rules

- pages should compose widgets and features, not contain raw API logic
- features should own scenario logic
- shared API utilities should centralize fetch behavior
- reusable UI should live in `shared/ui`
- widgets should group page-level visual structures that are reused or logically isolated

## Error handling

The backend uses a centralized error flow:

- services throw `AppError` for known business failures
- validation middleware forwards `ZodError`
- the global `errorHandler` transforms errors into HTTP responses

This keeps controllers thin and avoids repeated `try/catch` blocks.

## Persistence

Prisma is exposed through a shared singleton provider in:

- `server/src/infrastructure/prisma.ts`

Repositories receive Prisma through constructor injection, which improves testability and avoids scattering client construction.
