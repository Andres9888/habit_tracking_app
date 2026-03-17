# Codebase Bug Review

## Context
Quick audit of the habit tracking app codebase. Three parallel exploration agents scanned React Native components, Convex backend, and edge cases. I then manually verified the top findings. Many agent-reported issues were false positives after closer inspection.

---

## Verified Bugs

### 1. Missing `Haptics` import in `useMilestoneCheck.ts` (Medium)
**File:** `src/components/StreakMilestoneCelebration/useMilestoneCheck.ts:98`

`Haptics.notificationAsync()` is called on lines 98 and 176, but `Haptics` is never imported. The test file (`useMilestoneCheck.test.ts`) imports it, but the source file doesn't.

- **Line 97-103 (useEffect):** `setTimeout` callback calls `Haptics.notificationAsync()` which will throw an uncaught `ReferenceError` since `Haptics` is undefined. The `.catch()` on the Promise won't help because the error is synchronous (before any Promise is created).
- **Line 176 (standalone function):** Same issue but inside a `try/catch`, so it's caught there.

**Fix:** Add `import * as Haptics from 'expo-haptics';` at the top of the file.

---

### 2. `isRemoved` phantom field in free tier checks (Low)
**Files:**
- `convex/habits/create.ts:36` — `!h.isRemoved`
- `convex/templates/importTemplate.ts:90` — `!h.isRemoved`

`isRemoved` does not exist in the schema (`convex/schema.ts`). The field is always `undefined`, so `!undefined === true`, meaning the condition is dead code. It doesn't cause incorrect behavior today, but it's misleading — it implies a soft-delete feature that doesn't exist.

**Fix:** Remove `!h.isRemoved` from both filters, or add the field to the schema if soft-delete is planned.

---

### 3. Silent premium grant failure when user settings don't exist (Medium)
**File:** `convex/subscriptions/helpers.ts:17-21`

```typescript
if (settings) {
  await ctx.db.patch(settings._id, { hasPremium });
}
// silently skips if settings not found
```

If a RevenueCat webhook fires before the user's `userSettings` document is created (e.g., during very first login or if Clerk creates the user but the app hasn't initialized settings yet), premium is silently not granted. The user pays but doesn't get premium features until something else triggers a re-check.

**Fix:** Create `userSettings` if missing, or queue a retry/log a warning.

---

### 4. Redundant null checks after already-throwing guard (Trivial)
**Files:** `convex/habits/pause.ts:76,117`, `convex/habits/toggle.ts:35`, and others.

Pattern:
```typescript
if (!habit) { throw new Error('Habit not found'); }      // line 71
if (!habit || habit.userId !== identity.subject) { ... }  // line 76 — !habit is unreachable
```

Not a functional bug. Just unnecessary code that could confuse readers.

**Fix:** Remove the redundant `!habit ||` from the ownership check lines.

---

## Debunked Findings (Not Real Bugs)

| Reported Issue | Why It's Not a Bug |
|---|---|
| DST bug in `monthlyTrend.ts` `setDate()` | JS `setDate()` correctly advances calendar days; `formatDateString` extracts date only, so time shifts don't matter |
| DST bug in `generateDateStrings` | Each iteration creates a fresh `Date()` — no cumulative error |
| `setTimeout` memory leak in `useMilestoneCheck` | Timeout is short and fires once; not a real leak pattern |
| `strengthLevel` not restored on resume (`pause.ts:127`) | `recalculateOnPauseChange()` is called immediately after (line 133) and overwrites with correct values |
| Race condition in free tier limit check | Convex mutations are serializable per-document; standard pattern for Convex |
| N+1 deletion pattern in `remove.ts` | Convex doesn't have batch delete; sequential `ctx.db.delete()` is the expected pattern |

---

## Recommended Fix Priority

1. **Haptics import** — Fix immediately. Causes uncaught errors on every milestone celebration.
2. **Premium grant failure** — Fix soon. Could cause paying users to not receive premium.
3. **`isRemoved` dead code** — Clean up when convenient.
4. **Redundant null checks** — Optional cleanup.

## Verification
- Run `npx tsc --noEmit` to confirm the Haptics import fix compiles
- Search for other missing imports: `grep -r "Haptics\." src/ --include="*.ts" --include="*.tsx"` and cross-reference with imports
- Test milestone celebration flow end-to-end after fix
