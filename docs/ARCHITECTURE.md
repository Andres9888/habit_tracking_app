# Architecture Documentation

This document provides an in-depth look at the Chain Day application's architecture, covering component hierarchy, state management, and data flow.

## Overview

Chain Day is a cross-platform habit tracking application built with React Native and Expo. The architecture follows a feature-based organization with clear separation between UI, business logic, and data layers.

```
┌─────────────────────────────────────────────────────────────┐
│                        App Entry                             │
│                        (main.tsx)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Providers Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ConvexClerkProvider│ │OfflineProvider  │ │ThemeProvider│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Contexts Layer                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │NetworkStatus │ │SyncStatus    │ │Performance           │ │
│  │Context       │ │Context       │ │Context               │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Screens Layer                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │Habits      │ │Analytics   │ │Character   │ │Settings  │ │
│  │Screen      │ │Screen      │ │Screen      │ │Screen    │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Components Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │HabitCard │ │Calendar  │ │Progress  │ │HabitForm       │  │
│  │          │ │Heatmap   │ │Ring      │ │                │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Hooks Layer                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │useHabits    │ │useHabit     │ │useOfflineQueue       │ │
│  │             │ │Strength     │ │                      │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Convex Backend                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │habits.ts │ │categories│ │analytics │ │subscriptions   │  │
│  │          │ │.ts       │ │.ts       │ │.ts             │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Screens

Screens are the top-level page components in the application:

| Screen | Path | Description |
|--------|------|-------------|
| Habits | `src/screens/HabitsScreen/` | Main habits list with chain visualization |
| Analytics | `src/screens/AnalyticsScreen/` | Habit analytics and trends |
| Character | `src/screens/CharacterScreen/` | Gamification screen with XP/levels |
| HabitDetail | `src/screens/HabitDetailScreen/` | Individual habit details |
| HabitEdit | `src/screens/HabitEditScreen/` | Create/edit habit form |
| Templates | `src/screens/TemplatesScreen/` | Habit templates library |
| Onboarding | `src/screens/onboarding/` | New user onboarding flow |
| Auth | `src/screens/auth/` | Authentication screens |

### Key Components

Components are organized by functionality:

#### Habit Display
- `DraggableHabit/` - Reorderable habit list item
- `HabitCard/` - Habit card with chain visualization
- `HabitCheckbox/` - Completion checkbox
- `ChainLinkIcon/` - Chain link visualization

#### Calendar & Progress
- `CalendarHeatmap/` - GitHub-style heatmap
- `CalendarTimeline/` - Horizontal timeline view
- `BinaryHeatmap/` - Binary completion view
- `DailyProgressRing/` - Daily completion progress
- `DailyMomentumMeter/` - Momentum visualization

#### Forms & Input
- `CreateHabitModal/` - New habit creation
- `EmojiPicker/` - Habit icon selection
- `CategoryChip/` - Category selection chips
- `DateSelector/` - Date range picker

#### Feedback
- `CompletionToast/` - Habit completion celebration
- `DeleteUndoToast/` - Undo delete action
- `ArchivedHabitsModal/` - View archived habits

## State Management

### Client State (React Context)

Client-side state that doesn't need server sync:

```typescript
// Network status
NetworkStatusContext: {
  isOnline: boolean
  isSyncEnabled: boolean
  lastSyncTime: Date | null
}

// Performance monitoring
PerformanceContext: {
  isMonitoring: boolean
  metrics: PerformanceMetrics
}

// Theme
ThemeContext: {
  colors: ColorPalette
  isDark: boolean
}
```

### Server State (Convex)

Most application state is managed through Convex:

```typescript
// Habits
const habits = useQuery(api.habits.list);
const habit = useQuery(api.hub.habits.get, { habitId });

// Mutations
const createHabit = useMutation(api.habits.create);
const toggleHabit = useMutation(api.habits.toggle);

// Subscriptions (real-time updates)
useEffect(() => {
  return api.habits.onUpdate(() => {
    // Handle real-time updates
  });
}, []);
```

### Offline State

Offline-first architecture with queue:

```typescript
// Offline queue stores mutations when offline
useOfflineQueue: {
  queue: OfflineAction[]
  processQueue: () => Promise<void>
  addToQueue: (action: OfflineAction) => void
}
```

## Data Flow

### Habit Completion Flow

```
User taps checkbox
       │
       ▼
┌──────────────────┐
│ useHabitMutation │
│  toggleHabit()   │
└──────────────────┘
       │
       ▼
   ┌───────┐    ┌─────────────┐
   │Online?│───▶│  Execute    │
   └───────┘    │  mutation   │
      │         └─────────────┘
      │ No
      ▼
┌──────────────────┐
│  Add to offline  │
│      queue       │
└──────────────────┘
       │
       ▼ (when online)
┌──────────────────┐
│  Process queue   │
│  sync mutations  │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Update UI via    │
│ Convex subscribe │
└──────────────────┘
```

### Data Relationships

```
User
  │
  ├── habits[]
  │     │
  │     ├── category (Category)
  │     │
  │     ├── completions[]
  │     │
  │     └── notes[]
  │
  ├── categories[]
  │
  ├── character (XP, level, achievements)
  │
  ├── subscriptions (RevenueCat)
  │
  └── settings
```

## Key Modules

### Habits Module (`src/features/habits/`)

The habits feature is the core of the application:

```
HabitsApp/
├── HabitsApp.tsx           # Main habits screen
├── useHabitsAppHandlers.ts # Business logic
└── tests/                  # Feature tests
```

**Responsibilities:**
- Display list of habits
- Handle habit creation/editing
- Manage habit completion
- Calculate streak and strength

### Hooks Organization

| Hook | Purpose |
|------|---------|
| `useHabitStrength.ts` | Calculate habit strength algorithm |
| `useOfflineQueue.ts` | Manage offline mutation queue |
| `useCelebrationHaptics.ts` | Haptic feedback on completion |
| `useMilestoneDetection.ts` | Detect streak milestones |
| `useDraftStorage.ts` | Save habit drafts locally |
| `useNotificationResponse.ts` | Handle notification taps |

### Backend Functions (Convex)

| Module | Functions |
|--------|-----------|
| `habits.ts` | CRUD for habits, completion toggle |
| `categories.ts` | Category management |
| `analytics.ts` | Analytics queries |
| `habitStrength.ts` | Strength calculation |
| `subscriptions.ts` | RevenueCat integration |
| `letters.ts` | Habit letters/notes |

## Performance Considerations

### Lazy Loading

- Modals are lazy-loaded to reduce initial bundle
- Heavy components loaded on-demand

### Query Optimization

- Convex queries use database indexes
- N+1 queries are avoided with proper joins
- Pagination for large lists

### Render Optimization

- `React.memo` for pure components
- `useMemo` for expensive computations
- `useCallback` for stable references

## Security

### Authentication

- Clerk handles all authentication
- Token refresh managed automatically
- Secure storage for tokens

### Data Security

- Convex handles data validation
- Input sanitization on all mutations
- Rate limiting on mutations

## Testing Architecture

### Unit Tests

- Hooks: `src/hooks/__tests__/`
- Utils: `src/utils/__tests__/`
- Theme: `src/theme/__tests__/`

### Integration Tests

- Contexts: `src/contexts/__tests__/`
- Features: `src/features/habits/tests/`

### E2E Tests

- Detox configuration in `.detoxrc.js`
- Test scenarios in `tests/`

See [TESTING.md](TESTING.md) for detailed testing guidelines.
