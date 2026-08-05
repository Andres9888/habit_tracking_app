# Codebase Structure

**Analysis Date:** 2025-03-19

## Directory Layout

```
phoenix/ (root)
├── src/                          # Frontend application code
│   ├── App.tsx                  # Root component, initializes monitoring and providers
│   ├── main.tsx                 # Web entry point (Vite)
│   ├── index.css                # Global styles
│   ├── app/                      # App initialization and configuration
│   │   ├── AppProviders.tsx     # Provider stack (Clerk, Convex, Paper, error boundary)
│   │   ├── web/                 # Web-specific initialization
│   │   └── initializeAppMonitoring.ts # Sentry and analytics setup
│   ├── components/              # 99+ reusable React components
│   │   ├── auth/               # AuthGate, WelcomeScreen components
│   │   ├── HabitCard/          # Habit list item component
│   │   ├── HabitDetailTabs/    # Detailed habit view tabs
│   │   ├── CreateHabitModal/   # Create/edit habit form
│   │   ├── ErrorBoundary/      # Error handling boundaries
│   │   ├── Modal/              # Modal/sheet components
│   │   ├── Button/             # Button variants
│   │   ├── animations/         # Reanimated animation definitions
│   │   ├── microinteractions/  # Haptic and micro-interaction utilities
│   │   ├── providers/          # Context providers (Purchases, StreakMilestone)
│   │   ├── ui/                 # Basic UI elements
│   │   └── [Component]/        # Individual component directories
│   ├── features/                # Feature modules with domain logic
│   │   └── habits/             # Core habit tracking feature
│   │       ├── HabitsApp.tsx   # Main habits screen orchestrator
│   │       ├── components/     # Feature-specific components
│   │       ├── hooks/          # Feature state management hooks
│   │       │   ├── useHabitsApp.ts          # Top-level composition
│   │       │   ├── useHabitsListState.ts    # List data and status
│   │       │   ├── useHabitsModalsState.ts  # Modal overlays
│   │       │   ├── useHabitMutations.ts     # Habit operations
│   │       │   └── useSelectionMode.ts      # Multi-select state
│   │       ├── tests/          # Feature-level tests
│   │       └── useHabitsAppHandlers.ts # Event handler logic
│   ├── screens/                 # Screen containers (navigation destinations)
│   │   ├── auth/               # WelcomeScreen, LoginScreen
│   │   ├── onboarding/         # OnboardingScreen, setup flow
│   │   ├── HabitDetailScreen/  # Habit details and analytics
│   │   ├── HabitEditScreen/    # Habit creation/editing
│   │   ├── AnalyticsScreen/    # Analytics dashboard
│   │   ├── CharacterScreen/    # Character/avatar screen
│   │   ├── TemplatesScreen/    # Habit template library
│   │   └── templates/          # Template selection flow
│   ├── hooks/                   # Global custom hooks
│   │   ├── useHabitStrength.ts          # Habit strength calculation
│   │   ├── useOfflineHabitMutations.ts  # Offline-enabled mutations
│   │   ├── useHapticFeedback.ts         # Haptic feedback control
│   │   ├── useCompletionSound.ts        # Sound effect playback
│   │   ├── useImageUpload.ts            # Image upload with retry
│   │   ├── useOfflineQueue/             # Offline queue integration
│   │   ├── useAudioPlayback/            # Audio playback hooks
│   │   ├── useAudioRecording/           # Audio recording hooks
│   │   ├── usePremium/                  # Premium subscription state
│   │   ├── useNotificationResponse.ts   # Push notification routing
│   │   ├── useMilestoneDetection.ts     # Milestone celebration triggers
│   │   └── [Hook]/                      # Other specialized hooks
│   ├── contexts/                # React context definitions
│   │   ├── NetworkStatusContext/        # Online/offline status
│   │   ├── SyncStatusContext/           # Database sync state
│   │   ├── PerformanceContext/          # Performance metrics
│   │   └── __tests__/                   # Context tests
│   ├── providers/               # Provider components
│   │   ├── AppProviders.tsx     # Critical provider stack
│   │   ├── LazyProviders.tsx    # Non-critical providers (lazy-loaded)
│   │   ├── ConvexClerk.provider.tsx    # Convex + Clerk integration
│   │   ├── SentryUserSync.tsx          # Error tracking initialization
│   │   └── OfflineProvider/            # Offline support provider
│   ├── lib/                     # Infrastructure and utilities
│   │   ├── offline/             # Offline queue and sync system
│   │   │   ├── queue/           # Queue data structures
│   │   │   ├── queueManager.ts  # Queue operations API
│   │   │   ├── errorClassifier.ts
│   │   │   ├── circuitBreaker.ts       # Failure prevention
│   │   │   ├── retryStrategy.ts        # Exponential backoff
│   │   │   ├── syncManager.ts          # Offline sync orchestration
│   │   │   ├── persistence.ts          # Queue persistence to storage
│   │   │   ├── hooks.ts                # useOfflineQueue hook
│   │   │   └── context.ts              # Provider and hooks
│   │   ├── sentry/              # Error tracking integration
│   │   ├── analytics/           # Event tracking utilities
│   │   ├── apiError/            # Error handling and classification
│   │   ├── appConfig/           # Environment configuration
│   │   ├── validation/          # Input validation schemas
│   │   ├── purchases/           # Revenue Cat integration
│   │   ├── performance/         # Performance monitoring
│   │   ├── settings/            # User settings management
│   │   ├── timing/              # Timing utilities
│   │   ├── optimistic/          # Optimistic update helpers
│   │   ├── apiErrorHandling.ts
│   │   ├── formInputSecurity.ts
│   │   ├── utils.ts             # Generic utilities
│   │   └── reactNativeUrlPolyfillAuto.js
│   ├── theme/                   # Design system
│   │   ├── index.ts             # Main theme export
│   │   ├── colors/              # Color definitions
│   │   ├── darkColors.ts        # Dark mode colors
│   │   ├── lightColors.ts       # Light mode colors
│   │   ├── animations.ts        # Reanimated animation configs
│   │   ├── spacing.ts           # Spacing tokens
│   │   ├── typography.ts        # Font sizes, weights
│   │   ├── iconSizes.ts         # Icon dimensions
│   │   ├── ThemeContext.tsx     # Theme provider
│   │   ├── milestone-colors.ts  # Milestone celebration colors
│   │   ├── settingsColors.ts    # Settings screen colors
│   │   └── README.md            # Theme documentation
│   ├── utils/                   # Utility functions and helpers
│   │   ├── habitCalculations.ts    # Habit math (streak, compliance)
│   │   ├── validation.ts           # Input validation
│   │   ├── dateUtils.ts            # Date calculations
│   │   ├── timezone.ts             # Timezone handling
│   │   ├── streak.ts               # Streak calculation
│   │   ├── storeReview.ts          # App store review integration
│   │   ├── recentEmojis.ts         # Emoji history
│   │   ├── reminderDefaults.ts      # Default reminder times
│   │   ├── animationHelpers.ts      # Animation utilities
│   │   ├── errorAlerts.ts           # User-facing error messages
│   │   ├── safeExternalUrl.ts       # URL validation
│   │   ├── getLocalDateString.ts    # Local date formatting
│   │   ├── calendarCollapsePreferences.ts
│   │   ├── animations/              # Animation utilities
│   │   ├── accessibility/           # Accessibility helpers
│   │   ├── dateFormatting/          # Date formatter variants
│   │   ├── trendCalculations/       # Trend analysis
│   │   ├── haptics/                 # Haptic feedback utilities
│   │   ├── notifications/           # Notification utilities
│   │   ├── storage/                 # Local storage wrappers
│   │   ├── emojiData/               # Emoji metadata
│   │   ├── emojiKeywords/           # Emoji search keywords
│   │   ├── exportData/              # Data export utilities
│   │   ├── createHabitModalAnalytics/ # Form analytics
│   │   ├── validation/              # Validation rules
│   │   └── __tests__/               # Utility tests
│   ├── types/                   # TypeScript type definitions
│   │   └── (domain types)
│   ├── constants/               # Constants
│   │   ├── (config values)
│   │   └── (feature flags)
│   └── vite-env.d.ts            # Vite environment types
│
├── convex/                      # Backend (Convex server)
│   ├── schema.ts                # Database schema definition
│   ├── router.ts                # HTTP router for webhooks
│   ├── auth.ts                  # Auth configuration
│   ├── auth.config.ts           # Clerk integration config
│   ├── http.ts                  # HTTP handler
│   ├── habits.ts                # Habit operations router
│   ├── habits/                  # Habit feature module
│   │   ├── create.ts            # Create habit mutation
│   │   ├── update.ts            # Update habit mutation
│   │   ├── toggle.ts            # Toggle habit completion
│   │   ├── pause.ts             # Pause habit mutation
│   │   ├── resume.ts            # Resume habit mutation
│   │   ├── archive.ts           # Archive habit mutation
│   │   ├── remove.ts            # Delete habit mutation
│   │   ├── reorder.ts           # Reorder habits mutation
│   │   ├── list.ts              # List habits query
│   │   ├── get.ts               # Get single habit query
│   │   ├── getTracking.ts        # Get habit tracking data
│   │   ├── stats.ts             # Habit statistics query
│   │   ├── types.ts             # Habit type definitions
│   │   ├── utils.ts             # Habit helper functions
│   │   ├── validation.ts         # Habit validation rules
│   │   ├── validators.ts         # Validation helper functions
│   │   ├── batchArchive.ts
│   │   ├── batchRemove.ts
│   │   └── (other operations)
│   ├── habitStrength/           # Habit strength algorithm
│   │   ├── habitStrength.ts     # Main calculation
│   │   ├── habitStrength.test.ts # Algorithm tests
│   │   └── (calculation modules)
│   ├── analytics/               # Analytics calculations
│   │   ├── analytics.ts         # Router
│   │   ├── analyticsOverview.ts # Overview stats query
│   │   ├── analyticsWeekly.ts   # Weekly insights query
│   │   ├── analyticsTrend.ts    # 30-day trend query
│   │   ├── analyticsCompliance.ts # Compliance metrics
│   │   └── analyticsDistribution.ts # Strength distribution
│   ├── templates/               # Habit template library
│   │   ├── templates.ts         # Router and mutations
│   │   ├── queries.ts           # Template queries
│   │   ├── templatesDataSeed.ts # Seeded templates
│   │   └── (template operations)
│   ├── tracking/                # Habit tracking entries
│   │   ├── tracking.ts          # Router
│   │   └── (tracking operations)
│   ├── subscriptions.ts         # Subscription/premium status
│   ├── settings.ts              # User settings
│   ├── categories.ts            # Habit categories
│   ├── users.ts                 # User management
│   ├── storage.ts               # File upload
│   ├── streakUtils/             # Streak calculation utilities
│   ├── webhooks/                # Webhook handlers (payments, events)
│   ├── lib/                     # Backend utilities
│   │   ├── validation.ts        # Validation helpers
│   │   ├── types.ts             # Shared types
│   │   └── (utility modules)
│   ├── config/                  # Configuration
│   ├── tsconfig.json
│   ├── _generated/              # Auto-generated Convex types
│   └── (other backend modules)
│
├── convex.json                  # Convex project configuration
├── convex-mcp-server.js         # MCP server for Convex integration
├── setup.mjs                    # Post-install configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App TypeScript config (stricter)
├── eslint.config.js             # ESLint rules and overrides
├── .prettierrc                  # Code formatting rules
├── biome.json                   # Biome configuration (if active)
├── jest.config.js               # Test runner configuration
├── expo.json                    # Expo project config
├── app.json                     # Expo app metadata
├── .env.example                 # Example environment variables
├── .detoxrc.js                  # E2E testing configuration
├── global.css                   # Global styles (imported by App.tsx)
├── vite.config.ts               # Vite bundler configuration (if used)
│
├── assets/                      # Static assets
├── android/                     # Android native code
├── ios/                         # iOS native code
├── web-bundles/                 # Pre-built web bundles
├── docs/                        # Documentation
├── tests/                       # E2E and integration tests
├── __tests__/                   # Unit tests
├── __mocks__/                   # Mock data and utilities
├── scripts/                     # Build and utility scripts
├── patches/                     # npm patch-package patches
├── .planning/                   # GSD planning documents
│   └── codebase/               # Architecture analysis documents
└── Plans/                       # Task Master task files
```

