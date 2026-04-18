# Plan: Reset Icons to Default in Settings

## Context

The Appearance section of Settings has three icon-type customizations:
1. **Day marker shape** (`dayShape`) — Circle / Square (default `'square'`)
2. **Completion icon** (`habitCompletionIcon`) — Chain / Check (default `'chain'`)
3. **Default growth icons** (`progressEmojis`) — 5-emoji set (default `DEFAULT_PROGRESS_EMOJIS`)

Users who have customized any of these currently have no easy way to get back to the app defaults. Only the Growth Icons picker has an inline "Reset to default" control (`ProgressEmojiPicker.tsx:127-142`); the other two offer no reset at all.

Goal: give the user a single action in the Appearance section that restores all three icon settings to their defaults.

## Approach

Add a single **"Reset icons to default"** row at the bottom of the Appearance section. Tapping it:
- Sets `dayShape` → `'square'` (`DEFAULT_SETTINGS.dayShape`)
- Sets `habitCompletionIcon` → `'chain'` (`DEFAULT_SETTINGS.habitCompletionIcon`)
- Sets `progressEmojis` → `undefined` (triggers fallback to `DEFAULT_PROGRESS_EMOJIS`)
- Shows a confirmation `Alert` before applying (mirrors the destructive-action pattern already used in `SettingsModalSection.tsx` for export)

The row is only enabled when at least one of the three values differs from its default, otherwise it renders disabled/hidden to avoid noise. Preferred: keep it visible but disabled when all-defaults, so users discover it exists.

## Files to modify

### 1. `src/components/SettingsModal/SettingsContent.tsx`
- Add one more `SettingsRow` at line ~201 inside the Appearance `SettingsSection`, after `<GrowthIconsSettingsRow />`.
- Icon: `RotateCcw` from `lucide-react-native` (matches existing section icon style).
- Type: `'navigation'` with `onPress={p.onResetAppearanceIcons}`.
- Compute `isDisabled` from the three values already in props (`p.dayShape`, `p.habitCompletionIcon`) plus a new prop for `progressEmojis` (or a boolean `p.iconsAreDefault` passed in).

### 2. `src/components/SettingsModal/types.ts`
- Add `onResetAppearanceIcons: () => void` to the `SettingsContentProps` type (and whichever parent props type forwards it — the file cascade is `SettingsModal` → `SettingsContent`).

### 3. `src/components/SettingsModal/SettingsModal.tsx`
- Thread `onResetAppearanceIcons` through from modal props to `SettingsContent`.

### 4. `src/features/habits/components/HabitsModals/SettingsModalSection.tsx`
- Implement the handler. Pattern matches existing `onChangeDayShape` / `onChangeHabitCompletionIcon` (lines 169–172): call `onSettingsChange({ dayShape: 'square', habitCompletionIcon: 'chain', progressEmojis: undefined })` inside an `Alert.alert` confirmation.
- Import `DEFAULT_SETTINGS` from `convex/settings/types` rather than hardcoding the literal values.
- Pass `onResetAppearanceIcons` into `<SettingsModal>`.

### 5. (No schema/backend changes)
- `appIcon` field exists in the data layer but has no UI picker and no installed native icon library — intentionally out of scope. Not mentioning it to the user avoids adding a setting that doesn't visually change anything yet.

## Reused existing code

- `SettingsRow` component (`src/components/SettingsModal/SettingsRow.tsx`) — same row primitive the section already uses.
- `DEFAULT_SETTINGS` (`convex/settings/types.ts:23-50`) — single source of truth for defaults.
- `onSettingsChange` handler in `SettingsModalSection.tsx` — already batches multi-field updates through `sanitizeSettingsPayload` + Convex mutation.
- `Alert.alert` destructive-action pattern already used in this file (`SettingsModalSection.tsx:102-118, 124-142`).

## Verification

1. Manually customize all three icon settings:
   - Switch Day marker to Circle
   - Switch Completion icon to Check
   - Change Growth icons preset to "Fitness"
2. Tap the new **Reset icons to default** row → confirm in the alert.
3. Verify in-app: Day marker shows Square, Completion icon shows Chain (link), Growth icons show the 🌱🌿🌳💪⚡ set.
4. Verify Convex `userSettings` doc: `dayShape === 'square'`, `habitCompletionIcon === 'chain'`, `progressEmojis` is `undefined` / missing.
5. Re-open Settings modal — row is visible but disabled (all-defaults state).
6. `npm run lint:max-lines` — `SettingsContent.tsx` already has `/* eslint-disable max-lines, max-lines-per-function */` at line 1, so the added row does not introduce a lint regression; still verify no new ≤100-line violations elsewhere.
7. Typecheck passes.
