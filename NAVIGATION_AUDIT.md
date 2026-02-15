# Navigation & Routing Audit - Chain Day App

**Date**: 2026-02-15  
**Branch**: fix/navigation-audit  
**Auditor**: Subagent (Sonnet)

## Executive Summary

The Chain Day app uses a **modal-based navigation pattern** rather than React Navigation. All "screens" are rendered as Modal components with boolean visibility state. This is a valid architecture for simple apps but has several gaps that need addressing.

## Architecture Overview

### Current Navigation Pattern
- **No React Navigation** - App does not use `@react-navigation/native`
- **Modal-based screens** - All screens are full-screen modals
- **State-based visibility** - Each screen has a boolean state flag (e.g., `showTemplatesScreen`)
- **Auth gate** - `AuthGate` component handles auth routing (Welcome → Onboarding → HabitsApp)

### Navigation Flow
```
App.tsx
  └─ AuthGate
      ├─ WelcomeScreen (unauthenticated)
      ├─ OnboardingScreen (first-time users)
      └─ HabitsApp (authenticated)
          └─ HabitsModals
              ├─ Settings
              ├─ CreateHabit
              ├─ HabitDetail
              ├─ HabitEdit
              ├─ Templates
              ├─ Calendar
              ├─ Visualization
              ├─ QuickActions
              └─ ActivationModal
```

## Audit Findings

### 1. Screen Transitions & Animations ✅ GOOD

**Status**: Working well

**Findings**:
- All modals use React Native's built-in `Modal` with `animationType='slide'`
- Smooth slide-up animations for all screens
- Reanimated used for staggered content animations (FadeInUp with delays)
- Respects `reduceMotion` preference in animations

**Evidence**:
```tsx
// HabitDetailScreen.tsx
<Modal
  transparent
  animationType='slide'
  visible={visible}
  onRequestClose={onClose}
>
```

**Recommendation**: No changes needed. Animations are consistent and smooth.

---

### 2. Deep Link Handling ❌ CRITICAL ISSUE

**Status**: Not implemented

**Findings**:
- App defines URL scheme `habit-tracker` in app.json
- **No deep link handling code exists** - no URL parsing, no route handling
- Cannot open specific habits, screens, or settings via URL
- Push notifications route to activation modal but not via deep links

**Missing Functionality**:
- `habit-tracker://habit/{id}` - Open specific habit detail
- `habit-tracker://create` - Open create habit modal
- `habit-tracker://settings` - Open settings
- `habit-tracker://templates` - Open templates browser
- `habit-tracker://analytics/{habitId}` - Open analytics for habit

**Impact**: 
- No marketing campaign URLs
- No email/notification deep links
- No share links to specific habits
- Reduced user engagement opportunities

**Fix Required**: Implement deep link handler with Expo Linking API

---

### 3. Back Button Behavior ⚠️ PARTIAL

**Status**: Works on Android, but modal stack order issues

**Findings**:
- Android hardware back button handled via `useUnsavedChangesGuard` hook
- Back button correctly prompts when there are unsaved changes
- **Issue**: Modal doesn't handle back press for simple close (relies on `onRequestClose`)
- **Issue**: No visual back button on iOS (relies on swipe-down gesture)
- Nested modals (e.g., Notes Editor inside Habit Detail) may not have correct back behavior

**Evidence**:
```tsx
// useBackHandler.ts
const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  handleBackPress
);
```

**Recommendation**: 
- Add explicit back button handling to all modals
- Verify nested modal back behavior
- Consider adding visible close buttons for better UX

---

### 4. Navigation State Leaks ⚠️ POTENTIAL ISSUE

**Status**: Needs testing but likely has issues

**Findings**:
- All modal states are stored in `useModalVisibilityState` hook
- States are NOT automatically reset when parent modal closes
- **Risk**: Opening Habit Detail → Calendar → closing Detail might leave Calendar state = true
- **Risk**: Multiple modals could show simultaneously if state bugs occur

**Evidence**:
```tsx
// useModalVisibilityState.ts - 12 separate boolean states
const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
const [showEditScreen, setShowEditScreen] = useState(false);
```

**Potential Leak Scenarios**:
1. User opens Habit Detail → opens Notes Editor → rapidly closes Detail
   - Notes Editor might stay open without parent
2. User opens Templates → imports template → creates habit from template
   - Template screen might stay mounted during create flow
3. Quick Actions modal → Share Card → screen rotation
   - State might desync

**Recommendation**: 
- Add cleanup logic to parent modal `onRequestClose`
- Reset child modal states when parent closes
- Add `useEffect` cleanup in modal components

---

### 5. Tab Bar State Persistence N/A

**Status**: No tab navigation

**Findings**:
- App does not have bottom tab navigation
- All navigation is modal-based from single Habits list screen
- Settings and other features are accessed via floating buttons or swipe actions

**Recommendation**: Consider adding tab navigation for:
- Home (Habits list)
- Analytics (streak graphs, stats)
- Profile/Settings
- Templates browser

This would reduce reliance on modals and improve navigation clarity.

---

### 6. Auth-Protected Screens ⚠️ PARTIAL

**Status**: Top-level auth works, but no per-screen checks

**Findings**:
- `AuthGate` component correctly gates the entire app
- Unauthenticated users see `WelcomeScreen`
- First-time users see `OnboardingScreen`
- **No per-screen auth checks** - all screens assume authenticated state

**Potential Issues**:
- If auth session expires mid-use, modals might show stale data
- No fallback UI for auth errors in modal screens
- Share links/deep links could bypass auth if implemented incorrectly

**Evidence**:
```tsx
// AuthGate.tsx
const screenKey = !isSignedIn
  ? 'welcome'
  : !onboardingComplete
    ? 'onboarding'
    : 'app';
```

**Recommendation**: 
- Add auth state checks in critical modals (Create Habit, Edit, Delete)
- Handle Clerk session expiration gracefully
- Add error boundaries for auth-related failures

---

## Additional Observations

### Positive Patterns
- Excellent error boundaries (`ScreenErrorBoundary`)
- Lazy loading of heavy modals (Templates, Visualization, Calendar)
- Keyboard handling with `KeyboardAvoidingView`
- Safe area insets properly handled
- Haptic feedback integration

### Performance Concerns
- 12 boolean states in modal visibility hook (acceptable but could be refactored to reducer)
- All modals rendered in tree even when not visible (mitigated by lazy loading)
- No route-based code splitting (entire app bundles together)

## Priority Issues to Fix

### P0 - Critical
1. **Implement deep link handling** - Core feature gap
2. **Fix nested modal state leaks** - User-facing bugs

### P1 - High Priority
3. **Add proper back button to all modals** - UX improvement
4. **Reset child modal states on parent close** - Prevent state bugs

### P2 - Nice to Have
5. **Consider tab navigation architecture** - Scalability
6. **Add per-screen auth checks** - Security hardening

## Recommended Changes

See implementation in subsequent commits.

---

## Testing Checklist

- [ ] Open Habit Detail → Calendar → close detail quickly (check calendar state)
- [ ] Open Habit Detail → Notes Editor → back button (Android)
- [ ] Open Templates → import → verify templates modal closes
- [ ] Rapid modal open/close (stress test state management)
- [ ] Deep link handling (after implementation)
- [ ] Auth session expiration during modal use
- [ ] Screen rotation during modal flows
- [ ] Accessibility: VoiceOver/TalkBack modal navigation
