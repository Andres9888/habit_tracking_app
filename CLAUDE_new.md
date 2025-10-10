# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform habit tracking application built with React Native (Expo), TypeScript, and Convex as the backend. The app features streak tracking, calendar views, drag-and-drop reordering, and real-time synchronization across web and mobile platforms.

**Tech Stack:**
- **Frontend:** React Native (Expo SDK ~54), React 19.1, TypeScript
- **Backend:** Convex (realtime backend with database, functions, and auth)
- **UI Libraries:** React Native Paper, Tailwind (via NativeWind for web)
- **State Management:** Convex reactive queries
- **Mobile:** Expo for iOS/Android, React Native Web for web platform

## Development Commands

### Core Development
```bash
# Start development (initializes Convex + runs frontend and backend in parallel)
npm run dev

# Start frontend only (web via Vite)
npm run dev:frontend

# Start Convex backend only
npm run dev:backend

# Start Expo mobile development
npm run expo:start
npm run expo:ios      # iOS simulator
npm run expo:android  # Android emulator
```

### Testing & Quality
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Type checking and linting (validates TypeScript + builds with Vite)
npm run lint
```

### Deployment
```bash
# Deploy Convex backend to production
npm run deploy

# Deploy to preview environment
npm run deploy:preview

# Build native apps (requires EAS CLI setup)
npx expo run:android
npx expo run:ios
```

### MCP Integration
```bash
# Start Convex MCP server (for Claude Code integration)
npm run mcp
```

## Architecture

### Project Structure
```
habit_tracking_app/
├── src/                          # Frontend source code
│   ├── screens/auth/            # Authentication screens (Welcome, SignIn, SignUp)
│   ├── components/              # Reusable UI components
│   │   ├── DraggableHabit.tsx  # Drag-and-drop habit card
│   │   ├── HabitCalendarView.tsx
│   │   ├── StreakChain.tsx
│   │   └── ...
│   ├── App.tsx                  # Main app component with habit list
│   └── main.tsx                 # Web entry point
├── convex/                       # Backend (Convex functions & schema)
│   ├── schema.ts                # Database schema definition
│   ├── habits.ts                # Habit CRUD operations
│   ├── auth.ts, auth.config.ts  # Authentication setup
│   ├── settings.ts              # User settings management
│   └── http.ts                  # HTTP endpoints/router
├── app.json                      # Expo configuration
├── vite.config.ts               # Vite config (web builds)
└── jest.config.js               # Test configuration
```

### Database Schema (Convex)

The app uses 4 main tables defined in `convex/schema.ts`:

**habits**
- Core habit information: name, notes, createdAt, order
- Optional fields: tags, archived, archivedAt
- Calculated fields (not stored): consecutiveDays, strength, totalCompletions, totalMisses
- Used for: storing habit definitions

**tracking**
- Records daily completions: habitId, date (YYYY-MM-DD), completed (boolean)
- Index: `by_habit_and_date` for efficient querying
- Used for: tracking which habits were completed on which days

**userSettings**
- User preferences: showStreaks, showConsistency, showMotivationalMessages, etc.
- catTheme, darkMode toggles
- Used for: personalizing the user experience

**articles**
- Content system: title, content, category
- Index: `by_category`
- Used for: storing motivational/educational content

### Key Convex Functions (convex/habits.ts)

**Mutations:**
- `create({ name, notes })` - Create new habit, returns habit ID
- `updateNotes({ habitId, notes })` - Update habit notes
- `archive({ habitId })` - Soft delete (mark as archived)
- `unarchive({ habitId })` - Restore archived habit
- `remove({ habitId })` - Permanently delete with tracking data
- `restore({ habitData, trackingData })` - Undo deletion
- `toggleHabit({ habitId, date })` - Toggle completion for a specific date
  - **Important:** Only allows today or past dates (blocks future dates)
  - Creates tracking entry if none exists, toggles if exists

**Queries:**
- `list()` - Get all non-archived habits
- `listArchived()` - Get archived habits
- `getTracking({ dates })` - Fetch completion data for date range
  - Optimized to query a range and filter to requested dates
- `getStats({ habitId })` - Calculate streak and 30-day consistency percentage

### Frontend Architecture

**Main App Flow (src/App.tsx):**
1. Loads habits via `useQuery(api.habits.list)`
2. Loads tracking data for 5-day window (4 days ago to today)
3. Calculates habit status for each day: `"done"`, `"missed"`, or `"planned"`
4. Renders draggable habit cards with week view
5. Handles habit creation, editing, and status toggling

**Drag-and-Drop (src/components/DraggableHabit.tsx):**
- Uses `react-native-draggable-flatlist` for reordering
- Maintains local order state in App.tsx
- TODO: Implement `reorderHabits` mutation in Convex backend

**Cross-Platform Rendering:**
- React Native components used throughout (View, Text, Pressable, etc.)
- `react-native-web` aliased in vite.config.ts for web platform
- File resolution prioritizes `.web.*` extensions for web-specific code

### Authentication

The app uses `@convex-dev/auth` with configuration in:
- `convex/auth.config.ts` - Auth provider setup
- `convex/auth.ts` - Auth implementation
- `src/screens/auth/` - UI screens for sign-in/sign-up

## Development Guidelines

### Convex Function Development

**Always use new function syntax:**
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { habitId: v.id("habits") },
  returns: v.object({ name: v.string() }),
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    return { name: habit?.name ?? "Unknown" };
  },
});
```

