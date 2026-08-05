# Plan: Rationalize & Unify Habit Name Character Limit

## Context

The habit name input has a 50-character hard limit, but it's hardcoded in 5+ places with no documented rationale. The backend constant says 100, the frontend says 50, and Convex has no validation at all. The user wants a principled limit with clear reasoning, unified to a single source of truth.

## Recommended Limit: **50 characters** (keep current, but now with rationale)

### Why 50?

| Evidence | What it tells us |
|----------|-----------------|
| **All 200+ app templates fit within 38 chars** | Longest: "Energizing Breath (Kapalabhati)" at 38. 50 gives 32% headroom for custom names. |
| **Main card displays (2 lines) fit ~40-55 chars** | The DraggableHabitCard and HabitCard — the surfaces users see most — handle 50 chars without issue. |
| **Single-line displays truncate regardless** | HabitRankingItem shows ~18-20 chars. Even a 30-char limit would truncate here. The limit shouldn't be driven by the tightest truncation. |
| **40 is too tight** | Barely fits the longest template. Blocks names like "Practice guitar for 30 minutes" (31 chars) from having any breathing room. |
| **60+ is a sentence** | At that point users are writing descriptions, not names. |
| **Existing soft limit at 40** | The progressive warning system (show counter at 20, warn at 30, error at 40) already guides users toward conciseness. 50 is the safety valve. |

### Threshold System (unchanged values, now documented)

| Threshold | Chars | Rationale |
|-----------|-------|-----------|
| Counter appears | 20 | ~50% of typical habit name length. Shows only when relevant. |
| Warning (amber) | 30 | ~60% of limit. "You're getting long." |
| Error (red) | 40 | ~80% of limit. Matches the soft counter display ("X/40"). Strong signal to wrap up. |
| Hard limit | 50 | Input stops accepting characters. |

---

## Changes

### 1. Centralize constants in `src/constants/app.ts`

- Change `MAX_HABIT_NAME_LENGTH` from 100 to **50**
- Add documented threshold constants:
  - `HABIT_NAME_COUNTER_SHOW_AT = 20`
  - `HABIT_NAME_WARNING_AT = 30`
  - `HABIT_NAME_ERROR_AT = 40`
  - `HABIT_NAME_SOFT_DISPLAY = 40` (the "X/40" counter denominator)

### 2. Remove duplicate definitions (import from `@/constants` instead)

| File | Current | Change |
|------|---------|--------|
| `src/components/CreateHabitModal/components/HabitNameField.constants.ts` | `MAX_LENGTH=50, MAX_CHARS=40, WARNING_THRESHOLD=30, SHOW_THRESHOLD=20` | Import from `@/constants` |
| `src/components/CreateHabitModal/components/HeroNameInput/types.ts` | `MAX_LENGTH=50` | Import from `@/constants` |
| `src/components/CreateHabitModal/components/NameInputSection.tsx` | `maxLength={50}` hardcoded | Use `MAX_HABIT_NAME_LENGTH` |
| `src/screens/HabitEditScreen/NameInputSection.tsx` | `maxLength={50}`, `"{length}/50 characters"` | Use constant |
| `src/features/habits/components/HabitsEmptyStateMinimal/constants.ts` | `CHARACTER_LIMIT = { max: 50, ... }` | Derive from centralized constants |
| `src/components/CreateHabitModal/utils.ts` | `HABIT_NAME_MAX_LENGTH = 100` | Import centralized constant |

### 3. Sync backend

- `convex/lib/inputValidation.ts`: Change `MAX_HABIT_NAME_LENGTH` from 100 to 50, add `// SYNC: must match src/constants/app.ts` comment

### 4. Fix pre-existing test bugs

- `src/utils/__tests__/validation.test.ts` expects "200 characters" — should be 50
- `src/utils/__tests__/validation.enhanced.test.ts` references 200 — should be 50

### 5. Update tests referencing old thresholds

- Update accessibility hint tests (dynamic string now)
- Update threshold-based test assertions if any EmptyState thresholds change (35→30, 45→40)

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. `npm run lint` — no lint errors
3. `grep -r 'maxLength={50}' src/` — should return 0 results (all replaced with constant)
4. `grep -r "MAX_LENGTH = 50" src/` — should only exist as the centralized constant
5. Run existing tests: `npx jest --testPathPattern="HabitNameField|HabitInput|validation"` — all pass
6. Manual: type 50+ chars in create habit input — input stops at 50
