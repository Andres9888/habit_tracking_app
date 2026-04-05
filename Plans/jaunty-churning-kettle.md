# Plan: Force Light Mode (Disable Dark Mode Until Feature Is Ready)

## Context

The app's `darkMode` setting defaults to `'system'`, which causes the app to follow the device's color scheme. When a user's phone switches to dark mode (e.g., sunset schedule), the app goes dark — but dark mode isn't a fully implemented/shipped feature yet. This needs to be locked to light mode.

## Root Cause

Three places cooperate to enable dark mode:

1. **`convex/settings/types.ts:31`** — `DEFAULT_SETTINGS.darkMode` is `'system'`
2. **`src/theme/ThemeContext.tsx:44`** — fallback when setting is unloaded is also `'system'`
3. **`app.json:10`** — `userInterfaceStyle: "automatic"` tells the OS to allow dark chrome

## Changes

### 1. `convex/settings/types.ts` (line 31)
Change default from `'system'` to `'light'`:
```
darkMode: 'light' as DarkModePreference,
```

### 2. `src/theme/ThemeContext.tsx` (line 44)
Change the fallback from `'system'` to `'light'`:
```ts
raw === 'dark' || raw === 'light' || raw === 'system' ? raw : 'light';
```

### 3. `app.json` (line 10)
Change from `"automatic"` to `"light"`:
```json
"userInterfaceStyle": "light"
```

## What This Does NOT Change

- The `DarkModePreference` type still allows `'system' | 'light' | 'dark'` — no type changes
- The dark color palette files (`darkColors.ts`, `settingsColors.ts`) stay intact
- The `ThemeContext` resolution logic stays intact — it still supports all three modes
- Existing users who somehow set `'dark'` or `'system'` in Convex will keep that value stored, but new defaults and the context fallback will be `'light'`

This is the minimal change: just flip three default values. When you're ready to ship dark mode, flip them back.

## Verification

1. Set device to dark mode → app should stay light
2. Check that no existing UI breaks (all components use `useThemeColors()` which will just return `lightColors`)
3. `npx expo start` — confirm no build errors
