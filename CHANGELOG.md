# Changelog

All notable changes to this project are documented here.

## [1.0.0] - 2026-04-20

### Added

- First stable release of the Habit Tracker PWA.
- Offline-first habit tracking with LocalForage-backed Zustand persistence.
- PWA app shell caching through `vite-plugin-pwa`.
- Cookie-based JWT authentication with shared API client support.
- Habit dashboard with progress overview, achievements, profile page, and reusable UI primitives.
- Online/offline and sync status UI: `Online`, `Offline mode`, `Saved locally`, `Sync pending`, `Syncing`, `Synced`, and `Sync failed`.
- Manual `Sync now` action in addition to automatic synchronization.
- Soft delete sync model through `deletedAt` tombstones.
- React `ErrorBoundary` with safe recovery UI.
- Skeleton loading state and clearer offline helper text.
- Layered Express backend with routes, controllers, services, repositories, modules, and shared infrastructure.
- Sync DTO and mapper layer between API contracts and Prisma persistence.
- Backend and frontend tests for auth, sync, repositories, services, middleware, stores, and UI components.
- GitHub Actions CI with `npm ci`, `npm run verify`, and workspace linting.
- Project documentation for architecture, backend, frontend, API, development, testing, and speaker notes.

### Changed

- SQLite database files are no longer tracked in git; local databases are generated from `server/prisma/schema.prisma`.
- Sync no longer sends repeated network requests while offline.
- Deleted habits are hidden immediately and cleaned from local storage after successful synchronization.
- Release verification is centralized through `npm run verify`.

### Verified

- `npm run verify`
- `npm run lint --workspaces`
