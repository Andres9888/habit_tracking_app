# Code Audit: Bugs, Security, and Performance

## Context
Full codebase audit of the React Native/Expo habit tracking app (Convex backend, Clerk auth, RevenueCat subscriptions). Three parallel exploration agents reviewed security, bugs, and performance. Key findings were then manually verified by reading the actual source code.

---

## Security Assessment: STRONG — No Vulnerabilities Found

The codebase has excellent security practices:

- **Authentication**: All 47+ Convex mutations check `ctx.auth.getUserIdentity()` with ownership verification
- **Input validation**: Comprehensive XSS/injection prevention in `convex/lib/inputValidation.ts` (script tags, event handlers, SQL patterns)
- **Webhook security**: HMAC-SHA256 with timing-safe comparison (`convex/webhooks/revenuecatSignature.ts`)
- **File uploads**: Content-type whitelist (JPEG/PNG/WebP/HEIC only) + 10MB size limit (`convex/storage.ts`)
- **Premium gating**: Server-side enforcement, not bypassable client-side
- **Secrets management**: No hardcoded secrets, `.env` in `.gitignore`, Gitleaks scanning configured
- **Security tests**: Dedicated test suites for auth patterns and input validation

No action needed.

---

## Bugs Found

After verification, most "bugs" flagged by automated exploration were **false positives**. The dependency arrays in `useOfflineQueue` are actually correct, and the FlatList key fallback is defensive code that never triggers (Convex always provides `_id`).

### Bug 1: Redundant `runOnJS` in error recovery path (LOW)
**File:** `src/components/HabitCard/gestures/tapGesture.ts:93`

```typescript
runOnJS(async () => {
  try {
    await toggleCompletionMutation({ date: today, habitId: id });
  } catch (error) {
    showSyncError();
    runOnJS(toggleOptimistic)();  // <-- already on JS thread, runOnJS is redundant
  }
})();
```

The inner `runOnJS(toggleOptimistic)()` is called when already on the JS thread. It works (Reanimated detects this and calls directly), but it's misleading. Should be just `toggleOptimistic()`.

**Fix:** Replace `runOnJS(toggleOptimistic)()` with `toggleOptimistic()` on line 93.

### Bug 2: Fire-and-forget `unloadAsync` in sound cleanup (LOW)
**File:** `src/hooks/useCompletionSound.ts:75`

```typescript
sound.setOnPlaybackStatusUpdate((status) => {
  if (status.isLoaded && status.didJustFinish) {
    sound.unloadAsync();          // not awaited
    soundRef.current = undefined; // ref cleared before unload completes
  }
});
```

The `soundRef.current` is set to `undefined` before `unloadAsync()` completes. If `playCompletionSound` is called again during that window, a new sound loads while the old one is still unloading. The callback is synchronous so `await` isn't possible, but the ref should be cleared inside a `.then()`.

**Fix:** `sound.unloadAsync().then(() => { soundRef.current = undefined; });`

---

## Performance Issues Found

### Perf 1: splash.png is 1.3MB (MEDIUM)
**File:** `assets/splash.png` — 1.3MB

This is large for a splash screen asset. It delays app startup, especially on slower devices or first install.

**Fix:** Compress to ~200-400KB using lossy compression (e.g., `pngquant` or TinyPNG). The icons (222KB each) are borderline acceptable.

### Perf 2: Sequential deletes in `deleteAllArchived` (LOW)
**File:** `convex/habits/archive.ts:106-121`

```typescript
for (const record of records) await ctx.db.delete(record._id);
for (const usageEntry of templateUsageEntries) await ctx.db.delete(usageEntry._id);
```

Sequential awaits in a loop. Within a Convex mutation transaction, `Promise.all()` can parallelize these operations. For users with many archived habits and tracking records, this could approach Convex's mutation time limit.

**Fix:** Replace with `await Promise.all(records.map(r => ctx.db.delete(r._id)));` for both loops.

### Perf 3: Stagger animation scales linearly with list size (LOW)
**File:** `src/screens/TemplatesScreen/views/SeeAllView.tsx`

`FadeInDown.delay(index * durations.stagger)` means the last item in a list of 100 templates would animate in after 5+ seconds. Should cap the max delay.

**Fix:** `FadeInDown.delay(Math.min(index * durations.stagger, MAX_STAGGER_DELAY))`

---

## Summary

| Category | Severity | Count | Action Needed |
|----------|----------|-------|---------------|
| Security | - | 0 issues | None |
| Bugs | LOW | 2 | Optional cleanup |
| Performance | MEDIUM | 1 | Compress splash.png |
| Performance | LOW | 2 | Optional optimization |

**Overall assessment:** This is a well-built codebase with strong security practices, proper auth patterns, comprehensive input validation, and good React Native performance patterns (memoization, FlatList, native animations). The issues found are minor.

---

## Recommended Fixes

1. **Compress `assets/splash.png`** from 1.3MB to ~300KB — most impactful change
2. **Fix redundant `runOnJS`** in `tapGesture.ts:93` — one-line change
3. **Fix sound cleanup race** in `useCompletionSound.ts:75` — one-line change
4. **Parallelize archive deletes** in `archive.ts:116-118` — two-line change
5. **Cap stagger animation** in `SeeAllView.tsx` — one-line change

## Verification
- Run `npx expo start` and verify app launches correctly
- Run existing test suites: `npm test`
- Manually test habit toggle, archive/delete-all, and completion sound
