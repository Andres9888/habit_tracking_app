# Code Audit Phase 01: Critical Security - Missing Authentication on Convex Endpoints

**Priority:** CRITICAL
**Category:** Security
**Estimated scope:** ~15 Convex files, add auth checks and user filtering

## Context

Multiple Convex query and mutation endpoints have NO authentication checks and NO user filtering. This means any caller can read or modify ANY user's data. This is the highest-priority fix as it directly impacts user data privacy.

The pattern for fixing these is:

1. Get the user identity via `ctx.auth.getUserIdentity()`
2. If no identity, throw an unauthorized error
3. Filter queries by `userId` field to ensure users only see their own data
4. For mutations, verify ownership before modifying

---

## Tasks

- [x] **Fix `convex/habits/getTracking.ts` - Add auth check and user filtering.** This query returns ALL users' tracking data with no auth. Read the file, add `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error("Unauthenticated");` at the top of the handler, then add a `.filter()` on the results to only return records where the userId matches the authenticated user (check how userId is stored in the tracking table schema - look at `convex/schema.ts`). The query currently filters by date range but not by user.

  > **Completed:** Added auth check returning `[]` for unauthenticated callers (matching established query pattern), and added `q.eq(q.field('userId'), identity.subject)` to the DB filter clause. Created `convex/habits/getTracking.test.ts` with 7 tests covering auth patterns and user filtering. All existing tests continue to pass.

- [x] **Fix `convex/habits/get.ts` - Add auth check and ownership verification.** This query returns any habit by ID with no auth. Read the file, add authentication check at the top of the handler, and after fetching the habit verify that `habit.userId` matches the authenticated user's ID before returning. Return `null` if ownership doesn't match.

  > **Completed:** Added `ctx.auth.getUserIdentity()` check returning `null` for unauthenticated callers (single-item query pattern), added ownership verification `habit.userId !== identity.subject` returning `null` for non-owners. Created `convex/habits/get.test.ts` with 7 tests covering auth pattern, ownership verification, undefined userId edge case, and defense-in-depth ordering. All 14 habits tests pass.

- [x] **Fix `convex/habits/stats.ts` - Add auth check and ownership verification.** The `getStats` query returns streak/consistency stats for any habit ID. Read the file, add authentication, and verify the habit belongs to the authenticated user before computing and returning stats.

  > **Completed:** Added `ctx.auth.getUserIdentity()` check returning `null` for unauthenticated callers, added habit existence check via `ctx.db.get()`, and added ownership verification `habit.userId !== identity.subject` returning `null` for non-owners — all before the tracking query executes. Updated return type to `v.union(v.null(), v.object(...))`. Created `convex/habits/stats.test.ts` with 8 tests covering auth patterns, ownership verification, undefined userId edge case, and defense-in-depth ordering. All 22 habits tests pass.

- [x] **Fix `convex/notesQueries.ts` - Add auth to all 3 queries (list, search, get).** The `list` query returns ALL notes from ALL users. The `search` query searches across all users' notes. The `get` query returns any note by ID. Read the file, add auth checks to each query handler, and filter by userId. For `list`, filter the db query. For `search`, filter results. For `get`, verify ownership before returning.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth checks to all 3 queries. `list` returns `[]` for unauthenticated callers and filters at DB level with `q.eq(q.field('userId'), identity.subject)`. `search` returns `[]` for unauth and adds the same DB-level userId filter before applying habitId/searchText filters in-memory. `get` returns `null` for unauth, checks note existence, then verifies `note.userId !== identity.subject` returning `null` for non-owners. Created `convex/notesQueries.test.ts` with 15 tests covering auth patterns, userId filtering, ownership verification, and defense-in-depth ordering for all 3 queries. All 167 tests pass across 8 passing suites (10 legacy suites have pre-existing missing vitest import issue).

- [x] **Fix `convex/reflectionsQueries.ts` - Add auth to all 3 queries.** `getByHabitAndDate`, `listByHabit`, and `listRecent` all return data from all users. Read the file, add auth checks, and filter by userId. For `listRecent`, add a filter so it only returns the current user's reflections.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth checks to all 3 queries. `getByHabitAndDate` returns `null` for unauthenticated callers, fetches the reflection, then verifies `reflection.userId !== identity.subject` returning `null` for non-owners. `listByHabit` returns `[]` for unauth and filters at DB level with `.filter((q) => q.eq(q.field('userId'), identity.subject))`. `listRecent` returns `[]` for unauth and adds the same DB-level userId filter before ordering/limiting — critical fix since this previously returned ALL users' reflections. Created `convex/reflectionsQueries.test.ts` with 16 tests covering auth patterns, userId filtering, ownership verification, and defense-in-depth ordering for all 3 queries. All 183 tests pass across 9 passing suites (10 legacy suites have pre-existing missing vitest import issue).

