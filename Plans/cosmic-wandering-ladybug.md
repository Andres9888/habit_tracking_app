# Plan: Make "Play Sound on Complete" Toggle Work

## Context

The completion sound feature is fully built (UI toggle, sound hook, audio assets, backend persistence) but double-gated behind premium:
- **Backend**: SEC-005 in `convex/settings/settings.ts:92-99` rejects enabling for non-premium users
- **Frontend**: `useHabitsListState.ts:139` requires `isPremiumUser && completionSoundEnabled`

This means the toggle does nothing for non-premium users — the mutation fails silently and the toggle never changes.

## Changes

### 1. Remove backend premium gate for completion sound
**File:** `convex/settings/settings.ts` (lines 91-99)

Remove the SEC-005 premium check block:
```typescript
// DELETE these lines (91-99):
if (args.completionSoundEnabled === true) {
  const isPremium = await hasPremiumAccess(ctx, identity.subject);
  if (!isPremium) {
    throw new Error(
      'Premium required: Completion sounds are only available for premium users. Upgrade to unlock this feature.'
    );
  }
}
```

### 2. Remove frontend premium gate for sound playback
**File:** `src/features/habits/hooks/useHabitsListState.ts` (line 139)

Change:
```typescript
soundEnabled: isPremiumUser && completionSoundEnabled,
```
To:
```typescript
soundEnabled: completionSoundEnabled,
```

## Files to modify
1. `convex/settings/settings.ts` — remove SEC-005 completion sound premium check (lines 91-99)
2. `src/features/habits/hooks/useHabitsListState.ts` — remove `isPremiumUser &&` from sound hook (line 139)

## Verification
1. Open settings → toggle "Play sound on habit completion" ON → should visually toggle and persist
2. Go to habits list → complete a habit → should hear the chime sound
3. Toggle it OFF → complete a habit → should NOT hear a sound
4. Close and reopen settings → toggle should retain its state
