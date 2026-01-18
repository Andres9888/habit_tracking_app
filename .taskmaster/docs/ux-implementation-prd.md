# UX Implementation PRD - Habit Tracking App

## Project Overview

Implement the comprehensive UX specification for the habit tracking mobile app. This PRD covers the development implementation roadmap with 7 core phases targeting MVP + Monetization delivery in 14-24 days.

**Technology Stack:**
- React Native
- React Native Paper (customized theme)
- React Native Reanimated (60fps animations)
- React Native Gesture Handler
- Victory Native (analytics charts)
- Convex (backend)

**Reference Documents:**
- UX Specification: `/Users/andres/Desktop/Code/Me/habit_tracking_app/docs/ux-specification.md`
- PRD: `/Users/andres/Desktop/Code/Me/habit_tracking_app/docs/PRD.md`
- Epics: `/Users/andres/Desktop/Code/Me/habit_tracking_app/docs/epics.md`

---

## Phase 1: Design System Foundation (1-2 days)

**Goal:** Establish the core design system infrastructure that all components will use.

**Requirements:**
- Configure React Native Paper theme with custom color palette from UX spec Section 5.1
- Create typography style constants matching SF Pro type scale (Section 5.2)
- Set up spacing constants using 8pt grid system (4pt, 8pt, 12pt, 16pt, 24pt, 32pt, 48pt, 64pt)
- Create ThemeProvider wrapper component for entire app
- Test Dynamic Type support on iOS (XS to XXXL sizes)
- Export theme constants for use across app

**Deliverables:**
- `src/theme/colors.ts` - Color palette with primary, secondary, semantic, gray scale, strength levels
- `src/theme/typography.ts` - Type scale with Display, Heading 1-3, Body, Caption, Button Text
- `src/theme/spacing.ts` - 8pt grid spacing constants
- `src/theme/index.ts` - Theme provider and theme hook
- `App.tsx` - Wrapped with ThemeProvider

