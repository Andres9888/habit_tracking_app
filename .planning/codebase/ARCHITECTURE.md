# Architecture

**Analysis Date:** 2025-03-19

## Pattern Overview

**Overall:** Layered mobile/web app with clear separation between frontend presentation (React Native/Expo), state management (Convex backend), and cross-cutting infrastructure concerns (offline support, error handling, analytics).

**Key Characteristics:**
- **Feature-driven organization**: Core logic grouped in `/src/features/` with habit tracking as primary feature
- **Composable hooks pattern**: Complex state logic extracted into custom hooks (`useHabitsApp`, `useHabitsListState`, `useHabitMutations`)
- **Provider-based dependency injection**: Critical services (auth, sync, offline, network) exposed via React context
- **Convex-first data fetching**: Real-time database with built-in reactivity and offline support
- **Client-side optimization**: Offline queue, optimistic updates, and circuit breaker pattern for resilience

## Layers

**Presentation Layer:**
- Purpose: React components rendering UI for mobile and web
- Location: `src/components/`, `src/screens/`
- Contains: 99+ reusable components, 12 screen containers, modal overlays, animations
- Depends on: Hooks layer, theme system, utils
- Used by: App root and navigation

**State Management & Data Layer:**
- Purpose: Compose server queries, mutations, and client state into cohesive domains
- Location: `src/features/habits/hooks/` (feature-level hooks), `convex/` (backend)
- Contains: Custom hooks that combine Convex queries/mutations, local state, derived computations
- Depends on: Convex API, offline queue, context providers
- Used by: Presentation components

**Backend/Database Layer:**
- Purpose: Server-side logic, schema definition, real-time sync
- Location: `convex/` (server runtime and schema)
- Contains: Query/mutation definitions, analytics calculations, habit strength algorithms, webhook handlers
- Depends on: Clerk auth, scheduled functions, database schema
- Used by: Frontend via Convex client

**Infrastructure/Cross-Cutting:**
- Purpose: Handle offline support, error handling, monitoring, network status, validation
- Location: `src/lib/` (offline, sentry, performance, validation, apiError), `src/providers/`, `src/contexts/`
- Contains: Circuit breaker, retry strategies, offline queue manager, network status context, sync orchestrator
- Depends on: Native APIs, storage, network
- Used by: All layers

**Theme & Design System:**
- Purpose: Centralized styling, animations, colors, typography
- Location: `src/theme/`
- Contains: Color palettes (light/dark), animation timing, spacing tokens, typography definitions
- Depends on: React Native Paper, Reanimated
- Used by: All components

## Data Flow

**Habit Toggle Flow (Optimistic Update Pattern):**

1. User taps habit card → `HabitCard` component calls `handlePress`
2. `handlePress` triggers `useHabitMutations.toggleHabit()` mutation
3. Mutation enqueued in offline queue (`src/lib/offline/queue`) with optimistic state
4. Optimistic state reduces local habit list immediately
5. Queue processes: if connected, sends to Convex `habits.toggle` mutation
6. Server updates database, calculates new streak/strength
7. Convex query subscription updates real-time, syncing presentation
8. If offline, operation persists to async storage and retries on reconnect

**Real-time Synchronization:**
- Convex `useQuery()` subscriptions in hooks like `useHabitsListState` establish real-time listeners
- Database changes broadcast via Convex's reactive system
- `SyncStatusProvider` monitors sync state (idle, syncing, error) in `src/contexts/SyncStatusContext`
- Manual refresh via `NetworkStatusProvider` detects reconnection and triggers sync

**Error Handling Flow:**
- API/network errors caught by `src/lib/apiError/apiErrorHandling.ts`
- Error classification (network, auth, validation, server) determines retry strategy
- `CircuitBreaker` (in `src/lib/offline/circuitBreaker`) prevents hammering failed services
- If circuit open: operations fail fast; UI shows `OfflinePendingBanner`
- Offline queue persists operations; sync manager retries on circuit close

**State Management:**
- Global state: Auth (Clerk), subscription (from Convex), network status (OS APIs)
- Feature state: Habits list, modals, selection mode—managed in `useHabitsApp` composition hook
- Local state: Form inputs, animations, temporary UI state
- Derived state: Habit strength, streaks, analytics—computed in Convex queries and client hooks

## Key Abstractions

**useHabitsApp Hook:**
- Purpose: Single composition point orchestrating all habits screen state
- Examples: `src/features/habits/hooks/useHabitsApp.ts`
- Pattern: Combines `useHabitsListState` (data), `useHabitsModalsState` (overlays), notification routing
- Exports: `{ list, modals }` consumed by `HabitsAppContent`

