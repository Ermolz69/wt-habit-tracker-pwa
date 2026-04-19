# Testing

## Current strategy

The backend test suite covers multiple layers instead of only end-to-end flows.

## Covered layers

- integration tests for auth and sync HTTP flows
- controller unit tests
- service unit tests
- repository tests against the test SQLite database
- middleware tests
- error handler tests

## Why this matters

This combination gives fast feedback at the right abstraction levels:

- integration tests catch contract mismatches between routes and business logic
- controller tests verify HTTP behavior
- service tests verify branching and domain rules
- repository tests verify Prisma queries against the real schema
- middleware tests protect auth and validation behavior

## Commands

Run backend tests:

```bash
npm test --workspace=server
```

Run workspace type-check:

```bash
npm run typecheck --workspaces
```

Run workspace build:

```bash
npm run build --workspaces
```

## Test database

Tests use `server/.env.test` and the SQLite test database declared there. The test setup pushes the Prisma schema before running and cleans the database after each test.

## Naming

All backend tests live in:

- `server/src/__tests__`

Each file is named after the unit or flow it validates.
