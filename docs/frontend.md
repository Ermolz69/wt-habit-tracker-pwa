# Frontend

## Stack

- React
- TypeScript
- Vite
- Zustand
- TanStack Query
- Tailwind CSS
- Vite PWA

## Structure

- `src/app` - top-level application composition
- `src/pages` - page entry components
- `src/widgets` - grouped presentational blocks
- `src/features` - scenario logic such as auth and sync
- `src/entities` - domain stores
- `src/shared` - shared UI, API utilities, helpers

## Responsibility split

### Shared API

`src/shared/api/index.ts` centralizes HTTP configuration:

- API base URL
- JSON headers
- cookie credentials
- response error normalization

Pages should not call raw `fetch` directly when the shared API layer already covers the use case.

### Auth feature

The auth scenario is split into:

- `features/auth/api.ts` - auth requests
- `features/auth/useAuthForm.ts` - auth form state and submit logic
- `widgets/auth/AuthPanel.tsx` - auth UI composition
- `pages/auth/AuthPage.tsx` - screen shell

### Habit tracking widget

Habit tracking is decomposed into:

- `widgets/HabitTrackerWidget.tsx` - orchestration widget
- `widgets/habit-tracker/HabitForm.tsx` - create form
- `widgets/habit-tracker/HabitItemCard.tsx` - single habit card
- `widgets/habit-tracker/HabitEmptyState.tsx` - empty state

### Achievements

Achievements are split into:

- `widgets/AchievementsBoard.tsx`
- `widgets/achievements/AchievementCard.tsx`

## State management

### User

User state lives in `entities/user/store.ts` and stores auth state required for routing and session persistence.

### Habits

Habit state lives in `entities/habit/store.ts` and uses persisted Zustand storage with LocalForage for offline-first behavior.

## Sync behavior

The `useSync` feature hook connects local habit state to the backend:

- pushes local updates
- pulls remote updates
- merges remote habits into local state
- exposes loading indicators for UI
