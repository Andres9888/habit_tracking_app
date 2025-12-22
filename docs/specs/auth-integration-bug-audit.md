# Authentication Integration - Bug Audit & Fix Spec

## Executive Summary

Recent Clerk authentication integration has introduced critical bugs preventing core functionality. This spec documents all identified issues, their root causes, and required fixes.

## Critical Blocker Issues

### 🔴 CRITICAL #1: Habit Creation Fails - Auth Token Not Validated

**Status:** BLOCKING
**Severity:** P0 - Users cannot create habits
**Root Cause:** Clerk JWT token missing required claims for Convex validation

**Current Behavior:**
- User attempts to create habit → mutation fails
- Backend logs: `"habits.create: identity = MISSING"`
- Error: `"Must be authenticated to create habits"`

**Technical Details:**
```typescript
// App.tsx:29 - Attempts to fetch token with 'convex' template
const token = await getToken({ template: 'convex' });
// Returns NULL because JWT template doesn't exist in Clerk Dashboard
```

**Fix Required:**
1. **Manual Action:** Create JWT template in Clerk Dashboard
   - Navigate to: https://dashboard.clerk.com → JWT Templates
   - Click: "New template"
   - Select: "Convex" preset
   - Name: `convex` (exact match required)
   - Save template

2. **Code Update:** Current fallback logic exists but needs verification
   ```typescript
   // src/App.tsx:26-42
   // Already has fallback to default token - verify this works
   ```

**Acceptance Criteria:**
- [ ] JWT template "convex" exists in Clerk Dashboard
- [ ] Console log shows: "Convex auth token fetched: SUCCESS"
- [ ] Backend logs show: "habits.create: identity = PRESENT"
- [ ] New habits are created with correct userId
- [ ] Habits appear immediately after creation

---

### 🔴 CRITICAL #2: Infinite Loading - "Prepare Habit Garden"

**Status:** PARTIALLY FIXED
**Severity:** P0 - App unusable for new users
**Root Cause:** Auth token validation failing → habits.list returns empty → infinite loading

**Current Behavior:**
- After sign-in, app shows "Preparing your habit garden" indefinitely
- Query: `api.habits.list` returns `[]` when auth fails
- UI treats `undefined` as "loading", `[]` as "no habits"

**Technical Details:**
```typescript
// convex/habits.ts:474-477
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  return []; // Returns empty array, not undefined
}
```

**Issue:** When auth fails, query returns `[]` instead of throwing error, so UI can't distinguish between "loading", "auth failed", and "no habits"

**Fix Required:**
1. **Option A - Fail Fast (Recommended):**
   ```typescript
   // convex/habits.ts - Throw error if not authenticated
   const identity = await ctx.auth.getUserIdentity();
   if (!identity) {
     throw new Error('Authentication required');
   }
   ```

2. **Option B - Better Loading States:**
   ```typescript
   // Add auth status to query response
   return {
     authenticated: !!identity,
     habits: identity ? habits : [],
   };
   ```

**Acceptance Criteria:**
- [ ] Loading state resolves within 3 seconds
- [ ] Auth failures show clear error message
- [ ] Empty habit list shows "Add your first habit" CTA
- [ ] No infinite loading spinner

---

## High Priority Bugs

### 🟡 HIGH #3: Habit Detail Streak Not Updating After Toggle

**Status:** IN PROGRESS
**Severity:** P1 - Data display incorrect
**Root Cause:** `selectedHabit` prop not updating when backend updates streak

**Current Behavior:**
- User toggles habit completion → button updates ✓
- Streak display shows old value
- Page refresh shows correct streak

**Technical Details:**
```typescript
// useHabitsModalsState.ts:55-73
useEffect(() => {
  if (selectedHabit) {
    const updated = habits.find(h => h._id === selectedHabit._id);
    if (updated) {
      const streakChanged = updated.currentStreak !== selectedHabit.currentStreak;
      const strengthChanged = updated.strength !== selectedHabit.strength;
      if (streakChanged || strengthChanged || updated !== selectedHabit) {
        console.log('🔄 Syncing selectedHabit:', {...});
        setSelectedHabit(updated);
      }
    }
  }
}, [habits, selectedHabit]);
```

