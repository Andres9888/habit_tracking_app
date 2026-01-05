# Authentication Removal - Task Breakdown

## Phase 1: Device Identity System

### Task 1.1: Create Device Identity Module
**File**: `src/lib/deviceIdentity.ts`
**Priority**: P0 (Blocker)
**Estimate**: Small

- [ ] Create `generateDeviceUserId()` function using UUID v4
- [ ] Create `getDeviceUserId()` that retrieves from AsyncStorage
- [ ] Create `getOrCreateDeviceUserId()` composite function
- [ ] Add UUID validation helper `isValidDeviceUserId()`
- [ ] Export all functions

**Acceptance Criteria**:
- UUID v4 format generated
- Persisted to `@habit_app:device_user_id` key
- Returns same ID on subsequent calls

---

### Task 1.2: Create Device User Context
**File**: `src/contexts/DeviceUserContext.tsx`
**Priority**: P0 (Blocker)
**Depends on**: 1.1

- [ ] Create `DeviceUserContext` with `deviceUserId` value
- [ ] Create `DeviceUserProvider` component
- [ ] Initialize deviceUserId on mount (async)
- [ ] Provide loading state while initializing
- [ ] Create `useDeviceUser()` hook

**Acceptance Criteria**:
- Context available throughout app
- Loading state prevents premature renders
- Hook returns `{ deviceUserId, isLoading }`

---

### Task 1.3: Create Anonymous User Backend Function
**File**: `convex/users.ts`
**Priority**: P0 (Blocker)

- [ ] Add `getOrCreateAnonymousUser` mutation
- [ ] Accept `deviceUserId` parameter
- [ ] Validate UUID format server-side
- [ ] Create user with `isAnonymous: true` if not exists
- [ ] Return user record

**Acceptance Criteria**:
- Rejects invalid UUID formats
- Creates user only once per deviceUserId
- Returns existing user on subsequent calls

---

## Phase 2: Remove Auth Components

### Task 2.1: Remove Auth Screens
**Priority**: P1
**Depends on**: Phase 1

Files to delete:
- [ ] `src/screens/auth/WelcomeScreen.tsx`
- [ ] `src/screens/auth/SignInScreen.tsx`
- [ ] `src/screens/auth/SignUpScreen.tsx`

**Acceptance Criteria**:
- Files deleted
- No import errors in codebase

---

### Task 2.2: Remove Auth Components
**Priority**: P1
**Depends on**: 2.1

Files to delete:
- [ ] `src/components/auth/AuthGate.tsx`
- [ ] `src/components/auth/SocialLoginButtons.tsx`

**Acceptance Criteria**:
- Files deleted
- No import errors in codebase

---

### Task 2.3: Remove Convex Auth Config
**Priority**: P1

Files to delete:
- [ ] `convex/auth.ts`
- [ ] `convex/auth.config.ts`

**Acceptance Criteria**:
- Files deleted
- Convex deployment succeeds without auth config

---

### Task 2.4: Update App.tsx Entry Point
**File**: `src/App.tsx`
**Priority**: P0 (Blocker)
**Depends on**: 1.2, 2.1, 2.2

- [ ] Remove `ClerkProvider` wrapper
- [ ] Remove `ConvexClerkProvider` wrapper
- [ ] Add `DeviceUserProvider` wrapper
- [ ] Remove `getToken` and auth sync logic
- [ ] Remove `AuthGate` component usage
- [ ] Direct render to `HabitsApp` (or loading state)

**Acceptance Criteria**:
- App renders without Clerk
- DeviceUserContext wraps app
- No auth-related imports remain

---

### Task 2.5: Remove Auth Dependencies
**File**: `package.json`
**Priority**: P2
**Depends on**: 2.1-2.4

- [ ] Remove `@clerk/clerk-expo`
- [ ] Remove `@convex-dev/auth`
- [ ] Remove `expo-auth-session`
- [ ] Run `npm install` to update lockfile
- [ ] Verify no peer dependency warnings

**Acceptance Criteria**:
- Dependencies removed
- `npm install` succeeds
- App builds successfully

---

## Phase 3: Update Backend Operations

### Task 3.1: Update Habits Mutations
**File**: `convex/habits.ts`
**Priority**: P0 (Blocker)
**Depends on**: 1.3

- [ ] Add `deviceUserId` parameter to `create` mutation
- [ ] Add `deviceUserId` parameter to `toggleHabit` mutation
- [ ] Add `deviceUserId` parameter to `archive` mutation
- [ ] Add `deviceUserId` parameter to `pause` mutation
- [ ] Remove `ctx.auth.getUserIdentity()` calls
- [ ] Add UUID validation to each mutation

**Acceptance Criteria**:
- All mutations accept deviceUserId
- Auth context no longer required
- Invalid UUIDs rejected with error

