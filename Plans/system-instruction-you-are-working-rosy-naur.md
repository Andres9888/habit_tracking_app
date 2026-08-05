# Fix HabitWhyBenefitsCard crash — deploy missing Convex query

## Context

`HabitWhyBenefitsCard` (Goal tab) is crashing into the ErrorBoundary on render. The error message ends with `Called by client]`, which is the tail of a Convex server error like:

```
[CONVEX Q(templates/queries:getProvenanceForHabit)] Server Error: Could not find public function for 'templates/queries:getProvenanceForHabit'. … Called by client]
```

### Root cause (verified)

The hook on the card calls a Convex query that is **not deployed** to the backend:

- `src/screens/HabitDetailScreen/components/HabitWhyBenefitsCard/HabitWhyBenefitsCard.hooks.ts:89`
  ```ts
  const result = useQuery(api.templates.queries.getProvenanceForHabit, { habitId });
  ```
- The query is defined locally in `convex/templates/queries.ts:131` (uncommitted/unpushed change in this worktree).
- Verified against the running Convex deployment `valuable-guineapig-979` via `mcp__convex__functionSpec` — only 7 `templates/queries.js` functions are deployed and `getProvenanceForHabit` is not among them. Deployed list: `getById`, `getImportedTemplateIds`, `getPopular`, `getTemplateCount`, `getUsageStats`, `list`, `listTemplateNames`.

### Why it's not deployed

The shared dev deployment (`dev:valuable-guineapig-979`) is currently being driven by a `convex dev` process running in the **port-louis-v1** sibling worktree (PID 39990). That process watches port-louis-v1's files, not hong-kong-v1's, so the new query and schema passthroughs added in this worktree have never been pushed. Both workspaces share the same `CONVEX_DEPLOYMENT` in `.env.local`.

### Code is correct

- `convex/templates/queries.ts:131` — query handler logic is fine (auth check, `by_habit` index lookup, ownership check, return shape matches `TemplateProvenance` type).
- `by_habit` index exists on `templateUsage` at `convex/schema.ts:356`.
- `HabitWhyBenefitsCard.tsx`, `*.hooks.ts`, `SourcePill.tsx` are wired correctly. No code change needed there.

The card itself is intentional and recently shipped (commits `e22c6cc35`, `dcc6c947e`, `4956ce972`, `8c42245e0`). Per surgical-fix rule, do **not** remove or refactor the card or the hook — just deploy the missing function.

## Plan — recommended approach

One-shot push of the current hong-kong-v1 convex code to the dev deployment. This adds `getProvenanceForHabit` and the schema passthrough fields (`dailyMinutesGoal`, `weeklyMinutesGoal`, `startSmallVersion`, `tracking.minutes`) without leaving a long-running watcher that fights port-louis-v1's `convex dev`.

```
npx convex dev --once
```

Run from `/Users/andres/conductor/workspaces/habit_tracking_app/hong-kong-v1`. This codegen-only-pushes whatever's in the working tree and exits, so port-louis-v1's existing `convex dev` keeps running undisturbed.

### Files involved (no edits required)

- `convex/templates/queries.ts:131` — `getProvenanceForHabit` (already written, just needs deploy)
- `convex/schema.ts:74-78, 335-336, 364-365` — passthrough fields (already written)
- `src/screens/HabitDetailScreen/components/HabitWhyBenefitsCard/HabitWhyBenefitsCard.hooks.ts:89` — caller (correct, no change)

### Worktree coordination caveat (informational, no action)

port-louis-v1's `convex dev` will overwrite the deployment the next time port-louis-v1's files change in a way that triggers a push, removing `getProvenanceForHabit` again. Long-term, the user may want to either:
- merge this branch and pull into port-louis-v1, or
- stop port-louis-v1's `convex dev` while hong-kong-v1 is being tested.

Out of scope for this fix.

## Verification

1. Re-run `mcp__convex__functionSpec` (or `npx convex function-spec`) and confirm `templates/queries.js:getProvenanceForHabit` appears in the deployed list.
2. Reload the app, open a habit's detail screen → Goal tab.
3. Expected: `HabitWhyBenefitsCard` renders without ErrorBoundary fallback. For habits imported from a template, the amber "From Habit Library" `SourcePill` shows above the personal blocks; for non-template habits, no pill.
4. No new entries in the ErrorBoundary log.
