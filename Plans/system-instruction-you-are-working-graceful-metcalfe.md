# Plan: Real Popularity Tracking for Templates

## Context

Today, template "popularity" is fake. Every template has a hardcoded `popularityScore` set once in `convex/templatesDataSeed.ts` (e.g., "5-Minute Meditation" = 95). The frontend sorts by this static number in `useMainBrowseData.ts`, formats it as "1.2K tracking" via `formatPopularity.ts`, and renders it in `PopularSection` and `TrendingCard`. The 🔥 emoji on the top 3 is just "first 3 after sort," not a real signal.

The infrastructure to track real usage exists but is unused:
- `templateUsage` table records every import (`convex/schema.ts:329-338`)
- `importTemplate.ts:168` writes to it on every template import
- A `getUsageStats` query exists in `convex/templates/queries.ts` but is never called

We want template popularity to reflect **habits that are currently being used** — not stale imports, not abandoned templates.

## Approach

Replace hardcoded `popularityScore` with a **scheduled Convex job** that recomputes it from real data every few hours, based on **active-habit count** (users who imported the template AND still have a non-archived habit for it).

### Why scheduled (not inline inc/dec)

The data model makes inline counting brittle:
- `templateUsage` is append-only — re-imports would double-count
- `habits` has no `templateId` field; linkage is only via `templateUsage` join table (no index on habits by template)
- Lifecycle changes happen in 4+ places: `importTemplate.ts`, `remove.ts:85` (hard delete), `archive.ts:25` (soft archive), unarchive, plus a 15-min undo window via `deletedHabits`
- Each path would need to inc/dec correctly forever or popularity drifts permanently

A scheduled recount is self-healing: drift is impossible because we recount from scratch each run.

### Why active count (not import count)

User explicitly said "habits that are currently being used." Pure import count rewards templates that get tried-and-abandoned. Active count is honest: "234 people are using this right now."

## Implementation Steps

### 1. Add a Convex cron to recompute popularity
**New file:** `convex/crons.ts` (if not present, otherwise extend it)
- Schedule `internal.templates.popularity.recompute` to run every 2 hours.

### 2. Write the recompute mutation
**New file:** `convex/templates/popularity.ts`
- Internal mutation `recompute`:
  1. Fetch all rows from `templateUsage`
  2. For each, look up the `habit` by `habitId`; keep only rows where the habit exists AND `archived !== true`
  3. Group by `templateId`, dedupe by `userId` (so re-imports count once per user), count distinct users per template
  4. Patch each `templates` row's `popularityScore` with the new count
  5. Patch `popularityScore = 0` for templates with no active habits
- Keep this query bounded — paginate if `templateUsage` grows large (initially fine to scan).

### 3. Update the live `getPopular` query to use the freshly-written value
**File:** `convex/templates/queries.ts:55-72`
- Already reads `popularityScore` from templates table — no change needed once the cron writes real numbers.

### 4. Backfill on first deploy
- Manually invoke `internal.templates.popularity.recompute` once after deploy (via `npx convex run templates/popularity:recompute` or the Convex dashboard) so the seeded hardcoded numbers are replaced before users see them.

### 5. (Optional, do not do yet) Frontend label tweak
- `formatPopularity.ts` currently shows "1.2K tracking." Once the numbers are real and probably small (10s–100s, not 1000s), confirm the copy still reads well. Defer until we see real numbers.

## Files Modified / Created

- **New:** `convex/templates/popularity.ts` — recompute mutation
- **New or extend:** `convex/crons.ts` — schedule entry
- **No change but verified:** `convex/templates/queries.ts` (`getPopular` already reads `popularityScore`)
- **No change but understood:** `src/screens/TemplatesScreen/hooks/useMainBrowseData.ts:30-35` (sorts by `popularityScore` — will pick up real values automatically)
- **No change:** `convex/templatesDataSeed.ts` — hardcoded `popularityScore` becomes the initial value, overwritten on first cron run

## Reused Existing Code

- `templateUsage` table + `importTemplate.ts:168` writes — already capturing the data we need
- `habits.archived` lifecycle field (`schema.ts:50`) — already the "still using it" signal
- `templates.popularityScore` field — already on schema, already consumed by frontend

## Verification

1. **Unit-ish:** After running `npx convex run templates/popularity:recompute`, query `templates` and confirm `popularityScore` matches a manual count of `templateUsage` rows joined to non-archived `habits`.
2. **End-to-end:**
   - Import a template via the app → run recompute → confirm that template's score went up by 1
   - Archive that habit → run recompute → confirm score went back down by 1
   - Hard-delete that habit → run recompute → confirm score went down by 1
3. **UI:** Open Templates screen → confirm Popular section ordering reflects new scores, and `TrendingCard` "X tracking" labels show the new numbers
4. **Cron:** Check Convex dashboard logs to confirm the scheduled job ran successfully on its 2-hour cadence

## Open Questions Deferred

- **Recency weighting:** Once we have real data flowing, decide if `popularityScore` should weight recent activity higher (e.g., `count_last_30d * 2 + count_older`). Out of scope for this change.
- **Scan cost:** If `templateUsage` grows past ~100K rows, the full-scan recompute may become slow. At that point, switch to incremental (process only rows changed since last run, tracked via a `lastRunAt` timestamp). Out of scope until we hit it.
- **Cadence:** 2 hours is a starting guess. May tighten to 30min or loosen to 6h depending on how often users care about freshness vs. Convex compute cost.
