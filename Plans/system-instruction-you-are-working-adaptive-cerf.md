# Plan — Swap Welcome icon to C-v3 (vertical chain)

## Context

The Welcome screen of the onboarding-v2 flow currently displays a **horizontal** three-link chain ("infinity chain") rendered from `src/assets/onboarding/chainday-welcome-icon.png` (and `@2x`/`@3x` variants).

In commit `b5939341a feat(icon): swap iOS/Android/web app icons to chain C-v3`, the app icon was updated to a **vertical** three-link chain (C-v3 concept) — copper/iron/gold links on emerald gradient. The user wants the Welcome screen to use that same new icon instead of the horizontal one, so the first thing the user sees in onboarding matches the home-screen app icon.

The `WelcomeStep.tsx` component at `src/screens/onboarding-v2/steps/WelcomeStep.tsx:15` references the icon via `require('@/assets/onboarding/chainday-welcome-icon.png')` and renders it at 108×108 (line 16, `ICON_SIZE = 108`). React Native's asset system auto-picks `@2x`/`@3x` for retina screens.

## Approach (surgical — no code changes)

Replace the three PNG files in place with downscaled versions of the C-v3 vertical chain. Filenames and import path stay identical, so `WelcomeStep.tsx` does not need to change.

Source: `assets/icon.png` (1024×1024 PNG, already C-v3, committed in `b5939341a`).

### Steps

1. Use `sips` (built-in macOS) to resize `assets/icon.png` → three new PNGs:
   - `src/assets/onboarding/chainday-welcome-icon.png` at **108×108** (1x)
   - `src/assets/onboarding/chainday-welcome-icon@2x.png` at **216×216** (2x)
   - `src/assets/onboarding/chainday-welcome-icon@3x.png` at **324×324** (3x)
2. Overwrite the existing files (git tracks the prior versions if a revert is ever needed).

Concrete commands:

```bash
SRC=assets/icon.png
DEST=src/assets/onboarding
sips -Z 108 "$SRC" --out "$DEST/chainday-welcome-icon.png"
sips -Z 216 "$SRC" --out "$DEST/chainday-welcome-icon@2x.png"
sips -Z 324 "$SRC" --out "$DEST/chainday-welcome-icon@3x.png"
```

## Files modified

- `src/assets/onboarding/chainday-welcome-icon.png` (binary replace)
- `src/assets/onboarding/chainday-welcome-icon@2x.png` (binary replace)
- `src/assets/onboarding/chainday-welcome-icon@3x.png` (binary replace)

No source-code files changed. `WelcomeStep.tsx:15` continues to reference the same path.

## Verification

1. Open `src/assets/onboarding/chainday-welcome-icon@2x.png` with the Read tool — confirm the image is the **vertical** chain (gold on top, iron in middle, copper at bottom), matching `assets/icon.png`.
2. Run the app (Expo dev server) and navigate to the Welcome step (first screen of onboarding-v2). Confirm the icon shown matches the iOS/Android home-screen app icon.
3. The pulse animation, "Hey." headline, and "Tap to begin" CTA should all continue to work unchanged.
