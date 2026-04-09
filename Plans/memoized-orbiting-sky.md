# Plan: Collapsible Settings Sections with Persisted State

## Context

The Settings page currently displays all sections fully expanded with no way to collapse them. As the settings page grows, users may want to collapse sections they rarely interact with. This change adds accordion behavior to each settings section, with AsyncStorage persistence so the expand/collapse state survives app restarts and modal re-opens.

**Precedent:** The app already has a `StreakRecordsAccordion` component with smooth reanimated expand/collapse, and `calendarCollapsePreferences.ts` for persisting per-habit expand/collapse to AsyncStorage. This plan reuses both patterns.

## Approach

Enhance `SettingsSection` with optional collapsible behavior. Extract the existing `useExpandAnimation` hook to a shared location. Add AsyncStorage persistence following the `calendarCollapsePreferences` pattern. Centralize section state management in a single hook consumed by `SettingsContent`.

### Sections Made Collapsible (6 total)
- Appearance (4 rows)
- Behavior (4 rows)
- Habit Management (1 row)
- Notifications (StreakRemindersSection)
- Support (AppActions)
- About/Legal (AboutLegalSection)

**Not collapsible:** Account row (standalone, not a section group)

**Default state:** All sections expanded (first-time experience unchanged)

## File Changes

### New Files (5)

**1. `/src/hooks/useExpandAnimation.ts`** (~65 lines)
- Extracted from `StreakRecordsAccordion/useExpandAnimation.ts` (identical API)
- `useExpandAnimation({ defaultExpanded, reduceMotion, contentHeight, hasContentMeasured })`
- Returns `{ animateToggle, chevronAnimatedStyle, contentAnimatedStyle }`

**2. `/src/utils/settingsSectionPreferences.ts`** (~60 lines)
- AsyncStorage key: `'@habit_app:settings_section_preferences'`
- Structure: `{ [sectionId: string]: { isExpanded: boolean, updatedAt: number } }`
- Functions: `getSettingsSectionPreferences()`, `getSettingsSectionExpanded(id)`, `setSettingsSectionExpanded(id, isExpanded)`
- Mirrors `calendarCollapsePreferences.ts` pattern exactly

**3. `/src/components/SettingsModal/SettingsSectionHeader.tsx`** (~55 lines)
- Pressable header: section title (current uppercase label style) + animated ChevronDown
- Props: `title`, `subtitle?`, `isExpanded`, `chevronStyle`, `onToggle`, `highContrastMode?`
- Accessibility: `role='button'`, `state={{ expanded }}`, `hint='Double tap to expand/collapse'`

**4. `/src/components/SettingsModal/useSettingsSectionAccordion.ts`** (~50 lines)
- Per-section hook wrapping shared `useExpandAnimation` + `useReduceMotion`
- Manages `contentHeight` via `onLayout` callback
- Returns `{ contentAnimatedStyle, chevronAnimatedStyle, animateToggle, handleContentLayout }`

**5. `/src/components/SettingsModal/useSettingsSectionStates.ts`** (~60 lines)
- Loads all section preferences from AsyncStorage on mount
- State: `Record<string, boolean>` (section ID -> expanded)
- `toggleSection(id)`: flips state, triggers haptic feedback, persists async
- `SECTION_IDS` constant: `{ appearance, behavior, habitManagement, notifications, support, about }`
- All sections default to `true` (expanded) until preferences load

### Modified Files (6)

**6. `/src/components/SettingsModal/SettingsSection.tsx`**
- Add optional props: `collapsible?`, `isExpanded?`, `onToggle?`, `sectionId?`
- When `collapsible=true`: render `SettingsSectionHeader` instead of static title, wrap children in animated height container using `useSettingsSectionAccordion`
- When `collapsible` is falsy: render exactly as today (backward-compatible)

**7. `/src/components/SettingsModal/SettingsContent.tsx`**
- Import and call `useSettingsSectionStates()`
- Pass `collapsible`, `isExpanded={sectionStates[id]}`, `onToggle={() => toggleSection(id)}` to each section
- ~10 lines added

**8. `/src/components/SettingsModal/StreakRemindersSection.tsx`**
- Accept and forward `collapsible?`, `isExpanded?`, `onToggle?` to its internal `<SettingsSection>`

**9. `/src/components/SettingsModal/sections/AppActions.tsx`**
- Accept and forward `collapsible?`, `isExpanded?`, `onToggle?` to its internal `<SettingsSection>`

**10. `/src/components/SettingsModal/sections/AboutLegalSection.tsx`**
- Accept and forward `collapsible?`, `isExpanded?`, `onToggle?` to its internal `<SettingsSection>`

**11. `/src/components/ProgressSectionConsolidated/StreakRecordsAccordion/useStreakAccordionState.ts`**
- Change import: `'./useExpandAnimation'` -> `'@/hooks/useExpandAnimation'`
- Delete the local `useExpandAnimation.ts` file

### Deleted Files (1)

**12. `/src/components/ProgressSectionConsolidated/StreakRecordsAccordion/useExpandAnimation.ts`**
- Replaced by shared `/src/hooks/useExpandAnimation.ts`

## Implementation Sequence

1. **Shared infrastructure** — Create shared `useExpandAnimation` hook + persistence utility. Migrate StreakRecordsAccordion import. Delete local copy.
2. **Accordion components** — Create `SettingsSectionHeader`, `useSettingsSectionAccordion`, `useSettingsSectionStates`.
3. **Wire up** — Modify `SettingsSection` for collapsible mode. Modify `SettingsContent` + 3 sub-section components to pass props through.
4. **Verify** — Test animations, persistence across app restarts, reduce-motion, high-contrast mode, accessibility.

## Key Patterns Reused

| Pattern | Source | Reuse |
|---------|--------|-------|
| Expand animation | `StreakRecordsAccordion/useExpandAnimation.ts` | Extract to shared hook |
| AsyncStorage persistence | `calendarCollapsePreferences.ts` | Mirror structure for section prefs |
| Chevron rotation | `AccordionHeader.tsx` | Recreate in `SettingsSectionHeader` |
| Haptic on toggle | `useStreakAccordionState.ts` | Use `useHapticFeedback().triggerSelection` |
| Reduce motion | `useReduceMotion()` hook | Respect in animation duration |
| Content height measurement | `onLayout` pattern | Same approach in `useSettingsSectionAccordion` |

## Edge Cases

- **Dynamic content height** (Behavior section's conditional SoundPicker): `onLayout` re-fires when content changes, updating the interpolated height automatically
- **AsyncStorage hydration timing**: Before prefs load, all sections render expanded. A previously-collapsed section may flash expanded then collapse — same as the calendar collapse pattern, acceptable tradeoff
- **SettingsContent line count**: Already 265 lines with eslint-disable. This adds ~10 lines. The real fix is decomposing that file, which is out of scope

## Verification

1. Open Settings modal — all sections visible and expanded (first time)
2. Collapse a section — smooth animated height + chevron rotation
3. Close and reopen modal — collapsed section stays collapsed
4. Kill and restart app — collapsed section still remembers state
5. Toggle "Reduce Motion" on device — collapse/expand happens instantly (no animation)
6. Verify high-contrast mode — chevron and header styled correctly
7. VoiceOver/TalkBack — announces "button, expanded/collapsed" on section headers
8. Verify `StreakRecordsAccordion` still works after hook extraction