---

### Task 3.2: Update Habits Queries
**File**: `convex/habits.ts`
**Priority**: P0 (Blocker)
**Depends on**: 3.1

- [ ] Add `deviceUserId` parameter to `list` query
- [ ] Add `deviceUserId` parameter to `get` query
- [ ] Add `deviceUserId` parameter to `listArchived` query
- [ ] Add `deviceUserId` parameter to `listPaused` query
- [ ] Update filter logic to use parameter instead of identity

**Acceptance Criteria**:
- All queries accept deviceUserId
- Data properly filtered by deviceUserId
- No auth context required

---

### Task 3.3: Update Affirmations Module
**File**: `convex/affirmations.ts`
**Priority**: P1

- [ ] Add `deviceUserId` to all mutations
- [ ] Add `deviceUserId` to all queries
- [ ] Remove auth context dependencies
- [ ] Add UUID validation

---

### Task 3.4: Update Letters Module
**File**: `convex/letters.ts`
**Priority**: P1

- [ ] Add `deviceUserId` to all mutations
- [ ] Add `deviceUserId` to all queries
- [ ] Remove auth context dependencies

---

### Task 3.5: Update Voice Notes Module
**File**: `convex/voiceNotes.ts`
**Priority**: P1

- [ ] Add `deviceUserId` to all mutations
- [ ] Add `deviceUserId` to all queries
- [ ] Remove auth context dependencies

---

### Task 3.6: Update Remaining Convex Modules
**Priority**: P1

Files to update:
- [ ] `convex/visionBoard.ts`
- [ ] `convex/reflections.ts`
- [ ] `convex/notes.ts`
- [ ] `convex/analytics.ts`
- [ ] `convex/tracking.ts`

**Acceptance Criteria**:
- All modules accept deviceUserId
- No auth context dependencies remain

---

## Phase 4: Update Frontend Hooks & Components

### Task 4.1: Update useHabitMutations Hook
**File**: `src/features/habits/hooks/useHabitMutations.ts`
**Priority**: P0 (Blocker)
**Depends on**: Phase 3

- [ ] Import `useDeviceUser` hook
- [ ] Pass `deviceUserId` to all mutation calls
- [ ] Handle loading state (disable mutations while loading)

---

### Task 4.2: Update Habits List Hook
**File**: `src/features/habits/hooks/useHabitsList.ts` (or equivalent)
**Priority**: P0 (Blocker)
**Depends on**: Phase 3

- [ ] Import `useDeviceUser` hook
- [ ] Pass `deviceUserId` to list query
- [ ] Return loading state while deviceUserId initializing

---

### Task 4.3: Update All Feature Hooks
**Priority**: P1

- [ ] Update affirmation hooks
- [ ] Update letter hooks
- [ ] Update voice note hooks
- [ ] Update vision board hooks
- [ ] Update reflection hooks

---

## Phase 5: Cleanup & Testing

### Task 5.1: Remove Unused Imports
**Priority**: P2

- [ ] Search for `@clerk` imports
- [ ] Search for `AuthGate` imports
- [ ] Search for `getUserIdentity` references
- [ ] Remove all dead imports

---

### Task 5.2: Update Environment Variables
**Priority**: P2

- [ ] Remove `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from `.env`
- [ ] Update `.env.example` if exists
- [ ] Update documentation referencing Clerk keys

---

### Task 5.3: Update Tests
**Priority**: P1

- [ ] Update/remove auth-related tests
- [ ] Add tests for deviceIdentity module
- [ ] Add tests for anonymous user creation
- [ ] Verify existing habit tests pass

---

### Task 5.4: Manual QA Checklist
**Priority**: P0 (Blocker)

- [ ] Fresh install: App launches to habits screen
- [ ] Fresh install: Can create habit without signup
- [ ] Fresh install: deviceUserId persists across app restart
- [ ] Existing install: App updates without breaking
- [ ] All habit CRUD operations work
- [ ] All motivation features work
- [ ] No console errors related to auth

---

## Dependency Graph

```
1.1 ─────┬───► 1.2 ─────┬───► 2.4
         │              │
1.3 ◄────┘              │
                        │
2.1 ───► 2.2 ───────────┘
                        │
2.3 ────────────────────┘
                        │
         ┌──────────────┘
         ▼
3.1 ───► 3.2 ───► 4.1 ───► 4.2
         │
3.3 ─────┤
3.4 ─────┤
3.5 ─────┤
3.6 ─────┘
         │
         ▼
       5.1-5.4
```

## Risk Items

| Task | Risk | Mitigation |
|------|------|------------|
| 2.4 | Breaking change to app entry | Test on fresh install |
| 3.1-3.2 | Data access broken during transition | Deploy backend first |
| 5.4 | Regressions in features | Comprehensive QA checklist |
