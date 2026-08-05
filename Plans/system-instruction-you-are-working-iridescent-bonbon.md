# Auto-pick algorithm when adding a habit from a template

## Context
Today, every habit created from a template defaults to the `balanced` ("Textbook", 66-day) algorithm regardless of what the habit actually is. A 30-second breathing exercise and a 45-minute strength workout both inherit the same forming curve. The user wants the system to make a best guess at how long the habit will take, then map that estimate to one of the three algorithms (`forgiving` / `balanced` / `strict`) so each template lands on a sensible default.

Decision (confirmed): add an explicit per-template field, backfill all ~328 templates, and apply the mapping anywhere a habit is created from a template.

## Approach

**Source of truth:** add `estimatedMinutes: number` to the `templates` schema. It's the more general primitive (also useful for future UI like a duration pill) and the algorithm is derived from it.

**Mapping rule** (derived in code, single function):
- `≤ 2 min` → `forgiving` (Quick Win, 18d) — micro-habits, "atomic" actions
- `3–20 min` → `balanced` (Textbook, 66d) — everyday research default
- `> 20 min` → `strict` (Long Haul, 120d) — big commitments

Thresholds match the existing copy in `src/components/AlgorithmPicker/algorithmCopy.ts`:1-48 ("seconds" / "everyday" / "big commitments like running or meditation").

**Where it gets applied** — both template→habit paths converge cleanly:
1. **Direct import** (`convex/templates/importTemplate.ts`:157-159) — the dominant path. Read the template's `estimatedMinutes`, derive algorithm server-side, pass to habit create unless the user explicitly overrode it via `customizations.strengthAlgorithm`.
2. **Customize-then-import** (`src/screens/TemplatesScreen/.../useTemplatePreview.ts`:48-60) — seed the form's `strengthAlgorithm` state from the derived value so the picker (if/when shown) reflects the suggestion before the user hits Add.

## Files to modify

| File | Change |
|------|--------|
| `convex/schema.ts` (templates table, ~line 410) | Add `estimatedMinutes: v.optional(v.number())` |
| `convex/templates/types.ts` (or wherever `TemplateInsert` lives — `convex/templatesDataSeed.ts`:13-43) | Add `estimatedMinutes?: number` to the insert type |
| `src/types/template.ts` | No change needed — `Doc<'templates'>` picks it up |
| **NEW** `src/utils/algorithmFromDuration.ts` | Pure function `algorithmForMinutes(min: number): AlgorithmMode` implementing the 2/20 thresholds |
| `convex/templates/importTemplate.ts`:157-159 | When `customizations?.strengthAlgorithm` is undefined, derive from `template.estimatedMinutes` via the mapping (mirror the helper in a Convex-side util — keep it as a small inline function or duplicate; algorithm thresholds are short enough that drift risk is low) |
| `src/screens/TemplatesScreen/hooks/useTemplatePreview.ts`:48-60 | Initialize `strengthAlgorithm` from `algorithmForMinutes(template.estimatedMinutes ?? 5)` instead of the hardcoded `'balanced'` |
| `convex/templatesDataSeed.ts` (~328 templates) | Backfill `estimatedMinutes` on every template entry |
| **NEW** `convex/templates/backfillEstimatedMinutes.ts` | One-shot internal mutation that sets `estimatedMinutes` on existing template docs in the DB (so deployed envs pick up the values without dropping/reseeding) |

## Backfill strategy for ~328 templates

To keep this tractable and consistent rather than hand-curating 328 numbers:

1. Write a deterministic `inferMinutes(template)` helper used **only at seed-write time**, with rules:
   - Keyword scan on `name` + `description` for explicit times: `"30 seconds"`, `"1 minute"`, `"5 min"`, `"20-minute"` → use the parsed value (lower bound of any range).
   - Category fallback when no explicit time found:
     - `breathing`, `subtraction`, `environmental_design` → `2`
     - `mindfulness`, `mental_health`, `morning_routine`, `productivity`, `sleep`, `social`, `relationships`, `recovery`, `creativity`, `financial` → `5`
     - `health_fitness`, `learning`, `andrew_huberman`, `longevity` → `25`
   - Specific name-pattern overrides: `meditat*` → 10, `read` → 20, `journal` → 5, `walk` → 30, `run|workout|exercise|gym` → 30, `cold shower|cold plunge` → 3.

2. Apply the helper once locally to generate the literal numbers and commit them inline in `templatesDataSeed.ts`. The helper itself does not need to ship — the values do. (This avoids runtime reliance on a heuristic the user explicitly asked us to move past.)

3. The backfill mutation iterates existing template docs and computes `estimatedMinutes` from the same name keywords + category fallback so deployed databases match the seed.

## Why we still need the runtime mapping function

`algorithmFromDuration.ts` is the *only* runtime heuristic. Templates ship with `estimatedMinutes` (deterministic data); the algorithm is computed at the moment of habit creation. This keeps the algorithm thresholds tunable in one place without re-seeding 328 rows.

## Verification

1. **Unit:** add tests for `algorithmFromDuration` — boundaries at 2, 3, 20, 21 minutes.
2. **Convex:** start `convex dev`, run the backfill mutation against the local deployment, then `convex run templates:list` and spot-check that breathing templates have `estimatedMinutes ≤ 2`, fitness templates have `≥ 20`.
3. **End-to-end (direct import):** in the iOS sim, open Templates → tap Box Breathing → "Add Habit" → open the new habit's edit screen → confirm Algorithm shows **Quick Win**. Repeat for a workout template → expect **Long Haul**. Repeat for "Read 20 minutes" → expect **Textbook**.
4. **End-to-end (customize-then-import):** open the same templates via the customize modal — the algorithm picker (if exposed in that flow) should already reflect the suggestion before tapping Add.
5. **Regression:** create a habit manually (no template) — algorithm should still default to `balanced`. Edit an existing habit — its `strengthAlgorithm` must not change.

## Out of scope (call out, do not build now)
- Surfacing `estimatedMinutes` as a duration pill on `TemplateCard` (data is now available; UI can come later).
- Letting users tweak the global mapping thresholds.
- Re-evaluating the algorithm when a user changes their goal duration on an existing habit.
