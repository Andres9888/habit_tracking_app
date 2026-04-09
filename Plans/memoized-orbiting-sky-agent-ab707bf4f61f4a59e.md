# Implementation Plan: Collapsible Accordion Sections for Settings Page

## Overview

Add collapsible accordion behavior to the 6 collapsible `SettingsSection` groups on the Settings page, with animated expand/collapse, persisted state in AsyncStorage, and full accessibility support. The existing `useExpandAnimation` hook from `StreakRecordsAccordion` provides the animation pattern to generalize.

---

## Architecture Decisions

### 1. Promote `useExpandAnimation` to a shared hook

The existing `useExpandAnimation.ts` in `StreakRecordsAccordion/` is tightly coupled only through its import of `ANIMATION_DURATION` from a local constants file. The logic itself is fully generic. Rather than duplicating it, we will:

- Create a new shared hook at `src/hooks/useExpandAnimation.ts` that is a generalized copy.
- Update `StreakRecordsAccordion/useStreakAccordionState.ts` to import from the shared location.
- Delete the local `StreakRecordsAccordion/useExpandAnimation.ts`.

### 2. Enhance `SettingsSection` into a collapsible component

Rather than creating a separate wrapper, we will add an optional `collapsible` prop to `SettingsSection`. When `collapsible` is falsy (or omitted), the component behaves exactly as today — a static card container. When `collapsible` is true, the header becomes pressable with a chevron and the children animate in/out.

This is cleaner than a wrapper approach because:
- `AppActions` and `AboutLegalSection` already render `SettingsSection` internally, so a wrapper would require changes to their internals anyway.
- A single component avoids an extra layer of nesting.

However, the 100-line limit means `SettingsSection` itself cannot contain all the accordion logic inline. We will decompose it:
- `SettingsSection.tsx` — orchestrator (props routing, conditional rendering)
- `SettingsSectionHeader.tsx` — the pressable header with title + animated chevron
- `useSettingsSectionAccordion.ts` — state management hook (expand state, content measurement, toggle handler with haptics)

### 3. Persistence layer for settings section collapse state

Following the pattern in `calendarCollapsePreferences.ts`, create a parallel utility:
- `src/utils/settingsSectionPreferences.ts`
- AsyncStorage key: `'@habit_app:settings_section_preferences'`
- Structure: `{ [sectionId: string]: { isExpanded: boolean; updatedAt: number } }`
- Functions: `getSettingsSectionPreferences`, `getSettingsSectionExpanded`, `setSettingsSectionExpanded`

### 4. Hydration hook for loading persisted state on mount

- `src/hooks/useSettingsSectionStates.ts` — loads all section preferences from AsyncStorage on mount and provides `{sectionStates, toggleSection}` to `SettingsContent`.
- Default: all sections expanded (requirement 7).
- On toggle: update local state + persist to AsyncStorage asynchronously.

### 5. Passing collapsible props to sub-components

For sections rendered inline in `SettingsContent.tsx` (Appearance, Behavior, Habit Management), the `SettingsSection` receives `collapsible`, `isExpanded`, and `onToggle` props directly.

For self-contained sections (`StreakRemindersSection`, `AppActions`, `AboutLegalSection`) that internally render `SettingsSection`, we need to thread these props through. Each will receive optional `collapsible`, `isExpanded`, `onToggle` props which they forward to their internal `SettingsSection`.

---

## File-by-File Plan

### New Files

#### 1. `src/hooks/useExpandAnimation.ts` (shared, ~65 lines)
Generalized from `StreakRecordsAccordion/useExpandAnimation.ts`:
- Same interface: `{ defaultExpanded, reduceMotion, contentHeight, hasContentMeasured }`
- Uses `ANIMATION_DURATIONS.STANDARD` (250ms) from `src/constants/animations.ts` instead of the local constant.
- Returns `{ animateToggle, chevronAnimatedStyle, contentAnimatedStyle }`.

#### 2. `src/utils/settingsSectionPreferences.ts` (~70 lines)
AsyncStorage persistence modeled on `calendarCollapsePreferences.ts`:
- `STORAGE_KEY = '@habit_app:settings_section_preferences'`
- `interface SettingsSectionPreferences { [sectionId: string]: { isExpanded: boolean; updatedAt: number } }`
- `getSettingsSectionPreferences(): Promise<SettingsSectionPreferences>`
- `getSettingsSectionExpanded(sectionId: string): Promise<boolean | null>`
- `setSettingsSectionExpanded(sectionId: string, isExpanded: boolean): Promise<void>`

#### 3. `src/components/SettingsModal/useSettingsSectionStates.ts` (~65 lines)
Hook that manages all section expand/collapse states:
- Loads persisted preferences via `useEffect` on mount.
- Returns `{ sectionStates: Record<string, boolean>; isLoaded: boolean; toggleSection: (id: string) => void }`.
- `toggleSection` flips local state immediately, fires haptics, and persists asynchronously.
- Default: all sections expanded when no persisted preference exists.

Section IDs (string constants): `'appearance'`, `'behavior'`, `'habitManagement'`, `'notifications'`, `'support'`, `'about'`.

