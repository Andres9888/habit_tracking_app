# Disable Dark Mode Temporarily

## Problem Statement

Dark mode is partially implemented but not working correctly, causing UI issues when users toggle it. For MVP release, we need to disable dark mode functionality until it can be properly implemented.

## Current State

The app has dark mode infrastructure in place but it's incomplete:

| Component | Status |
|-----------|--------|
| Settings storage (Convex) | Working |
| Dark mode toggle UI | Working |
| Dark color palette | Defined |
| React Native Paper dark theme | **Not implemented** |
| System preference detection | **Not implemented** |
| Conditional theme switching | **Not implemented** |

When users toggle dark mode, the setting is saved but the app doesn't actually switch themes, leading to confusion.

## Solution

Temporarily disable dark mode by:
1. Removing the dark mode toggle from Settings UI
2. Forcing light mode in theme provider
3. Removing any dark mode CSS class toggling
4. Setting default to 'light' instead of 'system'

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/SettingsModal/SettingsModal.tsx` | Remove dark mode toggle section |
| `src/components/SettingsDialog/SettingsDialog.tsx` | Remove dark mode toggle section |
| `src/components/SettingsDialog/SettingsDialog.hooks.ts` | Remove document.classList.toggle('dark') logic |
| `src/components/SettingsDialog/SettingsDialog.config.ts` | Change default from 'system' to 'light' |
| `convex/settings.ts` | Change default darkMode from 'system' to 'light' |

## Acceptance Criteria

- [ ] Dark mode toggle is not visible in settings UI
- [ ] App always displays in light mode
- [ ] No dark mode CSS classes are applied to document
- [ ] Settings default to 'light' for new users
- [ ] Existing users with dark mode enabled see light mode
- [ ] No console errors related to dark mode

## Test Cases

1. Open settings - dark mode toggle should not be visible
2. New user - app should be in light mode
3. Existing user with darkMode='dark' - app should still show light mode
4. Check document.documentElement - should not have 'dark' class

## Future Work

When ready to implement dark mode properly:
1. Create `MD3DarkTheme` based on existing dark color palette
2. Add `Appearance.addChangeListener()` for system preference
3. Implement conditional theme provider in App.tsx
4. Test all components in dark mode
5. Re-enable toggle in settings

## Priority

**Medium** - Cosmetic issue but causes user confusion. Should be fixed before MVP.

## Estimated Effort

Small - Mostly removing code rather than adding.
