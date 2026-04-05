# Settings Page — Design Consistency Review & Fixes

## Context

The settings page (modal) works well functionally but has accumulated design inconsistencies relative to the app's token-based design system. Hard-coded hex colors bypass the theme system (breaking dark mode / high-contrast consistency), shadow values don't match the canonical token presets, and the Account section uses a bespoke layout instead of the shared `SettingsRow` component pattern.

## Issues Found

### 1. Hard-coded hex colors (token violations)

**AccountSection.tsx** (`src/components/SettingsModal/sections/AccountSection.tsx`):
- **Line 34**: Avatar `backgroundColor: '#7c3aed'` → use `themeColors.status.premium` (light: `#7C3AED`, dark: `#A78BFA`)
- **Line 64**: Divider uses `'#2f2f2f'` / `'#333'` / `'#e7e5e4'` → use `themeColors.border`
- **Line 79**: Sign Out `color: '#ef4444'` → use `themeColors.status.error`

**DeleteAccountButton.tsx** (`src/components/SettingsModal/sections/DeleteAccountButton.tsx`):
- **Line 17**: `'#f87171'` / `'#ef4444'` → use `themeColors.status.error`

**SoundPicker.tsx** (`src/components/SettingsModal/SoundPicker.tsx`):
- **Lines 27-30**: Accent `'#34d399'`/`'#059669'` and rgba backgrounds → use `themeColors.primary[500]`/`themeColors.primary[600]` and derive alpha backgrounds from them

### 2. Shadow inconsistency

**SettingsSection.tsx** (`src/components/SettingsModal/SettingsSection.tsx`):
- Lines 56-63: Uses `shadowOffset: {height: 4}`, `shadowOpacity: 0.08`, `shadowRadius: 16` — this matches the `shadows.floatingActionButton` preset (level 2 elevation)
- Section cards at rest should use `shadows.card` (level 1): `height: 2, opacity: 0.06, radius: 8`
- Shadow color `'#000000'`/`'#1c1917'` should use the warm tone `'#2D2A26'` from the token system
- Import `shadows` from `@/theme` and spread `shadows.card`

### 3. AccountSection doesn't use SettingsRow pattern

The profile row and "Sign Out" button are custom-built inline:
- Profile row uses `py-3.5` while SettingsRow uses `py-4` (inconsistent vertical rhythm)
- No haptic feedback on Sign Out press
- Custom 0.5px inset divider vs. SettingsRow's full-width `border-b`
- Missing `accessibilityRole` on profile row

**Fix**: Refactor to use SettingsRow-consistent styling — same padding, border pattern, and haptics. The profile row can remain custom (it needs an avatar), but adopt the same `px-4 py-4` spacing and `border-b` divider approach. Add haptics to Sign Out.

### 4. Missing subtitle on "Pin calendar header"

All other toggle rows have subtitles explaining the feature. Add: `subtitle='Keep the month header visible when scrolling'`

### 5. Hardcoded version/build number

`SettingsContent.tsx` line 225-228 passes `version='1.0.0'` and `buildNumber='1'`. These should come from `expo-constants` or `app.json`.

---

## Plan

### Fix 1: Replace hard-coded colors with theme tokens

**Files**: `AccountSection.tsx`, `DeleteAccountButton.tsx`, `SoundPicker.tsx`

- Replace `'#7c3aed'` → `themeColors.status.premium`
- Replace `'#ef4444'`/`'#f87171'` → `themeColors.status.error`
- Replace divider colors → `themeColors.border`
- Replace SoundPicker accent colors → `themeColors.primary[500]`/`themeColors.primary[600]`
- Derive alpha backgrounds: `rgba(${primary}, 0.12)` pattern using `themeColors.accent` + opacity wrapper or keep the alpha pattern but derive from theme (acceptable since these are intentional alpha overlays)

### Fix 2: Correct shadow tokens in SettingsSection

**File**: `SettingsSection.tsx`

- Import `{ shadows }` from `@/theme`
- Replace inline shadow props with `...shadows.card` for light mode
- Keep `shadowColor: 'transparent'` for high contrast mode

### Fix 3: Align AccountSection with SettingsRow patterns

**File**: `AccountSection.tsx`

- Change profile row padding from `py-3.5` → `py-4` to match SettingsRow
- Replace custom 0.5px divider with `border-b` + `borderColor: themeColors.border` (matching SettingsRow)
- Add haptic feedback (`Haptics.impactAsync(Light)`) to Sign Out press
- Add `accessibilityRole='button'` to profile row if it becomes tappable, or keep as-is if display-only

### Fix 4: Add missing subtitle

**File**: `SettingsContent.tsx`

- Add `subtitle='Keep the month header visible when scrolling'` to the "Pin calendar header" SettingsRow

### Fix 5: Dynamic version/build

**File**: `SettingsContent.tsx` + potentially `SettingsModal.tsx`

- Import `Constants` from `expo-constants`
- Use `Constants.expoConfig?.version` and `Constants.expoConfig?.ios?.buildNumber` (or `nativeBuildVersion`)

---

## Files to Modify

1. `src/components/SettingsModal/sections/AccountSection.tsx` — token colors + padding alignment + divider + haptics
2. `src/components/SettingsModal/sections/DeleteAccountButton.tsx` — token colors
3. `src/components/SettingsModal/SoundPicker.tsx` — token colors
4. `src/components/SettingsModal/SettingsSection.tsx` — shadow tokens
5. `src/components/SettingsModal/SettingsContent.tsx` — subtitle + version/build

## Files to Reference (read-only)

- `src/theme/spacing.ts` — `shadows` tokens
- `src/theme/darkColors.ts` — `status.error`, `status.premium` tokens
- `src/theme/colors/core.ts` — core palette
- `src/components/SettingsModal/SettingsRow.tsx` — canonical row pattern

## Verification

1. Run `npx expo start` and verify settings page in **light mode** — shadows should be subtler (card-level vs. FAB-level)
2. Toggle **dark mode** — all text, dividers, avatar background should adapt correctly
3. Check **Sign Out** and **Delete Account** use appropriate error red for current theme
4. Check **SoundPicker** accent color adapts to dark mode
5. Run `npm run lint` to verify no lint violations introduced
6. Check version displays actual app version instead of "1.0.0 (1)"