#### 4. `src/components/SettingsModal/SettingsSectionHeader.tsx` (~55 lines)
Extracted pressable header for collapsible sections:
- Props: `{ title, subtitle?, isExpanded, chevronStyle, onToggle, highContrastMode? }`
- Renders: `Pressable` with `accessibilityRole='button'`, `accessibilityState={{ expanded }}`, `accessibilityHint`.
- Contains title label (matching current styling) + animated chevron (`ChevronDown` from lucide).
- Reuses existing title styling from current `SettingsSection`.

#### 5. `src/components/SettingsModal/useSettingsSectionAccordion.ts` (~55 lines)
Per-section accordion state hook:
- Props: `{ isExpanded: boolean; onToggle: () => void }`
- Manages: `contentHeight`, `hasContentMeasured`, `handleContentLayout` (onLayout callback).
- Calls `useExpandAnimation` from the shared hook.
- Calls `useReduceMotion`.
- Returns: `{ chevronAnimatedStyle, contentAnimatedStyle, handleContentLayout, hasContentMeasured }`.
- Does NOT manage `isExpanded` state itself — that is owned by `useSettingsSectionStates` at the parent level.

### Modified Files

#### 6. `src/components/SettingsModal/SettingsSection.tsx` (modify, stays ~60 lines)
Add optional props:
```typescript
interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  highContrastMode?: boolean;
  // New accordion props (all optional for backward compatibility)
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}
```

When `collapsible` is true:
- Render `SettingsSectionHeader` instead of the static title View.
- Wrap `children` in `Animated.View` with `contentAnimatedStyle` and `onLayout={handleContentLayout}`.
- Use `useSettingsSectionAccordion` hook internally.

When `collapsible` is false/undefined:
- Render exactly as today (backward compatible).

#### 7. `src/components/SettingsModal/SettingsContent.tsx` (modify, target ~100 lines or less)
Currently 265 lines with eslint-disable. This change should aim to reduce, not increase. Strategy:

- Import and call `useSettingsSectionStates()` hook.
- Pass `collapsible`, `isExpanded={sectionStates[id]}`, `onToggle={() => toggleSection(id)}` to each `SettingsSection`.
- For inline sections (Appearance, Behavior, Habit Management): add 3 props to each `<SettingsSection>`.
- For external sections: pass through to `StreakRemindersSection`, `AppActions`, `AboutLegalSection`.

Net change: ~6 new lines (hook call + 3 prop additions for inline sections). The external sections get props threaded through their interfaces.

**Note on line count**: SettingsContent.tsx is already 265 lines with an eslint-disable comment. This change adds a small number of lines. The requirement says "shouldn't make it worse" — adding ~10 lines to a 265-line file is marginal. The real solution to the line count would be extracting the inline sections into their own components (like AppActions/AboutLegalSection already are), but that is out of scope for this feature.

#### 8. `src/components/SettingsModal/StreakRemindersSection.tsx` (modify, ~2 line additions)
Add optional props: `collapsible?: boolean; isExpanded?: boolean; onToggle?: () => void;`
Forward them to its internal `<SettingsSection>` usage.

#### 9. `src/components/SettingsModal/sections/AppActions.tsx` (modify, ~2 line additions)
Same pattern: accept and forward `collapsible`, `isExpanded`, `onToggle` to `<SettingsSection>`.

#### 10. `src/components/SettingsModal/sections/AboutLegalSection.tsx` (modify, ~2 line additions)
Same pattern.

#### 11. `src/components/ProgressSectionConsolidated/StreakRecordsAccordion/useStreakAccordionState.ts` (modify)
Change import of `useExpandAnimation` from `'./useExpandAnimation'` to `'@/hooks/useExpandAnimation'`.

#### 12. `src/components/ProgressSectionConsolidated/StreakRecordsAccordion/useExpandAnimation.ts` (delete)
After migrating the import, this local copy is removed. The shared version in `src/hooks/` is now the single source of truth.

---

## Implementation Sequence

### Phase 1: Shared Infrastructure (no visible changes)
1. Create `src/hooks/useExpandAnimation.ts` (shared hook).
2. Create `src/utils/settingsSectionPreferences.ts` (AsyncStorage persistence).
3. Update `StreakRecordsAccordion/useStreakAccordionState.ts` to import from shared hook.
4. Delete `StreakRecordsAccordion/useExpandAnimation.ts`.
5. Verify existing StreakRecordsAccordion behavior is unchanged.

### Phase 2: Settings Accordion Components
6. Create `src/components/SettingsModal/SettingsSectionHeader.tsx`.
7. Create `src/components/SettingsModal/useSettingsSectionAccordion.ts`.
8. Create `src/components/SettingsModal/useSettingsSectionStates.ts`.

### Phase 3: Wire It Up
9. Modify `SettingsSection.tsx` — add collapsible mode.
10. Modify `SettingsContent.tsx` — call `useSettingsSectionStates`, pass props to sections.
11. Modify `StreakRemindersSection.tsx` — accept and forward collapsible props.
12. Modify `AppActions.tsx` — accept and forward collapsible props.
13. Modify `AboutLegalSection.tsx` — accept and forward collapsible props.

