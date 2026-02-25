# Performance Game Plan

## Codebase Profile

- **Language/Framework:** TypeScript + React Native (Expo), React, Convex backend
- **Size:** ~3,017 app source files under `src` plus ~165 backend files under `convex`; no prior LOOP game plan exists for this loop.
- **Key Directories:** `src` (features, screens, components, hooks, lib, contexts, providers, theme), `convex` (backend modules and schema), `tests/performance`, `Auto Run Docs`
- **Performance Libraries:** `react-native-reanimated`, `react-native-gesture-handler`, `react-native-draggable-flatlist`, `@sentry/react-native`, existing in-repo performance utilities (`FrameMonitor`, `RenderTracker`, `MemoryMonitor`, `PerformanceContext`, `trackedFetch`), `perf:budget` config in `performance.budget.json`

## Investigation Tactics

### [EXECUTED] Tactic 1: Startup and provider initialization bottlenecks

- **Target:** Identify slow app launch paths and critical rendering blockers.
- **Search Pattern:** `registerRootComponent`, `App.tsx`, `setTimeout`, `requestIdleCallback`, non-lazy provider composition, provider-level `useEffect` chains, large top-level imports, `await` in module scope.
- **Files to Check:** `src/index.ts`, `src/App.tsx`, `src/features/habits/HabitsApp.tsx`, `src/providers`, `src/components/auth/AuthGate.tsx`, `src/lib/performance`.
- **Why It Matters:** Startup and critical render path latency directly affect perceived responsiveness and first interaction delay.

### [EXECUTED] Tactic 2: Long-list rendering and re-render cascade risk

- **Target:** Detect list rendering hotspots, excessive render churn, and missing memoization in habit list/modals.
- **Search Pattern:** `FlatList`, `DraggableFlatList`, `renderItem`, `keyExtractor`, `memo`, `useMemo`, `useCallback`, `useRef`, inline render closures passed into list renderers.
- **Files to Check:** `src/features/habits/components/HabitsList/**/*`, `src/features/habits/components/Habit*`, `src/components/*`, `src/screens/*`.
- **Why It Matters:** This area drives most UI frame-time cost and can regress FPS when habit counts grow.

### [EXECUTED] Tactic 3: Convex query/mutation hot paths and sort/filter behavior

- **Target:** Find inefficient server query patterns and full scans that can increase response latency.
- **Search Pattern:** Convex handlers with `.collect()`, `.filter()`/`.sort()` after `query()`, missing `.withIndex()` usage, repeated aggregation loops, heavy object-shape transforms.
- **Files to Check:** `convex/**/*.ts`, especially `convex/schema.ts`, `convex/habits/*.ts`, `convex/tracking/*.ts`, `convex/analytics/*.ts`.
- **Why It Matters:** Backend overfetch and per-request post-processing add tail latency and increase network time for every render sync path.

### Tactic 4: Offline queue/state churn and persistence I/O

- **Target:** Evaluate offline synchronization scaling and local storage overhead.
- **Search Pattern:** `enqueue`, `dequeue`, `loadQueueItem`, `loadAllQueueItems`, `setInterval`, `setTimeout`, `getItem`, `setItem`, `AsyncStorage`, `SecureStore`, `Convex` sync orchestrator calls.
- **Files to Check:** `src/lib/offline/**/*`, `src/hooks/useOfflineQueue/**/*`, `src/hooks/useOffline*`, `src/lib/optimistic/**/*`.
- **Why It Matters:** Large queues and repeated persistence calls increase memory usage and battery/network impact in background/low-connectivity periods.

### Tactic 5: Static payload and asset size checks

- **Target:** Detect large local data that inflate startup cost and memory footprint.
- **Search Pattern:** very large static modules/imports, large arrays/objects in constants, `assets` growth, preloaded datasets, seed payload ingestion.
- **Files to Check:** `src/utils/emojiData/categories.ts`, `convex/templatesDataSeed.ts`, `assets/**/*`, `web-bundles`, `website/public`.
- **Why It Matters:** Large in-memory constants and bundled data can inflate JS startup, memory, and transfer size on web.

### Tactic 6: Network call fan-out and duplicate request patterns

- **Target:** Find duplicate fetches, missing cache, and retry churn in client-server interaction.
- **Search Pattern:** `trackedFetch`, direct `fetch(` usage, clustered Convex queries in same render path, repeated `useMutation`/`useQuery` calls without debounce/coalescing.
- **Files to Check:** `src/lib/performance/trackedFetch.ts`, `src/lib/offline/sync/**/*`, `src/screens/**/*`, `src/hooks/**/*`, `src/features/**/*`.
- **Why It Matters:** Redundant network calls increase latency, slow initial data load, and can trigger rate-limits in poor connectivity.

### Tactic 7: Event handler cleanup, timers, and subscription leaks

- **Target:** Find subscriptions/listeners/timers that linger past component lifecycle.
- **Search Pattern:** `addEventListener`, `addListener`, `subscribe`, `setInterval`, `requestAnimationFrame`, `useEffect` with missing cleanup, `useSyncExternalStore`.
- **Files to Check:** `src/lib/performance`, `src/contexts/PerformanceContext/**/*`, `src/hooks/performance/**/*`, `src/providers/**/*`.
- **Why It Matters:** Unreleased observers and timers are a common source of memory growth and background CPU drain.
