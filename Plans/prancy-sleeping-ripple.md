# Plan: Standalone 6-Pillar UI Audit

## Context

The habit tracking app has no GSD phase structure (no `.planning/` directory). The `/gsd:ui-review` skill was invoked, which says it "works on any project — GSD-managed or not." Since there are no phase directories or SUMMARY files, this audit will cover the **entire frontend codebase** as a standalone review.

The app is a React Native + Expo habit tracking app with web support, using a "Warm Minimal" design system with NativeWind, React Native Paper, and Reanimated.

## Approach

Spawn a `gsd-ui-auditor` agent (model: sonnet) to conduct a 6-pillar visual audit of the entire frontend, grading each pillar 1-4:

1. **Copywriting** — UI text quality, tone, clarity, CTAs
2. **Visuals** — Icons, illustrations, imagery, data visualization
3. **Color** — Palette consistency, contrast, semantic usage, dark mode
4. **Typography** — Font pairing, hierarchy, scale, readability
5. **Spacing** — Padding, margins, alignment, whitespace consistency
6. **Experience Design** — Flows, feedback, animations, error/loading/empty states

## Key Files for Audit

### Theme System
- `src/theme/index.ts` — Main theme export
- `src/theme/colors/core.ts` — 54 color values, "Warm Minimal" palette
- `src/theme/typography.ts` — Literata + DM Sans + JetBrains Mono
- `src/theme/spacing.ts` — 8px grid, shadows, border radius
- `src/theme/animations.ts` — Duration scale, spring presets, easings
- `src/theme/darkColors.ts` — Dark/light mode palettes
- `src/theme/iconSizes.ts` — Icon size tokens

### Core Screens
- `src/screens/auth/WelcomeScreen.tsx` — Auth landing
- `src/screens/onboarding/OnboardingScreen.tsx` — First-time setup
- `src/features/habits/HabitsApp.tsx` — Main app orchestrator
- `src/screens/AnalyticsScreen/` — Statistics dashboard
- `src/screens/CharacterScreen/` — Gamification profile
- `src/screens/TemplatesScreen/` — Template browsing

### Key Components
- `src/features/habits/components/HabitsEmptyStateMinimal/` — Empty state
- `src/components/CreateHabitModal/` — Habit creation
- `src/features/habits/components/BottomActionBar/` — Action bar
- `src/components/SettingsModal/` — Settings
- `src/components/HabitCard/` — Main habit card

### Styling Patterns
- Component `*.styles.ts`, `*.colors.ts` files
- `tailwind.config.js` — NativeWind config

## Output

- `UI-REVIEW.md` in project root (no phase directory to place it in)
- Score summary displayed to user (score/24)
- Top 3 actionable fixes

## Verification

- UI-REVIEW.md created with all 6 pillars graded
- Score summary displayed in GSD brand format
- Actionable findings listed per pillar