**Debug Status:**
- Console logs added to track sync
- Need to verify if:
  - `habits` array is updating (Convex reactivity working)
  - Sync effect is triggering
  - Component is re-rendering with new prop

**Fix Required:**
1. **Immediate:** Check console logs to identify where sync breaks
2. **If habits array updates but UI doesn't:** Force re-render with key prop
3. **If habits array doesn't update:** Check Convex query dependencies

**Acceptance Criteria:**
- [ ] Toggle completion updates streak immediately
- [ ] No page refresh required
- [ ] Sync works for strength, streak, and other fields
- [ ] Console logs confirm: "🔄 Syncing selectedHabit" → "🔢 HabitDetailScreen habit updated"

---

### 🟡 HIGH #4: Legacy Habits Without userId Not Showing

**Status:** PARTIALLY FIXED
**Severity:** P1 - Data loss for existing users
**Root Cause:** Pre-auth habits don't have userId field

**Current Behavior:**
- After auth integration, existing habits missing userId
- Query filters by userId → old habits excluded
- Deleted 351 archived habits, but active habits may still have issue

**Technical Details:**
```typescript
// convex/habits.ts:486-500
q.or(
  q.eq(q.field('userId'), identity.subject), // New habits
  q.eq(q.field('userId'), undefined)         // Legacy habits (temp fix)
)
```