- [x] **Fix `convex/lettersQueries.ts` - Add auth to all 6 queries.** `listByHabit`, `getUnreadUnlocked`, `getUpcomingUnlocks`, `get`, `countByHabit`, and `getStats` all lack auth. Read the file, add auth checks to each handler, and ensure all queries filter by the authenticated user's data.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth checks to all 6 queries. `listByHabit` returns `[]` for unauth and filters at DB level with `q.eq(q.field('userId'), identity.subject)`. `getUnreadUnlocked` returns `[]` for unauth and adds the same DB-level userId filter before applying unlock/read status filters in-memory. `getUpcomingUnlocks` returns `[]` for unauth, **removed the client-supplied `userId` arg** (was an insecure pattern allowing any caller to impersonate any user), and eliminated the dangerous "query all letters" fallback that returned ALL users' data — now always uses `identity.subject`. `get` returns `null` for unauth, checks letter existence, then verifies `letter.userId !== identity.subject` returning `null` for non-owners. `countByHabit` returns `0` for unauth and filters at DB level. `getStats` returns `null` for unauth, verifies habit ownership via `ctx.db.get()` + `habit.userId !== identity.subject` before computing stats, and updated return type to `v.union(v.null(), letterStatsValidator)`. Note: `lettersQueriesExtra.ts` (containing `getMostRecentUnlocked` and `listByUser`) already had proper auth checks. Created `convex/lettersQueries.test.ts` with 27 tests covering auth patterns, userId filtering, ownership verification, defense-in-depth ordering, and the removed userId arg for all 6 queries. All 210 tests pass across 10 passing suites (10 legacy suites have pre-existing missing vitest import issue).

- [x] **Fix `convex/affirmations.ts` - Add auth to `listByHabit` query.** Read the file, add auth check, verify the habit belongs to the user before returning affirmations.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth check returning `[]` for unauthenticated callers. Added habit ownership verification via `ctx.db.get(args.habitId)` + `habit.userId !== identity.subject` returning `[]` for non-owners — both checks execute before the affirmations query, preventing any data leakage. Created `convex/affirmations.test.ts` with 8 tests covering auth patterns, habit ownership verification, undefined userId edge case, and defense-in-depth ordering. All 218 tests pass across 11 passing suites (10 legacy suites have pre-existing missing vitest import issue).

- [x] **Fix `convex/analyticsOverview.ts` - Add auth to `getOverviewStats` query.** This returns ALL users' habits with strength/streak data. Read the file, add auth check, filter habits to only the current user's habits.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth check returning the empty stats object (`{ averageStrength: 0, rankedHabits: [], strongestHabit: null, totalHabits: 0, weakestHabit: null }`) for unauthenticated callers — matching the return shape to prevent frontend runtime errors. Replaced the dangerous unfiltered `ctx.db.query('habits').collect()` with `.withIndex('by_userId', (q) => q.eq('userId', identity.subject))` to filter at the DB level, ensuring no other user's habit names, streaks, or strength data are ever returned. Created `convex/analyticsOverview.test.ts` with 8 tests covering auth patterns, DB-level userId filtering, defense-in-depth ordering, and active/archived/paused habit filtering. All 226 tests pass across 12 passing suites (10 legacy suites have pre-existing missing vitest import issue).

- [x] **Fix `convex/visionBoard.ts` - Add auth to all 4 endpoints.** The `listByHabit` query and `create`, `update`, `remove` mutations all lack auth. Read the file, add auth checks to every handler. For mutations, verify ownership of the referenced habit/item before allowing changes.

  > **Completed:** Added `ctx.auth.getUserIdentity()` auth checks to all 4 endpoints. `listByHabit` returns `[]` for unauthenticated callers, verifies habit ownership via `ctx.db.get(args.habitId)` + `habit.userId !== identity.subject` returning `[]` for non-owners — both checks execute before the visionBoardItems query. `create` throws for unauth, verifies habit ownership before insert, and now **sets `userId: identity.subject`** on the inserted record (previously missing — a data integrity fix). `update` throws for unauth, uses dual ownership verification (item's own `userId` + parent habit's `userId`) to handle legacy records with undefined userId, all before patching. `remove` throws for unauth, uses the same dual ownership verification before deleting. Created `convex/visionBoard.test.ts` with 22 tests covering auth patterns, ownership verification, dual-layer ownership fallback, defense-in-depth ordering, and userId assignment on create for all 4 endpoints. All 248 tests pass across 13 passing suites (325 legacy suites have pre-existing missing vitest import issue).

- [x] **Remove or gate debug endpoints behind admin auth.** The files `convex/debugHabitStrength.ts`, `convex/diagnose.ts`, and `convex/quickFix.ts` contain unauthenticated queries and mutations that expose/modify ALL users' data. Either delete these files entirely (recommended for production), or add a strong auth check that verifies the caller is an admin user. Check if any client code imports from these files first - search for `debugHabitStrength`, `diagnose`, and `quickFix` in `src/` to see if they're referenced.

  > **Completed:** Confirmed no client code in `src/` or non-generated `convex/` files references these debug endpoints. Deleted all 3 files: `convex/debugHabitStrength.ts` (2 queries exposing all habits), `convex/diagnose.ts` (1 query + 1 mutation exposing/modifying all users' data), `convex/quickFix.ts` (1 mutation + 1 query modifying/exposing arbitrary habits). The only references were in auto-generated `convex/_generated/api.d.ts` which will regenerate on next `npx convex dev`. Created `convex/debugEndpoints.test.ts` with 7 regression guard tests verifying the files no longer exist and no client code references them. All 255 tests pass across 14 passing suites (10 legacy suites have pre-existing missing vitest import issue).
