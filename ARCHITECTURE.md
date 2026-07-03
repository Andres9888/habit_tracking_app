# Architecture

This document provides an overview of the Chain Day application architecture.

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk + Apple/Google Sign-In
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: react-native-reanimated v4
- **State Management**: React Context + Convex queries/mutations

## Project Structure

```
src/
├── components/     # Reusable UI components
├── constants/     # App-wide constants
├── contexts/      # React Context providers
├── features/      # Feature-based modules
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── providers/     # Global providers
├── screens/       # Screen components
├── theme/         # Design system (colors, typography, spacing)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

### Key Directories

- **`components/`**: 100+ reusable components organized by feature (HabitsList, CreateHabitModal, CharacterScreen, etc.)
- **`convex/`**: Backend functions (schema, queries, mutations, scheduled tasks)
- **`hooks/`**: Custom hooks for business logic (useHabits, useAuth, useTheme, etc.)
- **`theme/`**: Design tokens following 34/22/17/13 typography scale and consistent color system
- **`utils/`**: Helper functions for dates, formatting, calculations

## Data Flow

1. **User Actions** → React Components
2. **Components** → Convex Mutations/Queries
3. **Convex** → Real-time Database (persisted)
4. **Updates** → Automatic re-render via React Query-like hooks

## Backend: Data Model & API (Convex)

The backend lives in `convex/`. Each file is a module of queries/mutations/actions;
`schema.ts` defines the tables. This is the surface an agent must understand before
changing data logic.

### Tables (`convex/schema.ts`)

| Table                         | Purpose                                                                                                            | Key fields                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `habits`                      | Core habit definitions                                                                                             | `createdAt`, `currentStreak`, `bestStreak`, `archived`, strength (`strength*`) and cue (`cue*`) fields; `accessibility*` = dormant Memory Accessibility system |
| `tracking`                    | Per-day completion log                                                                                             | `habitId`, `date` (YYYY-MM-DD string), `completed`, `minutes`, `userId`                                                                                        |
| `deletedHabits`               | Soft-delete tombstones for undo/restore                                                                            | mirror of `habits`                                                                                                                                             |
| `users` / `userSettings`      | Profile + per-user preferences                                                                                     | `darkMode`, `dayShape`, `habitCompletionIcon`, sounds, theme                                                                                                   |
| `subscriptions`               | RevenueCat entitlement state (webhook-driven)                                                                      | `clerkId`, `status`, `planType`, `lastWebhookEventId` (idempotency)                                                                                            |
| `templates` / `templateUsage` | Prebuilt habit library + usage stats (categories are validators/functions in `templateCategories.ts`, not a table) | —                                                                                                                                                              |
| `rateLimits`                  | Per-user/action rate limiting                                                                                      | —                                                                                                                                                              |

### Function modules (`convex/*.ts`)

| Domain                                 | Files                                                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Habits & tracking                      | `habits.ts`, `tracking.ts`, `streakUtils.ts`                                                                                            |
| Habit strength (momentum formula v2.0) | `habitStrength.ts` → `habitStrength/{momentum,algorithmConfig,strengthLevel,dateUtils}.ts`                                              |
| Analytics                              | `analytics.ts`, `analyticsOverview.ts`, `analyticsTrend.ts`, `analyticsWeekly.ts`, `analyticsDistribution.ts`, `analyticsCompliance.ts` |
| Templates                              | `templates.ts`, `templateCategories.ts`, `categories.ts`, `templatesDataSeed.ts`                                                        |
| Users & settings                       | `users.ts`, `usersProfileImage.ts`, `settings.ts`                                                                                       |
| Monetization                           | `subscriptions.ts` (RevenueCat webhook → `http.ts`/`router.ts`)                                                                         |
| Auth                                   | `auth.ts`, `auth.config.ts` (Clerk → Convex)                                                                                            |
| Storage                                | `storage.ts`, `storageValidation.ts`                                                                                                    |
| Scheduled                              | `crons.ts`                                                                                                                              |

> **Strength invariant:** the `balanced` config (`algorithmConfig.ts`) is
> `growthRate: 0.03`, `baseDecay: 0.02`. On completion strength grows by
> `growthRate × (100 − strength)`; on a miss it decays by `× (1 − baseDecay)`.
> These constants drive `habitStrength.test.ts` — update both together.

> **Premium invariant:** `hasPremium` is webhook-only. Never accept entitlement
> fields in a public mutation's args (mass-assignment self-grant).

## Authentication Flow

1. User signs in via Clerk (web) or Apple/Google (mobile)
2. Clerk token exchanged for Convex session
3. All data operations authenticated via Convex auth

## Offline Support

- AsyncStorage for local habit cache
- Background sync when online
- Conflict resolution via server timestamp

## Design System

- **Typography**: 34/22/17/13 (display/title/body/caption)
- **Colors**: Semantic naming (primary-500, surface-100, etc.)
- **Animation**: Spring physics (damping: 18, stiffness: 180)
- **Border Radius**: 16px cards, 12px buttons