## Directory Purposes

**src/components/:**
- Purpose: Reusable presentational and container components
- Contains: 99+ React components organized by feature/category
- Key files: Component files (index.tsx, Component.tsx, Component.styles.ts, Component.hooks.ts)

**src/features/habits/:**
- Purpose: Core habit tracking domain with encapsulated logic and components
- Contains: HabitsApp screen, habit-specific components, state hooks, modals
- Key files: `HabitsApp.tsx` (orchestrator), hooks/ (state management), components/ (UI)

**src/hooks/:**
- Purpose: Global custom hooks for cross-cutting concerns
- Contains: Data fetching, device integration, offline support, animations
- Key files: `useHabitStrength.ts`, `useOfflineQueue/`, `useImageUpload.ts`

**src/screens/:**
- Purpose: Full-screen containers serving as navigation destinations
- Contains: Auth flow, onboarding, habit details, analytics, templates
- Key files: Screen root files (.tsx) with nested components/

**src/lib/offline/:**
- Purpose: Offline support infrastructure (queue, sync, retry, circuit breaker)
- Contains: Queue manager, sync orchestration, error classification, persistence
- Key files: `queue/`, `queueManager.ts`, `circuitBreaker.ts`, `retryStrategy.ts`

**src/lib/:**
- Purpose: Infrastructure utilities and integrations
- Contains: Analytics, error handling, validation, performance monitoring, app config
- Key files: Feature-specific folders (sentry, purchases, performance, validation, appConfig)

