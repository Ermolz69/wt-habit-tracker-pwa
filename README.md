# Habit Tracker PWA

Full-stack monorepo for an offline-first habit tracker with a componentized React client and a layered Node.js backend.

## What is inside

- `client` - React + Vite PWA frontend organized around `app / pages / widgets / features / entities / shared`
- `server` - Express + TypeScript backend with controller/service/repository layering and a composition-root style module setup
- `docs` - project documentation for architecture, API, testing, and development workflow

## Core capabilities

- offline-first local habit storage
- background sync with the backend
- cookie-based JWT authentication
- reusable UI primitives and decomposed widgets
- Prisma persistence with SQLite
- unit, repository, middleware, controller, service, and integration tests

## Architecture summary

### Backend

The backend follows a layered structure inspired by modular Nest-style responsibility separation:

- `routes` expose HTTP endpoints
- `controllers` translate HTTP requests and responses
- `services` contain business rules
- `repositories` contain persistence logic
- `modules` wire dependencies together
- `infrastructure` owns shared technical providers such as Prisma
- `common` contains reusable middleware, error handling, and shared types

### Frontend

The frontend follows a Feature-Sliced Design style structure:

- `app` bootstraps routing and providers
- `pages` compose full screens
- `widgets` assemble larger UI blocks
- `features` contain user scenarios and orchestration logic
- `entities` contain domain state
- `shared` contains UI primitives, API helpers, and utilities

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create the following files:

- `client/.env`
- `server/.env`

Recommended variables:

```env
# client/.env
VITE_API_URL=http://localhost:3000/api
```

```env
# server/.env
DATABASE_URL=file:./dev.db
JWT_SECRET=replace-this-secret
CLIENT_URL=http://localhost:5173
PORT=3000
```

### 3. Prepare the database

```bash
npm run prisma:push --workspace=server
```

## Development

Run the frontend:

```bash
npm run dev --workspace=client
```

Run the backend:

```bash
npm run dev --workspace=server
```

## Verification

Type-check the whole workspace:

```bash
npm run typecheck --workspaces
```

Build the whole workspace:

```bash
npm run build --workspaces
```

Run backend tests:

```bash
npm test --workspace=server
```

## Documentation

- [Architecture](./docs/architecture.md)
- [Backend](./docs/backend.md)
- [Frontend](./docs/frontend.md)
- [API](./docs/api.md)
- [Testing](./docs/testing.md)
- [Development](./docs/development.md)