### Phase 4: Testing
14. Update `SettingsModal.test.tsx` — test that sections render expanded by default, test toggle behavior.
15. Manual QA: verify animations, persistence across app restart, reduce-motion behavior, high-contrast mode.

---

## Key Design Details

### Section IDs
Define as a const object in `useSettingsSectionStates.ts`:
```typescript
export const SETTINGS_SECTION_IDS = {
  APPEARANCE: 'appearance',
  BEHAVIOR: 'behavior',
  HABIT_MANAGEMENT: 'habitManagement',
  NOTIFICATIONS: 'notifications',
  SUPPORT: 'support',
  ABOUT: 'about',
} as const;
```

### Animation Behavior
- Duration: 250ms (matches existing accordion, sourced from `ANIMATION_DURATIONS`)
- Easing: `Easing.out(Easing.ease)` (matches existing)
- Chevron: rotates 0deg (collapsed) to 180deg (expanded)
- Content: height interpolation from 0 to measured height, with opacity
- Reduce motion: instant (duration = 0)
- Content measurement: `onLayout` captures height; before measurement, height is `'auto'` (content visible, no animation)

### Accessibility
- Header: `accessibilityRole='button'`, `accessibilityState={{ expanded: isExpanded }}`, `accessibilityHint='Double tap to expand/collapse [section name]'`
- Haptic feedback on toggle (selection pattern)

### Backward Compatibility
- `SettingsSection` with no `collapsible` prop behaves identically to today
- All new props are optional
- No breaking changes to existing consumers

### Edge Cases
- First launch: no AsyncStorage data -> all sections default to expanded
- AsyncStorage read failure: default to expanded (matches existing error-handling pattern)
- Sections with dynamic content (SoundPicker in Behavior): content height re-measures on layout change via `onLayout`
- StreakRemindersSection has conditional children (enabled/disabled states): the accordion wraps the entire section including its conditional content

---

## Files Summary

| File | Action | Lines (est.) |
|------|--------|-------------|
| `src/hooks/useExpandAnimation.ts` | Create | ~65 |
| `src/utils/settingsSectionPreferences.ts` | Create | ~70 |
| `src/components/SettingsModal/SettingsSectionHeader.tsx` | Create | ~55 |
| `src/components/SettingsModal/useSettingsSectionAccordion.ts` | Create | ~55 |
| `src/components/SettingsModal/useSettingsSectionStates.ts` | Create | ~65 |
| `src/components/SettingsModal/SettingsSection.tsx` | Modify | ~65 (from 64) |
| `src/components/SettingsModal/SettingsContent.tsx` | Modify | ~275 (from 265) |
| `src/components/SettingsModal/StreakRemindersSection.tsx` | Modify | ~218 (from 213) |
| `src/components/SettingsModal/sections/AppActions.tsx` | Modify | ~67 (from 62) |
| `src/components/SettingsModal/sections/AboutLegalSection.tsx` | Modify | ~59 (from 54) |
| `src/components/ProgressSectionConsolidated/.../useStreakAccordionState.ts` | Modify | ~86 (1-line import change) |
| `src/components/ProgressSectionConsolidated/.../useExpandAnimation.ts` | Delete | — |

All new files are under the 100-line ESLint limit. Modified files stay within their current line counts (the already-exempted files like SettingsContent.tsx and StreakRemindersSection.tsx grow minimally).

---

## Potential Challenges

1. **Content height measurement with dynamic children**: The Behavior section conditionally renders `SoundPicker` based on `completionSoundEnabled`. When the toggle changes, the content height changes. The `onLayout` callback will re-fire and update `contentHeight`, but the animation may not re-run. Mitigation: the `contentAnimatedStyle` reads `contentHeight` reactively through the animated style's dependency on the interpolation. If `contentHeight` changes while expanded, the animated height will track it.

2. **SettingsContent.tsx line count**: Already 265 lines with eslint-disable. Adding ~10 more lines is minor, but ideally we would extract the inline Appearance/Behavior/Habit Management sections into their own component files (like AppActions/AboutLegalSection). This is a separate refactoring opportunity and out of scope for this feature, but worth noting as follow-up work.

3. **`StreakRemindersSection` already has eslint-disable for max-lines**: It is 213 lines. Adding 5 lines for prop forwarding is acceptable. No new eslint-disable needed.

4. **Interaction with entering animations**: Sections currently have `FadeInDown` entering animations. The accordion starts expanded by default, so there is no visual conflict — the section fades in already expanded. If a user has previously collapsed a section, the entering animation shows it collapsed, which is correct.

5. **AsyncStorage hydration timing**: The `useSettingsSectionStates` hook loads state asynchronously. Before hydration completes, all sections default to expanded (requirement 7). This means there may be a brief flash if a section was previously collapsed — it shows expanded then collapses. Mitigation options:
   - Accept the flash (minor, only on re-open after previous collapse)
   - Or: delay rendering until `isLoaded` is true (adds a brief blank state)
   - Recommended: accept the flash — it is the same pattern used elsewhere and avoids perceived latency.
