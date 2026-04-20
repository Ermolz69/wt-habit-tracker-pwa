# Development

## Local workflow

Install dependencies:

```bash
npm install
```

Prepare the local SQLite database and Prisma Client:

```bash
npm run prisma:push --workspace=server
```

SQLite database files are intentionally not stored in git. The tracked source of truth is `server/prisma/schema.prisma`; local `dev.db` and `test.db` files are generated from that schema.

Start client:

```bash
npm run dev --workspace=client
```

Start server:

```bash
npm run dev --workspace=server
```

## Quality checks

Before shipping changes, run:

```bash
npm run verify
npm run lint --workspaces
```

## Recommended implementation rules

- keep API calls inside shared or feature layers
- keep pages thin
- move repeated UI into `shared/ui` or dedicated widgets
- keep controllers transport-focused
- keep services business-focused
- keep repositories persistence-focused
- throw `AppError` for expected backend failures

## When adding a backend feature

1. add validation schema
2. add or extend repository methods
3. add service logic
4. add controller handlers
5. wire dependencies in a module file
6. expose routes
7. add tests for at least service and integration behavior

## When adding a frontend feature

1. decide the right FSD layer
2. centralize API communication
3. keep page composition simple
4. extract repeated UI
5. ensure offline and sync behavior still work when relevant