**Acceptance Criteria:**
- All hex values match UX spec exactly (#10B981, #3B82F6, etc.)
- Typography scales with iOS Dynamic Type settings
- Theme accessible via useTheme() hook in any component
- No hardcoded colors/spacing in components (all use theme)

---

## Phase 2: Core Components (3-5 days)

**Goal:** Build reusable component library matching UX spec Section 4.2.

**Requirements:**
- Enhance existing HabitStrengthIndicator with three variants: compact, full, graph
- Build HabitCard component with swipe gesture support for edit/delete
- Create Button component with variants: primary, secondary, ghost, icon
- Implement Modal component: bottom sheet and full screen variants
- Build EmptyState component for no data scenarios
- Create Toast/Snackbar component for user feedback

**Deliverables:**
- `src/components/HabitStrengthIndicator.tsx` - Enhanced with variants
- `src/components/HabitCard.tsx` - Card with swipe actions, strength indicator, completion state
- `src/components/Button.tsx` - All button variants with states
- `src/components/Modal.tsx` - Bottom sheet + full screen modals
- `src/components/EmptyState.tsx` - Illustration, headline, description, CTA
- `src/components/Toast.tsx` - Success, error, info, warning, undo variants

**Acceptance Criteria:**
- HabitStrengthIndicator shows emoji (🌱🌿🌳💪⚡) with progress bar and percentage
- HabitCard responds to tap (complete), swipe left (reveal actions), long press (menu)
- Buttons have proper states: default, pressed (scale 0.95), disabled (50% opacity), loading
- Modals support gestures: pan down to dismiss (bottom sheet), swipe right edge (full screen)
- All components support VoiceOver with descriptive labels
- Touch targets are minimum 44x44pt

---

## Phase 3: Home Screen Implementation (2-3 days)

**Goal:** Implement the main habit list screen with all interactions.

**Requirements:**
- Build habit list using FlatList with performance optimization
- Implement habit completion interaction: tap → checkmark animation → strength update
- Add pull-to-refresh for cloud data sync
- Implement swipe actions on habit cards (edit, delete)
- Add empty state for new users with "Create Your First Habit" CTA
- Test accessibility with VoiceOver enabled

**Deliverables:**
- `src/screens/HomeScreen.tsx` - Main habit list screen
- `src/components/DateHeader.tsx` - Date display component
- Integration with Convex for habit data fetching
- Habit completion mutation with optimistic updates
- Pull-to-refresh with loading state

**Acceptance Criteria:**
- Habit list renders smoothly with 50+ habits (performance tested)
- Tap habit → checkmark appears → strength recalculates → card updates (< 1 second total)
- Swipe left reveals Edit and Delete buttons
- Pull down triggers refresh with spinner animation
- Empty state shows when no habits exist
- VoiceOver announces "Complete [Habit Name]" when tapping cards
- Safe area insets respected (notch, home indicator)

---

## Phase 4: Create Habit Flow (2-3 days)

**Goal:** Build complete habit creation modal with all input fields.

**Requirements:**
- Build Create Habit Modal as bottom sheet
- Integrate existing ColorPickerSheet component
- Add icon picker with horizontal scroll (emoji selection)
- Implement time picker for reminder scheduling
- Add form validation (habit name required)
- Test keyboard behavior and auto-focus

**Deliverables:**
- `src/modals/CreateHabitModal.tsx` - Bottom sheet modal
- `src/components/IconPicker.tsx` - Horizontal scrolling emoji picker
- Integration with ColorPickerSheet (existing)
- Convex mutation for habit creation
- Form validation logic

**Acceptance Criteria:**
- Modal slides up from bottom with spring animation (300ms)
- Text input auto-focuses, keyboard appears
- Icon picker shows 20+ emojis, scrolls horizontally
- Color picker shows palette from UX spec
- Time picker opens iOS native picker
- "Create Habit" button disabled until name entered
- Pan down or tap backdrop dismisses modal
- Successfully creates habit in Convex backend
- Returns to home screen, new habit appears in list

---

## Phase 5: Animation & Motion (2-4 days)

**Goal:** Implement all key animations matching UX spec Section 8.2.

**Requirements:**
- Set up React Native Reanimated and Gesture Handler
- Implement habit completion animation (checkmark, color change, strength update)
- Add modal transitions (bottom sheet slide, full screen slide)
- Create strength progress bar fill animation with spring physics
- Test performance on iPhone SE (60fps minimum)
- Implement Reduce Motion alternatives

**Deliverables:**
- `src/animations/habitCompletion.ts` - Completion animation sequence
- `src/animations/modalTransitions.ts` - Bottom sheet and full screen
- `src/animations/progressBar.ts` - Strength bar fill with spring
- `src/hooks/useReduceMotion.ts` - Accessibility hook
- Haptic feedback integration (react-native-haptic-feedback)

**Acceptance Criteria:**
- Habit completion animation sequence: press (0-100ms) → checkmark (100-300ms) → strength update (300-500ms) → settle (500-600ms)
- All animations use Reanimated native driver (no JS bridge)
- Spring physics: damping=15, stiffness=150 (iOS-native feel)
- Haptic feedback triggers: light (tap), medium (checkmark), heavy (level up)
- Performance: 60fps sustained on iPhone SE
- When Reduce Motion enabled: instant transitions, no bounce/spring
- Animations are interruptible (user can tap/swipe mid-animation)

---

## Phase 6: Accessibility Pass (1-2 days)

**Goal:** Ensure WCAG 2.1 Level AA compliance across all implemented features.

**Requirements:**
- Add VoiceOver labels to all interactive elements
- Test all screens with VoiceOver enabled
- Verify color contrast ratios meet minimums (4.5:1 normal, 3:1 large text)
- Test with Dynamic Type at XXXL size
- Ensure all touch targets are 44pt minimum
- Add VoiceOver custom actions to HabitCard

**Deliverables:**
- Accessibility labels on all buttons, cards, inputs
- VoiceOver custom actions ("Complete habit", "Edit", "Delete")
- Color contrast audit report
- Dynamic Type testing screenshots
- Touch target audit

**Acceptance Criteria:**
- VoiceOver announces all interactive elements with descriptive labels
- "Complete Morning Meditation habit" (not just "Button")
- Custom actions allow VoiceOver users to access swipe actions without swiping
- Color contrast verified: Gray-700 on White (10.8:1), Primary-700 for text (sufficient contrast)
- All text readable at XXXL Dynamic Type size (no clipping)
- All buttons, cards, touch targets measured ≥ 44x44pt
- Tab bar, habit cards, modals fully navigable with VoiceOver
- Color never sole indicator (emoji + color for strength levels)

---

## Phase 7: Premium Features (3-5 days)

**Goal:** Implement monetization infrastructure and premium analytics.

**Requirements:**
- Build Paywall Modal with subscription options
- Implement StoreKit integration for in-app purchases
- Create Analytics Dashboard with Victory Native charts
- Add paywall triggers (tap locked feature, onboarding)
- Implement receipt validation (server-side with Convex)
- Test subscription flow end-to-end

**Deliverables:**
- `src/modals/PaywallModal.tsx` - Subscription paywall
- `src/screens/AnalyticsScreen.tsx` - Premium analytics dashboard
- `src/components/charts/DonutChart.tsx` - Strength distribution
- `src/components/charts/LineChart.tsx` - 30-day trend
- `src/components/charts/Heatmap.tsx` - Compliance calendar
- `src/services/subscription.ts` - StoreKit integration
- Convex functions for receipt validation

**Acceptance Criteria:**
- Paywall shows "7-Day Free Trial" and "$9.99/month" options
- Tapping "Start Free Trial" initiates StoreKit purchase flow
- Receipt validation completes server-side (Convex function)
- Premium status updates in real-time across app
- Analytics tab shows lock badge for free users
- Tapping locked Analytics shows paywall
- Analytics dashboard shows: overview cards, donut chart, line chart, heatmap
- Charts render smoothly (Victory Native), no jank
- "Restore Purchases" button works for existing subscribers
- Test Mode enabled for development (sandbox receipts)

---

## Timeline Summary

**Total Estimated Time:** 14-24 days

- Phase 1: Design System Foundation (1-2 days)
- Phase 2: Core Components (3-5 days)
- Phase 3: Home Screen (2-3 days)
- Phase 4: Create Habit Flow (2-3 days)
- Phase 5: Animation & Motion (2-4 days)
- Phase 6: Accessibility Pass (1-2 days)
- Phase 7: Premium Features (3-5 days)

**Parallel Work Opportunities:**
- Phase 6 (Accessibility) can be done incrementally during Phases 1-5
- Phase 7 (Premium) backend work can start during Phase 5 (Animation)

---

## Success Metrics

**MVP Launch Criteria:**
- Home screen renders habit list (Phase 3) ✓
- Users can create habits (Phase 4) ✓
- Habit completion works with animations (Phase 5) ✓
- App is accessible (Phase 6) ✓
- Design system consistent across app (Phase 1-2) ✓

**Monetization Launch Criteria:**
- Paywall implemented (Phase 7) ✓
- StoreKit integration working (Phase 7) ✓
- Analytics dashboard complete (Phase 7) ✓
- Receipt validation secure (Phase 7) ✓

---

## Technical Notes

**Performance Targets:**
- 60fps animations on iPhone SE
- Habit list scrolling: smooth at 50+ items
- Cold app start: < 2 seconds
- Habit completion: < 1 second end-to-end

**Device Support:**
- Minimum: iPhone SE (375x667pt)
- Target: iPhone 13/14/15 (390x844pt)
- Maximum: iPhone 15 Pro Max (428x926pt)

**Testing Strategy:**
- Unit tests: Business logic (habit strength calculation)
- Integration tests: Critical flows (creation, completion, subscription)
- Manual QA: All features on iPhone SE and iPhone 15 Pro Max
- Accessibility audit: VoiceOver testing on all screens