**src/theme/:**
- Purpose: Centralized design system (colors, typography, spacing, animations)
- Contains: Light/dark mode palettes, Reanimated animation configs, spacing tokens
- Key files: `index.ts` (main theme), `colors/`, `animations.ts`, `typography.ts`

**src/utils/:**
- Purpose: Pure utility functions and helpers (non-UI logic)
- Contains: Habit calculations, date utils, validation rules, animations
- Key files: `habitCalculations.ts`, `dateUtils.ts`, `validation.ts`, `streak.ts`

**src/contexts/:**
- Purpose: React context providers for shared state
- Contains: Network status, sync status, performance metrics
- Key files: `NetworkStatusContext/`, `SyncStatusContext/`, `PerformanceContext/`

**src/providers/:**
- Purpose: Provider component wrappers and initialization
- Contains: App provider stack, lazy-loaded providers, Clerk-Convex integration
- Key files: `AppProviders.tsx`, `LazyProviders.tsx`, `ConvexClerk.provider.tsx`

**convex/:**
- Purpose: Backend runtime and database schema
- Contains: Queries/mutations, schema, algorithms, webhooks
- Key files: `schema.ts` (database), `habits/` (core domain), `analytics/` (calculations)

**convex/habits/:**
- Purpose: Habit domain logic on the backend
- Contains: CRUD operations, validation, business logic
- Key files: `create.ts`, `toggle.ts`, `update.ts`, `archive.ts`, `validation.ts`

