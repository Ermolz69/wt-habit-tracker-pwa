# Backend

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- Zod
- JWT

## Folder map

- `src/app.ts` - Express app composition
- `src/index.ts` - runtime entrypoint
- `src/common` - shared middleware, errors, request types
- `src/controllers` - HTTP handlers
- `src/services` - business logic
- `src/repositories` - persistence layer
- `src/modules` - dependency wiring
- `src/routes` - route registration
- `src/validations` - request validation schemas
- `src/infrastructure` - shared Prisma provider

## Auth flow

### Register

1. request enters `POST /api/auth/register`
2. Zod validates payload
3. controller calls auth service
4. service checks uniqueness and hashes password
5. repository persists user
6. service generates JWT
7. controller sets cookie and returns user plus token

### Login

1. request enters `POST /api/auth/login`
2. payload is validated
3. service finds user by username
4. password hash is compared
5. controller sets cookie and returns auth payload

### Profile

1. auth middleware reads JWT from cookie or `Authorization` header
2. middleware attaches `userId` to request
3. controller asks service for profile
4. service loads user and returns public profile data

## Sync flow

### Push

The client sends habits to `/api/sync/push`. The service:

- validates the payload shape
- loads existing habits for the user
- compares `updatedAt`
- creates new rows or updates stale rows
- executes DB work inside a Prisma transaction

### Pull

The service loads all habits for the authenticated user and normalizes stored JSON date arrays back to API format.

## Backend conventions

- controllers should not contain persistence logic
- services should not know Express request or response types
- repositories should not contain business branching
- known domain failures should use `AppError`
- routes should wrap async handlers through the common async wrapper

## Security notes

- JWT is stored in an HTTP-only cookie for browser usage
- bearer token support remains available for tests and non-browser clients
- auth routes are rate-limited
- CORS is configured with credentials support