**Key rules from .cursor/rules/convex_rules.mdc:**
- ALWAYS include `args` and `returns` validators
- Use `v.null()` for functions that don't return a value
- Use `v.id(tableName)` for ID types, not `v.string()`
- Define indexes in schema with descriptive names (e.g., `by_habit_and_date`)
- Use `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction` with function references from `api` or `internal`

### Testing

The project uses Jest with React Native preset:
- Test files: `**/__tests__/**/*.test.[jt]s?(x)` or `**/*.test.[jt]s?(x)`
- Setup file: `jest.setup.js`
- Coverage: Collects from all `.ts/.tsx` files except `node_modules` and `.d.ts`

### TypeScript Configuration

- Extends `expo/tsconfig.base`
- Strict mode enabled
- Module resolution: `bundler`
- JSX: `react-jsx`

### Date Handling

**CRITICAL:** The app uses local timezone date strings in `YYYY-MM-DD` format:
- Dates are stored as strings (e.g., `"2025-10-10"`)
- When parsing, construct `new Date(year, month - 1, day)` to avoid UTC shifting
- See `getHabitStatus()` in App.tsx:596-77 for reference implementation

### Styling

- React Native StyleSheet API used throughout
- Tailwind available for web via postcss/tailwind.config.js
- Design uses rounded corners (24-28px), soft shadows, and clean typography
- Color palette: slate grays (#64748b, #e2e8f0) with dark text (#0f172a)

## Common Patterns

### Adding a New Habit Feature

1. **Update Schema** (`convex/schema.ts`)
   - Add new field to habits table validator
   ```typescript
   defineTable({
     // existing fields...
     newField: v.optional(v.string()),
   })
   ```

2. **Create/Update Mutation** (`convex/habits.ts`)
   ```typescript
   export const updateNewField = mutation({
     args: { habitId: v.id("habits"), newField: v.string() },
     returns: v.null(),
     handler: async (ctx, args) => {
       await ctx.db.patch(args.habitId, { newField: args.newField });
       return null;
     },
   });
   ```

3. **Update UI** (`src/App.tsx` or components)
   - Use `useMutation(api.habits.updateNewField)` hook
   - Add UI controls and state management

### Querying with Date Ranges

```typescript
// In Convex function
const tracking = await ctx.db
  .query("tracking")
  .filter((q) =>
    q.and(
      q.gte(q.field("date"), startDate),
      q.lte(q.field("date"), endDate)
    )
  )
  .collect();
```

### Calculating Streaks

See `getStats` query in convex/habits.ts:272-315 for reference implementation of:
- Current streak (consecutive days from today backward)
- 30-day consistency percentage

## Known TODOs

- [ ] Implement `reorderHabits` mutation in convex/habits.ts for drag-and-drop persistence (App.tsx:100)
- [ ] Complete DraggableHabit component integration with missing handler functions
- [ ] Add habit editing functionality (updateName mutation exists but UI incomplete)

## Platform-Specific Notes

### Web (Vite)
- Entry: `src/main.tsx`
- Alias: `react-native` → `react-native-web`
- File priority: `.web.tsx` > `.tsx`

### Mobile (Expo)
- Entry: `app.json` specifies "main": "expo/AppEntry.js"
- SDK: ~54.0.11
- Native modules: expo-haptics, expo-linear-gradient, gesture-handler

### iOS Build Dependencies
The iOS build process explicitly depends on `@convex-dev/auth` (see git log at cfeb0ce).

## External Integrations

### Convex MCP Server
The project includes MCP integration for Claude Code via `npm run mcp`. This provides:
- Direct access to Convex functions and data
- Schema inspection and validation
- Real-time backend testing from Claude Code

### Task Master
The codebase includes Task Master AI for project management (see `.taskmaster/` directory and related CLAUDE.md files). This is a separate workflow tool and not part of the habit tracking app itself.
