# Plan: Add Compact View Setting + Compact Habit Cards

## Context

User wants a compact view mode for habit cards, toggled via a setting in the Settings screen. Currently, habit cards show full detail: icon, title, phase tag, best-streak subtitle, strength progress bar, 7-day chain visualizer, and week complete badge. A compact mode will condense the cards to show only essential info, allowing users to see more habits on screen at once.

Some groundwork already exists: `isCompact`/`onChangeCompact` in SettingsModal types, and `isCompactMode` in DraggableHabit types. But **none** of the backend (schema, validators, defaults, sanitizer) or UI logic is wired up.

## Changes

### 1. Backend — Add `compactView` setting to Convex

**`convex/settings/types.ts`** — Add `compactView: false` to `DEFAULT_SETTINGS`

**`convex/schema.ts`** — Add `compactView: v.optional(v.boolean())` to `userSettings` table

**`convex/settings/validators.ts`** — Add `compactView: v.boolean()` to `settingsReturnValidator` and `compactView: v.optional(v.boolean())` to `updateArgsValidator`

**`src/lib/settings/sanitizeSettingsPayload.ts`** — Add boolean check for `compactView`

### 2. Settings UI — Add toggle in Preferences section

**`src/theme/settingsColors.ts`** — Add `compact` icon color entry (both light & dark), add to `SettingsColors` interface

**`src/components/SettingsModal/SettingsModal.hooks.ts`** — Add `compactView` state + setter + sync from `settingsDocument`, expose in return value

**`src/components/SettingsModal/types.ts`** — Update `SettingsContentProps` to include `compactView` + `onChangeCompactView` (existing `isCompact`/`onChangeCompact` props in SettingsModalProps are already there)

**`src/components/SettingsModal/SettingsContent.tsx`** — Add a `SettingsRow` toggle for "Compact habit cards" with subtitle "Show smaller cards to fit more on screen" in the Preferences section. Use `Minimize2` or `Rows3` icon from lucide-react-native.

**`src/components/SettingsModal/SettingsModal.tsx`** — Pass `compactView` and `setCompactView` from hooks to `SettingsContent`

**`src/features/habits/components/HabitsModals/SettingsModalSection.tsx`** — Pass compact state through to `SettingsModal`

### 3. Thread setting to habit cards

**`src/features/habits/hooks/useHabitsListState.ts`** — Read `compactView` from settings query (like `dayShape`), expose in return value

**`src/features/habits/hooks/useHabitRenderItem.tsx`** + **`useHabitRenderItem.types.ts`** — Accept & pass `isCompactMode`

**`src/features/habits/hooks/HabitRenderContent.tsx`** — Accept & pass `isCompactMode` to `DraggableHabit`, reduce bottom margin when compact (`mb-2` instead of `mb-5`)

### 4. Compact card rendering

**`src/components/DraggableHabit/DraggableHabit.tsx`** — Destructure `isCompactMode` from props, pass to `DraggableHabitCard`

**`src/components/DraggableHabit/DraggableHabitCard.types.ts`** — Add `isCompactMode?: boolean` to props

**`src/components/DraggableHabit/DraggableHabitCard.tsx`** — Pass `isCompactMode` through to `CardContent`

**`src/components/DraggableHabit/CardContent.tsx`** — When `isCompactMode`:
- Hide `NewRecordBadge`
- Hide `StrengthProgressBar` (show thin divider instead)
- Hide `WeekCompleteIndicator`
- Reduce padding: `pt-3` instead of `pt-4`, `pb-3 pl-3 pr-4` instead of `pb-5 pl-3 pr-4`

**`src/components/DraggableHabit/CardHeader.tsx`** — When `isCompactMode`:
- Hide best-streak subtitle
- Use smaller icon: `h-7 w-7` instead of `h-9 w-9`, smaller emoji `text-[18px]` instead of `text-[22px]`
- Reduce bottom margin: `mb-2` instead of `mb-3`

## Key Files (in order of modification)

1. `convex/settings/types.ts`
2. `convex/schema.ts`
3. `convex/settings/validators.ts`
4. `src/lib/settings/sanitizeSettingsPayload.ts`
5. `src/theme/settingsColors.ts`
6. `src/components/SettingsModal/SettingsModal.hooks.ts`
7. `src/components/SettingsModal/types.ts`
8. `src/components/SettingsModal/SettingsContent.tsx`
9. `src/components/SettingsModal/SettingsModal.tsx`
10. `src/features/habits/components/HabitsModals/SettingsModalSection.tsx`
11. `src/features/habits/hooks/useHabitsListState.ts`
12. `src/features/habits/hooks/useHabitRenderItem.types.ts`
13. `src/features/habits/hooks/useHabitRenderItem.tsx`
14. `src/features/habits/hooks/HabitRenderContent.tsx`
15. `src/components/DraggableHabit/DraggableHabit.tsx`
16. `src/components/DraggableHabit/DraggableHabitCard.types.ts`
17. `src/components/DraggableHabit/DraggableHabitCard.tsx`
18. `src/components/DraggableHabit/CardContent.tsx`
19. `src/components/DraggableHabit/CardHeader.tsx`

## Reuse

- Follow the exact same pattern as `showGradientFill` or `dayShape` for wiring a boolean setting end-to-end
- Reuse existing `SettingsRow` component with `type='toggle'`
- Reuse `isValidBoolean` helper in sanitizer
- Existing `isCompactMode` prop in `DraggableHabitProps` (types.ts:67) — already defined, just not wired

## Verification

1. `npx convex dev` — Confirm schema migration succeeds
2. Toggle "Compact habit cards" in Settings — confirm it persists across app restarts
3. Visually verify compact cards: smaller icon, no progress bar, no best streak, no week badge, tighter padding
4. Visually verify standard cards: unchanged behavior when compact is off
5. `npm run lint:max-lines` — Confirm no new violations