**convex/habitStrength/:**
- Purpose: Habit strength algorithm implementation
- Contains: Memory accessibility system (Tobias 2009), calculations, tests
- Key files: `habitStrength.ts`, `habitStrength.test.ts`

## Key File Locations

**Entry Points:**
- `src/App.tsx`: Root component with initialization
- `src/main.tsx`: Web entry point for Vite
- `convex/schema.ts`: Database schema definition
- `convex/router.ts`: HTTP request routing

**Configuration:**
- `package.json`: Scripts and dependencies
- `tsconfig.json` / `tsconfig.app.json`: TypeScript settings
- `eslint.config.js`: Linting rules (max-lines enforcement at 100 lines)
- `.prettierrc`: Code formatting (Prettier)
- `convex.json`: Convex project settings

**Core Logic:**
- `src/features/habits/HabitsApp.tsx`: Main habits screen
- `src/features/habits/hooks/useHabitsApp.ts`: State composition
- `src/lib/offline/queueManager.ts`: Offline queue operations
- `convex/habits/`: Habit mutations and queries

**Testing:**
- `jest.config.js`: Jest test runner configuration
- `__tests__/`: Test files (co-located or separate)
- `.test.ts` / `.test.tsx` files: Component and function tests

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `HabitCard.tsx`, `CreateHabitModal.tsx`)
- Hooks: `camelCase.ts` (e.g., `useHabitsApp.ts`, `useOfflineQueue.ts`)
- Types: `*.types.ts` (e.g., `habit.types.ts`)
- Styles: `*.styles.ts` (e.g., `HabitCard.styles.ts`)
- Sub-hooks: `*.hooks.ts` (e.g., `HabitCard.hooks.ts`)
- Tests: `*.test.ts` / `*.test.tsx` (e.g., `HabitCard.test.tsx`)
- Utils: `camelCase.ts` (e.g., `dateUtils.ts`, `habitCalculations.ts`)

