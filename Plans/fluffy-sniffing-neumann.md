# Fix Settings Modal Close Animation

## Context

The settings modal close animation feels sluggish and a blank screen flashes briefly after closing. Root cause: `if (!visible) return null` on line 71 of `SettingsModal.tsx` unmounts the `<Modal>` component before React Native's native slide-out animation can play. Additionally, a 300ms `setTimeout` in `handleClose` to reset view state creates timing mismatches.

## Changes

### 1. `src/components/SettingsModal/SettingsModal.tsx`
- **Remove line 71:** `if (!visible) return null;`
- The `<Modal visible={visible}>` handles its own visibility — when `visible` becomes `false`, the native slide-out animation plays properly

### 2. `src/components/SettingsModal/SettingsModal.hooks.ts`
- **Remove `closeTimerRef`** (line 44) and its cleanup effect (lines 57-62)
- **Simplify `handleClose`** to just call `onClose()` — no setTimeout, no view manipulation during close
- **Add `useEffect`** that resets `view` to `'settings'` when `visible` becomes `true` (modal opens) — replaces the fragile 300ms timeout approach
- **Remove `useRef` import** (no longer needed)

### No changes to `SettingsHeader.tsx`
The native `<Modal animationType='slide'>` handles exit animation. Adding reanimated `exiting` props on children would conflict.

## Verification
1. Open/close settings — smooth slide-out, no blank flash
2. Navigate to archived/sort sub-view, close — animates out from sub-view, reopens on main settings
3. Rapid open/close — no race conditions
4. Haptic test flow still works (closes settings → opens haptic test)
