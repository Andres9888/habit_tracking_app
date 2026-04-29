# Screenshots — 2026-04-23 Audit — DEFERRED

**Status:** Not captured. Code-only audit.

## Why deferred

The 2026-04-23 audit cycle requested screenshot capture per-surface to cross-check visuals against the design tokens. This was blocked on a missing `.env.local` file.

**What's needed:**
- `.env.local` at repo root with real values for:
  - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_CONVEX_URL`
  - `CLERK_AUTH_DOMAIN`
  - `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `ANDROID_KEY`
  - `EXPO_PUBLIC_SENTRY_DSN`

See `.env.example` at repo root for the full list.

Without these, `npm run dev` fails because `convex dev --once --env-file .env.local` can't start. The iOS simulator path (`npm run expo:ios`) fails for the same reason — the app boots but crashes on first network call to Convex/Clerk.

## When `.env.local` becomes available

Capture this matrix at 390×844 (iPhone 14 viewport) per the plan:

| # | Surface | States |
|---|---------|--------|
| 1 | Welcome (auth) | default, OAuth loading, error |
| 2 | Onboarding / 13-step questionnaire | each step (resume flow) |
| 3 | Habits/Today | empty, populated, selection mode, batch confirm |
| 4 | Habit Detail | hero + each scrollspy tab, pinned parchment pill, heatmap |
| 5 | Habit Edit | form, danger zone, name validation |
| 6 | Habit Library | browse, category, goal collection, search, template preview w/ advanced options |
| 7 | Analytics | empty, populated chart sections |
| 8 | Character (ranks) | rank tiles (LoL-style), attributes, achievements, stats |
| 9 | Settings Modal | account, notifications, appearance, danger |
| 10 | Create Habit Modal | all steps, color picker, reminder picker |
| 11 | Sync indicators | offline, syncing, conflict, synced toast |
| 12 | Error boundary | screen-level fallback |

## Partial historical coverage

`.maestro/screenshots/` contains earlier Maestro-driven captures (mostly `inline-hint-h4-*` series) that provide limited reference for one specific feature fix cycle.
