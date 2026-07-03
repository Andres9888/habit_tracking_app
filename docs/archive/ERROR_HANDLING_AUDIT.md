# Error Handling Audit Report

## Chain Day Habit Tracking App

**Date:** 2026-02-15
**Branch:** fix/error-handling-sweep

---

## 🎯 Audit Scope

1. Silent error swallowing (empty catch blocks or console.log only)
2. Async functions without try/catch that could crash the app
3. Convex mutations lacking proper error handling with user-facing messages
4. ErrorBoundary coverage on major screen components
5. Network error handling when Convex is unreachable

---

## ✅ What's Working Well

### 1. ErrorBoundary Components

- **SentryErrorBoundary** wraps entire app in `App.tsx`
- **ScreenErrorBoundary** used on:
  - ✅ HabitsApp (main screen)
  - ✅ HabitEditScreen
  - ✅ HabitDetailScreen
  - ✅ AnalyticsScreen
  - ✅ CharacterScreen
  - ✅ Individual modals in CalendarAndDetailModals.tsx

### 2. Convex Mutations

- All mutations properly throw errors with descriptive messages
- Authentication checks in place
- Input validation present

### 3. Intentional Silent Catches (Acceptable)

- Haptics (non-critical UX enhancement)
- Store review prompts (never break app for ratings)
- Timezone fallbacks (graceful degradation)

---

## 🚨 Critical Issues Found

### 1. Missing User-Facing Error Messages

**File:** `src/features/habits/hooks/useHabitModalHandlers.ts`

**Issue:** All mutation failures only log to console in dev, no user feedback

```typescript
// Lines 46-52: confirmPause
try {
  await deps.pauseHabit({ habitId: deps.habitToPause._id });
  // ...success
} catch (error) {
  if (__DEV__) console.error('Failed to pause habit:', error);
  // ❌ NO USER FEEDBACK!
}

// Lines 74-78: onSettingsChange
try {
  await deps.updateSettings({ ...deps.settings, ...updates });
} catch (error) {
  if (__DEV__) console.error('Failed to update settings:', error);
  // ❌ NO USER FEEDBACK!
}

// Lines 83-89: onDeleteHabit
try {
  await deps.removeHabit({ habitId });
  // ...success
} catch (error) {
  if (__DEV__) console.error('Failed to delete habit:', error);
  // ❌ NO USER FEEDBACK!
}
```

**Impact:** Users don't know when operations fail

---

### 2. Async Functions Without Try/Catch

**File:** `src/features/habits/components/HabitsEmptyStateMinimal/useHabitCreationFlow.ts`

```typescript
const handleCreateHabit = useCallback(async () => {
  // ...code
} catch (error) {
  if (__DEV__) console.error('Error creating habit:', error);
  // ❌ NO USER FEEDBACK!
}
```

**File:** `src/features/habits/hooks/useHabitsArchive.ts`

Both archive handlers catch errors but don't show user messages:

```typescript
// Lines ~40: handleArchive
try {
  await archiveHabit({ habitId });
  // ...success
} catch (error) {
  if (__DEV__) console.error('[useHabitsArchive] Archive failed:', error);
  // ❌ NO USER FEEDBACK!
}

// Lines ~58: handleArchiveUndo
try {
  await unarchiveHabit({ habitId: lastArchivedHabitId });
  // ...success
} catch (error) {
  if (__DEV__) console.error('[useHabitsArchive] Undo failed:', error);
  // ❌ NO USER FEEDBACK!
}
```

---

### 3. Missing ErrorBoundary on Auth Screens

**Files:**

- `src/screens/auth/SignInScreen.tsx`
- `src/screens/auth/SignUpScreen.tsx`
- `src/screens/auth/WelcomeScreen.tsx`
- `src/screens/onboarding/OnboardingScreen.tsx`
- `src/screens/TemplatesScreen.tsx`

**Impact:** Auth failures could crash the app with no recovery UI

---

### 4. Network Error Handling - Unclear

**Need to verify:**

- What happens when Convex mutations fail due to network?
- Does the user see an error message?
- Is there retry logic?
- How does offline mode interact with error handling?

**Files to check:**

- `src/contexts/NetworkStatusContext/NetworkStatusProvider.tsx`
- `src/providers/OfflineProvider/OfflineProvider.tsx`

---

## 📋 Recommended Fixes

### Priority 1: Add Toast/Alert for Mutation Failures

Create a reusable error handler utility:

```typescript
// src/utils/errorHandling.ts
export function showUserError(message: string, error?: Error) {
  // Show toast or alert
  // Log to Sentry in production
  // Log to console in dev
}
```

Update all mutation handlers to use it.

### Priority 2: Wrap Auth Screens in ErrorBoundary

Add ScreenErrorBoundary to:

- SignInScreen
- SignUpScreen
- WelcomeScreen
- OnboardingScreen
- TemplatesScreen

### Priority 3: Network Failure UX

Ensure mutations show clear error when offline/Convex unreachable:

- "Connection lost. Please try again."
- Auto-retry options
- Offline queue status

### Priority 4: Async Error Patterns

Add catch handlers to remaining async functions that interact with backend.

---

## 🔍 Next Steps

1. Create error handling utility
2. Add user-facing error messages to all mutation handlers
3. Wrap remaining screens in ErrorBoundary
4. Test network failure scenarios
5. Verify Sentry integration for production errors