**Offline Queue:**
- Purpose: Queue and retry habit operations (toggle, archive, remove) when disconnected
- Examples: `src/lib/offline/queueManager.ts`, `src/lib/offline/queue/index.ts`
- Pattern: Persistent queue with operation deduplication, batching, and exponential backoff
- API: `useOfflineQueue()` hook provides `enqueue()`, `process()`, `clear()` methods

**Error Boundary:**
- Purpose: Catch unhandled React errors and display fallback UI
- Examples: `src/components/ErrorBoundary/ErrorBoundary.tsx`, `ScreenErrorBoundary.tsx`
- Pattern: Class-based React boundary with retry capability and error logging to Sentry

**Provider Stack:**
- Purpose: Layer authentication, database, network, and offline support at app startup
- Examples: `src/app/AppProviders.tsx` (critical), `src/providers/LazyProviders.tsx` (non-critical)
- Pattern: Nested context providers with fallback UI for missing config

**Custom Hooks (Composition Pattern):**
- Purpose: Extract complex stateful logic from components
- Examples: `useHabitMutations`, `useHabitsListState`, `useOfflineQueue`, `useImageUpload`
- Pattern: Hooks combine Convex queries/mutations, local state, side effects; components remain presentational

## Entry Points

**App Root:**
- Location: `src/App.tsx`
- Triggers: Application startup (Expo/web)
- Responsibilities: Initialize monitoring, wrap app with providers, render AuthGate

**AuthGate:**
- Location: `src/components/auth/AuthGate.tsx`
- Triggers: After app initialization, when auth state changes
- Responsibilities: Route to Welcome (unauthenticated), Onboarding (first-time), or HabitsApp (authenticated)

**HabitsApp:**
- Location: `src/features/habits/HabitsApp.tsx`
- Triggers: User authenticated and onboarding complete
- Responsibilities: Orchestrate habits list, modals, bottom bar, overlays; compose state from hooks

**Main (Web Only):**
- Location: `src/main.tsx`
- Triggers: Web app entry via Vite
- Responsibilities: Render web-specific app via `renderWebApp()`

## Error Handling

**Strategy:** Multi-layered with error classification, retry logic, and user-facing fallbacks

**Patterns:**
- **Error Boundaries**: React class components catch rendering errors; show recovery UI with retry button
- **Try-catch in mutations**: Habit mutations catch errors, classify (network/auth/validation), update sync status
- **Circuit Breaker**: Prevents cascading failures when service is down; operations fail fast
- **Offline queue**: Persists failed operations; retries with exponential backoff on reconnect
- **Sync Status Context**: Tracks sync state (syncing/error/idle); UI components subscribe to show banners
- **Custom error alerts**: `errorAlerts.ts` shows toast/modal with user-friendly messages
- **Sentry integration**: Unhandled errors logged for monitoring; `SentryUserSync` provider tags errors with user ID

**Example Flow:**
- User toggles habit offline → operation queued
- User comes online → queue processes → mutation fails (e.g., timeout) → classified as network error
- If retries exhausted → Circuit breaker opens → UI shows `OfflinePendingBanner` with "Pending" status
- User waits → App detects reconnection → Circuit breaker closes → Queue resumes → Operation succeeds

## Cross-Cutting Concerns

**Logging:** Via Sentry for unhandled errors; local `__DEV__` console logs for development. Error boundaries log to Sentry and console.

**Validation:** Input validation in two places:
- Client-side: `src/utils/validation.ts` and `src/lib/validation/` for form inputs, habit data
- Server-side: `convex/habits/validation.ts` and `convex/lib/validation.ts` ensure data integrity

**Authentication:**
- Clerk (OAuth/email) handles user identity and token management
- Convex Clerk integration in `src/providers/ConvexClerk.provider.tsx` links sessions
- `api.users.getOrCreateUser` mutation syncs user to Convex on first sign-in
- All Convex queries/mutations require authenticated context

**Performance Monitoring:**
- `src/lib/performance/` provides instrumentation utilities
- React DevTools Profiler for component performance
- Bundle size tracking via `eslint --format json` analysis
- Max-lines rule enforces file size limits to prevent bloat

**Analytics:**
- `src/lib/analytics/` tracks user events (habit toggle, habit creation, screen views)
- Convex analytics tables store aggregated data
- `createHabitModalAnalytics` subcategory tracks habit creation workflows

---

*Architecture analysis: 2025-03-19*