**Migration Status:**
- ✅ Created: `convex/migrateHabitsToUser.ts`
- ❌ Not executed: Requires authenticated session (CLI can't run it)

**Fix Required:**
1. **Run migration from authenticated context:**
   ```typescript
   // Option A: Add button in Settings modal
   <Button onPress={async () => {
     await migrateHabitsToCurrentUser();
     alert('Migration complete!');
   }}>
     Migrate My Habits
   </Button>

   // Option B: Auto-run on first load after auth
   useEffect(() => {
     if (isSignedIn && !hasRunMigration) {
       migrateHabitsToCurrentUser()
         .then(() => setHasRunMigration(true))
         .catch(console.error);
     }
   }, [isSignedIn]);
   ```

2. **Remove temporary filter after migration:**
   ```typescript
   // After all users migrated, remove:
   q.eq(q.field('userId'), undefined)
   ```

**Acceptance Criteria:**
- [ ] All existing habits assigned to correct user
- [ ] Migration runs once per user automatically
- [ ] No data loss during migration
- [ ] Remove legacy support code after 1 week

---

## Medium Priority Bugs

### 🟢 MEDIUM #5: Personal Bests Shows Wrong Streak Values

**Status:** FIXED (NEEDS TESTING)
**Severity:** P2 - Data display incorrect
**Root Cause:** `ProgressSection/utils.ts` used different date calculation than backend

**Fix Applied:**
```typescript
// Before: Math.round() + toISOString()
const diffDays = Math.round(
  (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
);

// After: differenceInDays() utility with UTC normalization
const diffDays = differenceInDays(currDateStr, prevDateStr);
```

**Files Modified:**
- `src/components/ProgressSection/utils.ts` (lines 10, 152, 181)
- `src/components/InsightsSection/InsightsSection.tsx` (similar fix)

**Acceptance Criteria:**
- [ ] Personal Bests shows correct streak values
- [ ] Frontend and backend calculations match
- [ ] No "104 days" phantom streaks
- [ ] Timezone changes don't affect calculations

---

### 🟢 MEDIUM #6: Dark Mode Persists After Disabling

**Status:** FIXED
**Severity:** P2 - UI/UX issue
**Root Cause:** Dark mode partially implemented, not fully disabled

**Fix Applied:**
```typescript
// convex/settings.ts:28 - Changed default
darkMode: 'light' as DarkModePreference, // Was: 'system'

// SettingsModal.hooks.ts - Removed dark class toggle
// Removed: document.documentElement.classList.toggle('dark')
```

**Acceptance Criteria:**
- [x] App always shows light mode
- [x] No dark mode toggle in settings
- [x] No 'dark' class on document root

---

### 🟢 MEDIUM #7: Small Chain Icons Instead of Regular Size

**Status:** FIXED
**Severity:** P3 - Visual inconsistency
**Root Cause:** Icon size hardcoded to 18px instead of 20px

**Fix Applied:**
```typescript
// HabitChainVisualizer.tsx:351-353
<ChainLinkIcon color="#ffffff" size={20} variant="stroke" />
// Was: size={18}
```

**Acceptance Criteria:**
- [x] Chain icons display at consistent 20px size
- [x] Icons visible and properly sized

---

## Low Priority Issues

### 🔵 LOW #8: Unnecessary Time Display in Settings Header

**Status:** FIXED
**Severity:** P3 - UI cleanup
**Root Cause:** Leftover time display from status bar simulation

**Fix Applied:**
```typescript
// SettingsModal.tsx - Removed lines 123-130
// Removed: {format(new Date(), 'H:mm')}
```

**Acceptance Criteria:**
- [x] No time shown above "Settings" header
- [x] Removed unused `format` import

---

## Code Quality Issues

### ⚠️ CODE QUALITY #1: Multiple Console Logs for Debugging

**Status:** TO DO
**Severity:** P3 - Code cleanup
**Location:** Multiple files have debug console.logs

**Files Affected:**
```typescript
// src/App.tsx:30, 37
console.log('Convex auth token fetched:', token ? 'SUCCESS' : 'NULL');

// convex/habits.ts:38-41
console.log('habits.create: identity =', identity ? 'PRESENT' : 'MISSING');

// useHabitsModalsState.ts:63-68
console.log('🔄 Syncing selectedHabit:', {...});

// HabitDetailScreen.tsx:1714-1719
console.log('🔢 HabitDetailScreen habit updated:', {...});
```

**Fix Required:**
- Remove console.logs after bugs are resolved
- Or: Replace with proper logging utility
- Or: Gate behind `__DEV__` flag

**Acceptance Criteria:**
- [ ] Production build has no debug console.logs
- [ ] Optional: Add structured logging library

---

### ⚠️ CODE QUALITY #2: Temporary Auth Bypass in habits:create

**Status:** TO DO
**Severity:** P1 - Security issue
**Location:** `convex/habits.ts:33-54`

**Current Code:**
```typescript
// Get authenticated user (optional for now during auth debugging)
const identity = await ctx.auth.getUserIdentity();
const userId = identity?.subject;

console.log('habits.create: identity =', identity ? 'PRESENT' : 'MISSING');
// No error thrown if identity is missing!
```

**Security Risk:**
- Habits can be created without authentication
- No user attribution for new habits
- Anyone can create habits in any user's account (if they know the endpoint)

**Fix Required:**
```typescript
// AFTER JWT template is configured, revert to:
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error('Must be authenticated to create habits');
}
const userId = identity.subject;
```

**Acceptance Criteria:**
- [ ] Auth is required for habit creation
- [ ] Error thrown when unauthenticated
- [ ] Remove debug console.logs

---

## Testing Checklist

### Auth Flow Tests
- [ ] Sign up new user → creates user record
- [ ] Sign in existing user → loads habits
- [ ] Sign out → clears auth state
- [ ] Create habit while authenticated → succeeds
- [ ] Toggle habit while authenticated → updates streak

### Data Integrity Tests
- [ ] Legacy habits (no userId) still show for owner
- [ ] New habits get userId assigned
- [ ] Migration assigns correct userId to all habits
- [ ] Users only see their own habits

### UI/UX Tests
- [ ] No infinite loading states
- [ ] Streak updates immediately after toggle
- [ ] Personal Bests shows correct values
- [ ] Dark mode stays disabled
- [ ] Chain icons consistent size

---

## Deployment Checklist

### Pre-Deployment (MUST DO FIRST)
1. [ ] Create "convex" JWT template in Clerk Dashboard
2. [ ] Test auth flow in dev environment
3. [ ] Verify habits.create works with auth
4. [ ] Run migration for existing users

### Deployment
1. [ ] Deploy Convex functions
2. [ ] Deploy frontend
3. [ ] Monitor Convex logs for auth errors
4. [ ] Monitor Sentry for client errors

### Post-Deployment
1. [ ] Verify new users can sign up and create habits
2. [ ] Verify existing users can access their habits
3. [ ] Run migration for any users who didn't get it
4. [ ] Remove debug console.logs
5. [ ] Re-enable auth requirement in habits:create

---

## Root Cause Analysis: Why Auth Integration Failed

### Planning Gaps
1. **No JWT template setup documented** - Critical step missing from implementation plan
2. **No auth testing strategy** - Should have tested in dev with JWT template first
3. **No rollback plan** - Auth broke core functionality with no easy rollback

### Technical Debt Created
1. **Dual ConvexProvider patterns** - Web vs React Native confusion
2. **Mixed auth states** - Some queries require auth, some don't
3. **Migration debt** - Legacy habits need ongoing support

### Lessons Learned
1. **Auth is infrastructure** - Should be implemented before features depend on it
2. **Test auth end-to-end** - Mock auth != real auth
3. **Fail fast** - Better to throw errors than return empty results
4. **Document manual steps** - JWT template creation should be in setup docs

---

## Recommendations

### Immediate Actions
1. 🔴 Create JWT template in Clerk Dashboard (15 min)
2. 🔴 Test habit creation with auth (5 min)
3. 🔴 Deploy migration for legacy habits (30 min)

### Short-term (This Week)
1. 🟡 Remove debug console.logs (30 min)
2. 🟡 Re-enable auth requirement in habits:create (5 min)
3. 🟡 Add auth error handling in UI (1 hour)

### Long-term (Next Sprint)
1. 🟢 Add comprehensive auth testing (2 hours)
2. 🟢 Document auth setup in README (1 hour)
3. 🟢 Remove legacy userId support after migration (30 min)

---

## Files Modified in This Session

### Authentication Integration
- `src/App.tsx` - ConvexClerkProvider setup
- `convex/auth.config.ts` - Clerk domain config
- `convex/users.ts` - User creation/lookup
- `src/components/auth/AuthGate.tsx` - Auth gate component

### Habit Queries
- `convex/habits.ts` - Auth filtering, userId assignment
- `convex/migrateHabitsToUser.ts` - Migration script (new file)

### Bug Fixes
- `src/components/ProgressSection/utils.ts` - Date calculation fix
- `src/components/InsightsSection/InsightsSection.tsx` - Streak sync
- `src/features/habits/hooks/useHabitsModalsState.ts` - Habit sync logic
- `src/screens/HabitDetailScreen.tsx` - Debug logging
- `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx` - Icon size
- `src/components/SettingsModal/SettingsModal.tsx` - Remove time display
- `src/components/HeaderCompleteToggle/HeaderCompleteToggle.tsx` - Toggle sync

### Config Changes
- `convex/settings.ts` - Dark mode default to 'light'
- `.taskmaster/tasks/tasks.json` - Added tasks #26, #27, #28

---

## Success Metrics

### Before (Broken State)
- ❌ Habit creation: 0% success rate
- ❌ Auth flow: Infinite loading
- ❌ Streak display: Incorrect values (104 days)
- ❌ Legacy habits: Hidden from users

### After (Target State)
- ✅ Habit creation: 100% success rate for authenticated users
- ✅ Auth flow: <3s from sign-in to habit list
- ✅ Streak display: Matches backend calculations
- ✅ Legacy habits: All migrated with correct userId

---

**Document Version:** 1.0
**Created:** 2025-12-22
**Author:** Product Management (Code Review)
**Status:** Draft - Awaiting Clerk JWT Template Creation