**Directories:**
- Components: `PascalCase/` (e.g., `HabitCard/`, `CreateHabitModal/`)
- Features: `lowercase/` (e.g., `habits/`)
- Utilities: `camelCase/` (e.g., `offline/`, `haptics/`)
- Hooks: `camelCase/` (e.g., `useOfflineQueue/`)
- Tests: `__tests__/` or `tests/` at appropriate level

**Exports:**
- Barrel files: `index.ts` exports main module; `index.tsx` exports React components
- Named exports: Specific functionality exported by name (prefer over default)

## Where to Add New Code

**New Feature:**
- Primary code: `src/features/[featureName]/`
- Screen: `src/screens/[FeatureName]Screen/`
- Tests: `src/features/[featureName]/tests/` or `__tests__/`
- Backend: `convex/[featureName]/` (queries, mutations, types)

**New Component/Module:**
- Implementation: `src/components/[ComponentName]/` (if generic) or `src/features/[feature]/components/` (if feature-specific)
- Style extraction: `[ComponentName].styles.ts` if >20 lines
- Hook extraction: `[ComponentName].hooks.ts` if stateful logic >30 lines
- Tests: `[ComponentName].test.tsx` (co-located)

**Utilities:**
- Pure functions: `src/utils/[domain]/` (e.g., `dateUtils.ts`, `validation/`)
- Infrastructure: `src/lib/[concern]/` (e.g., `offline/`, `sentry/`, `analytics/`)
- Hooks: `src/hooks/` (if global) or `[feature]/hooks/` (if feature-specific)

**Database Operations:**
- Schema changes: `convex/schema.ts`
- Queries: `convex/[domain]/queries.ts` or exported as named functions
- Mutations: `convex/[domain]/` with individual files (create.ts, update.ts, etc.)
- Validation: `convex/[domain]/validation.ts`

## Special Directories

**src/.planning/codebase/:**
- Purpose: Architecture and structure documentation for GSD (Global Software Development)
- Generated: Yes (by GSD mapper)
- Committed: Yes (part of git repo)
- Files: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

**convex/_generated/:**
- Purpose: Auto-generated types and API client from Convex schema
- Generated: Yes (by `convex codegen`)
- Committed: Yes (included in git)
- Manual editing: No—regenerate when schema changes

**__tests__/ and __mocks__/:**
- Purpose: Test files and mock data
- Generated: No (manually written)
- Committed: Yes
- Organization: Mirror src/ structure

**assets/:**
- Purpose: Static images, icons, fonts
- Generated: No
- Committed: Yes

**scripts/:**
- Purpose: Build, setup, and utility scripts
- Generated: No
- Committed: Yes
- Examples: `expo-start.sh`, `export-env.sh`, `security-gitleaks.sh`

---

*Structure analysis: 2025-03-19*
