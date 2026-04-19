# 📱 Offline Habit Tracker (Progressive Web App)

This project is a modern Full-Stack Web Application (PWA) with a Feature-Sliced Design (FSD) architecture on the client and a secure Node.js backend. It demonstrates advanced capabilities: offline-first experience, background data synchronization, JWT authentication, and native-like installation.

## 🚀 Core Features

- **Offline-First:** The app operates perfectly without internet. Data is cached locally (IndexedDB via Zustand) and synced later.
- **Client-Server Architecture:** Node.js/Express backend with Prisma (SQLite) handling Auth and Sync.
- **Add to Home Screen:** Can be installed on mobile and desktop directly from the browser.
- **Habit Tracking:** Visualize your 7-day habit progression with elegant UI elements.
- **Achievement System:** Earn interactive badges based on your streak (SVG sprites used for performance).

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, React Query.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Zod Validation.
- **Testing:** Vitest, Supertest.
- **Code Quality:** ESLint, Husky, Lint-Staged, GitHub Actions.

---

## 💻 Installation & Setup

To run this project locally, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 2. Project Initialization
This is a monorepo setup using npm workspaces. Run the following command in the root directory:

```bash
npm install
```

### 3. Environment Variables
Create `.env` files in both `client` and `server` based on `.env.example`.
- `server/.env`: `DATABASE_URL`, `JWT_SECRET`, `PORT`
- `client/.env`: `VITE_API_URL`

### 4. Database Setup
Push the schema to the SQLite database:
```bash
npm run prisma:push --workspace=server
```

## 💻 Development & Build

### Development Mode
Start both client and server simultaneously:
```bash
# Terminal 1: Backend (runs on http://localhost:3000)
npm run dev --workspace=server

# Terminal 2: Frontend (runs on http://localhost:5173)
npm run dev --workspace=client
```

### Production Build
Builds the entire workspace (compiles TypeScript backend and Vite frontend with Service Workers):
```bash
npm run build --workspaces
```

### Testing & Linting
```bash
# Run all linter checks
npm run lint --workspaces

# Run type checks
npm run typecheck --workspaces

# Run backend unit/integration tests
npm test --workspace=server
```
