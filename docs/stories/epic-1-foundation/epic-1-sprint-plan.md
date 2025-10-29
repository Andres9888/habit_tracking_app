# Epic 1 Completion - 4-Week Sprint Plan

**Author:** Jane
**Created:** 2025-10-26
**Project:** My Project - Habit Tracking App
**Goal:** Complete Epic 1 (MVP Foundation) for App Store launch readiness

---

## Executive Summary

**Timeline:** 4 weeks (28 days)
**Stories Remaining:** 3 full stories + 2 partial completions
**Current Completion:** ~40% of Epic 1
**Target Completion:** 100% of Epic 1

**Success Criteria:**

- ✅ All 8 Epic 1 stories marked DONE
- ✅ 95%+ test coverage on new code
- ✅ Zero critical bugs
- ✅ App Store submission-ready build
- ✅ >60% onboarding completion rate (tested with beta users)

---

## Week 1: Daily Tracking Core (Story 1.2)

**Goal:** Users can check off habits with delightful UX
**Story:** 1.2 - Daily Habit Check-Off
**Effort:** 30-35 hours

### Day 1 (Monday): Gesture Infrastructure

**Tasks:**

1. ✅ Install/configure react-native-gesture-handler (if not already)
2. ✅ Create HabitCard component with swipeable wrapper
3. ✅ Implement swipe-right detection (threshold: 50% of card width)
4. ✅ Add animated checkmark reveal on swipe

**Acceptance Criteria:**

- [ ] Swipe right animates checkmark into view
- [ ] Swipe left does nothing (reserved for future)
- [ ] Animation uses spring physics (60fps)

**Testing:**

- Manual: Test on iPhone SE (small screen) and iPad (large screen)
- Unit: Test gesture threshold calculations

**Time Estimate:** 6-7 hours

---

### Day 2 (Tuesday): Completion State Management

**Tasks:**

1. ✅ Create `markHabitComplete` mutation in convex/habits.ts
2. ✅ Add optimistic UI update (immediate visual feedback)
3. ✅ Implement completion tracking in habits table (add `completions` array field)
4. ✅ Handle completion toggle (uncomplete if already marked)

**Acceptance Criteria:**

- [ ] Tapping habit card toggles completion state
- [ ] Completed habits show visual distinction (muted color, checkmark icon)
- [ ] UI updates instantly (< 50ms perceived latency)
- [ ] Backend sync happens asynchronously

**Testing:**

- Integration: Test offline → online sync
- Edge case: Rapid toggle (debounce protection)

**Time Estimate:** 7-8 hours

---

### Day 3 (Wednesday): Strength Recalculation Integration

**Tasks:**

1. ✅ Trigger `generateHabitStrengthSnapshot` on completion
2. ✅ Update habit strength values in database
3. ✅ Ensure calculation runs in background (non-blocking)
4. ✅ Add loading indicator if calculation > 100ms

**Acceptance Criteria:**

- [ ] Strength updates within 200ms of completion
- [ ] Progress bar animates to new value
- [ ] Strength level badge updates if crossed threshold
- [ ] No UI jank during calculation

**Testing:**

- Performance: Measure calculation time with 100+ habits
- Unit: Verify strength calculation accuracy

**Time Estimate:** 6-7 hours

---

### Day 4 (Thursday): Undo & Haptics

**Tasks:**

1. ✅ Implement 5-second undo toast notification
2. ✅ Add undo action that reverts completion
3. ✅ Integrate haptic feedback (use expo-haptics)
4. ✅ Add subtle haptic on swipe start, stronger on completion

**Acceptance Criteria:**

- [ ] Toast appears immediately after completion
- [ ] Undo button functional for 5 seconds
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Haptic patterns feel natural (test with users)
- [ ] Haptics work on iOS and Android

**Testing:**

- Manual: Test haptic strength on physical device
- Integration: Test undo → redo → undo sequences

**Time Estimate:** 5-6 hours

---

### Day 5 (Friday): Offline Support & Polish

**Tasks:**

1. ✅ Test offline completion tracking
2. ✅ Verify Convex sync queue works properly
3. ✅ Add visual indicator for offline mode
4. ✅ Polish animations (easing curves, timing)
5. ✅ Code review and refactoring

**Acceptance Criteria:**

- [ ] App works fully offline (local-first)
- [ ] Syncs automatically when back online
- [ ] User sees sync status indicator
- [ ] All animations feel polished

**Testing:**

- QA: Full offline → online → offline cycle
- Regression: Ensure no impact on other features

**Time Estimate:** 6-7 hours

---

### Week 1 Deliverables

**Completed Features:**

- ✅ Swipe-right gesture for habit completion
- ✅ Tap-to-toggle completion state
- ✅ Automatic strength recalculation
- ✅ Undo functionality (5-second window)
- ✅ Haptic feedback
- ✅ Offline support verified

**Success Metrics:**

- Daily check-off takes < 30 seconds for 5 habits
- 0 crashes during gesture interactions
- Strength calculation completes in < 200ms

---

## Week 2: Onboarding Flow (Story 1.5)

**Goal:** New users understand value proposition in < 60 seconds
**Story:** 1.5 - Basic Onboarding Flow
**Effort:** 25-30 hours

### Day 6 (Monday): Onboarding Architecture

**Tasks:**

1. ✅ Create OnboardingScreen component with 3 pages
2. ✅ Implement swipeable page navigation
3. ✅ Add page indicator dots (1/3, 2/3, 3/3)
4. ✅ Design onboarding completion detection logic

**Acceptance Criteria:**

- [ ] Three screens: Welcome, Science Explainer, Create First Habit
- [ ] Users can swipe left/right to navigate
- [ ] Skip button available on all screens
- [ ] Progress dots update on swipe

**Testing:**

- Manual: Test swipe gesture smoothness
- A/B Test idea: Track skip vs. complete rates

**Time Estimate:** 6-7 hours

---

### Day 7 (Tuesday): Screen 1 - Welcome

**Tasks:**

1. ✅ Design welcome screen layout (logo, headline, subheadline)
2. ✅ Add hero illustration or animation
3. ✅ Implement "Get Started" CTA button
4. ✅ Add skip button (top-right)

**Acceptance Criteria:**

- [ ] Headline: "Build Better Habits with Science"
- [ ] Subheadline explains app value in < 15 words
- [ ] Illustration matches brand aesthetic
- [ ] CTA button advances to screen 2

**Testing:**

- User test: Show to 3 people, measure comprehension

**Time Estimate:** 5-6 hours

---

### Day 8 (Wednesday): Screen 2 - Science Explainer

**Tasks:**

1. ✅ Create visual explanation of habit strength algorithm
2. ✅ Show example habit progression (0% → 100% over 90 days)
3. ✅ Add animated progress bar demonstration
4. ✅ Write copy citing research (Zhang et al., Lally et al.)

**Acceptance Criteria:**

- [ ] Users understand "habit strength" concept
- [ ] Visual shows clear before/after transformation
- [ ] Copy mentions "science-backed" explicitly
- [ ] Animation plays automatically on screen load

**Testing:**

- User test: Ask users to explain habit strength back to you

**Time Estimate:** 6-7 hours

---

### Day 9 (Thursday): Screen 3 - Guided First Habit

**Tasks:**

1. ✅ Embed simplified CreateHabitModal into onboarding
2. ✅ Pre-select popular habit template (e.g., "💧 Drink Water")
3. ✅ Guide user through: rename → pick color → set reminder
4. ✅ Add celebration animation on habit creation

**Acceptance Criteria:**

- [ ] Template auto-fills with sensible defaults
- [ ] User can customize or skip customization
- [ ] Creating habit completes onboarding
- [ ] Celebration animation feels rewarding (confetti, sound)

**Testing:**

- Conversion tracking: Measure % who create first habit
- Edge case: User exits mid-onboarding

**Time Estimate:** 7-8 hours

---

### Day 10 (Friday): Onboarding Polish & Persistence

**Tasks:**

1. ✅ Implement onboarding completion flag in user settings
2. ✅ Skip onboarding on subsequent app opens
3. ✅ Add "replay onboarding" option in settings (optional)
4. ✅ Analytics: Track skip vs. complete, time spent per screen
5. ✅ Polish transitions and animations

**Acceptance Criteria:**

- [ ] Onboarding shows only on first app open
- [ ] Skip button works from any screen
- [ ] Analytics events fire correctly
- [ ] All animations smooth (60fps)

**Testing:**

- QA: Fresh install → onboarding → complete → reopen app (should skip)
- Analytics: Verify events in Convex dashboard

**Time Estimate:** 5-6 hours

---

### Week 2 Deliverables

**Completed Features:**

- ✅ 3-screen onboarding flow
- ✅ Welcome + Science Explainer + Guided First Habit
- ✅ Skip functionality
- ✅ Celebration animation
- ✅ Onboarding completion tracking

**Success Metrics:**

- > 60% complete onboarding (target from epic goals)
- Average time to first habit created: < 90 seconds
- 0 crashes during onboarding

---

## Week 3: Data Management & Editing (Stories 1.6 + 1.7)

**Goal:** Robust data persistence and habit modification
**Stories:** 1.6 (Local Data Persistence) + 1.7 (Habit Editing)
**Effort:** 30-35 hours

### Day 11 (Monday): Data Persistence Audit (Story 1.6)

**Tasks:**

1. ✅ Review Convex sync architecture
2. ✅ Test offline → online sync reliability
3. ✅ Verify conflict resolution strategy (last-write-wins or custom?)
4. ✅ Add local storage caching if needed (AsyncStorage)

**Acceptance Criteria:**

- [ ] App works 100% offline
- [ ] Syncs automatically when online
- [ ] No data loss during offline → online transition
- [ ] Conflicts resolved gracefully

**Testing:**

- Stress test: Create 50 habits offline, go online, verify sync
- Edge case: Delete habit offline, sync, verify deletion

**Time Estimate:** 7-8 hours

---

### Day 12 (Tuesday): Edit Habit Modal (Story 1.7 - Part 1)

**Tasks:**

1. ✅ Refactor CreateHabitModal to support edit mode
2. ✅ Pass `habitToEdit` prop to pre-fill form
3. ✅ Change "Create" button to "Save" in edit mode
4. ✅ Implement `updateHabit` mutation integration

**Acceptance Criteria:**

- [ ] Tapping habit opens edit modal
- [ ] All fields pre-filled with current values
- [ ] Saving updates habit immediately (optimistic UI)
- [ ] Cancel button discards changes

**Testing:**

- Regression: Ensure create flow still works
- Edge case: Edit habit with active completion streak

**Time Estimate:** 6-7 hours

---

### Day 13 (Wednesday): Delete & Archive (Story 1.7 - Part 2)

**Tasks:**

1. ✅ Add "Delete Habit" button in edit modal (destructive style)
2. ✅ Implement delete confirmation dialog
3. ✅ Create archive/unarchive functionality
4. ✅ Add "Archived Habits" section in settings

**Acceptance Criteria:**

- [ ] Delete requires confirmation ("Are you sure?")
- [ ] Deleted habits removed from UI immediately
- [ ] Archive preserves habit data (soft delete)
- [ ] Archived habits can be restored

**Testing:**

- Data integrity: Delete habit, verify no orphaned completion records
- UX: Test accidental delete prevention

**Time Estimate:** 6-7 hours

---

### Day 14 (Thursday): Habit Management UI (Story 1.7 - Part 3)

**Tasks:**

1. ✅ Add long-press on habit card to show context menu
2. ✅ Context menu options: Edit, Archive, Delete
3. ✅ Implement drag-to-reorder habit list (optional)
4. ✅ Add bulk actions (select multiple habits)

**Acceptance Criteria:**

- [ ] Long-press shows context menu
- [ ] All menu options functional
- [ ] Drag-to-reorder feels natural (if implemented)
- [ ] Bulk actions work smoothly (select → delete/archive)

**Testing:**

- Usability: Test with 20+ habits (performance check)
- Accessibility: Ensure VoiceOver reads menu options

**Time Estimate:** 7-8 hours

---

### Day 15 (Friday): Testing & Bug Fixes (Story 1.6 + 1.7)

**Tasks:**

1. ✅ Write integration tests for edit flow
2. ✅ Write integration tests for delete/archive
3. ✅ Test offline data persistence edge cases
4. ✅ Fix any bugs discovered during testing
5. ✅ Code review and refactoring

**Acceptance Criteria:**

- [ ] All new code covered by tests (>90%)
- [ ] No known bugs in edit/delete flows
- [ ] Performance acceptable with 100+ habits

**Testing:**

- Full regression suite on Stories 1.1-1.7
- Performance profiling (React DevTools)

**Time Estimate:** 6-7 hours

---

### Week 3 Deliverables

**Completed Features:**

- ✅ Verified offline-first data persistence
- ✅ Edit habit functionality
- ✅ Delete with confirmation
- ✅ Archive/restore habits
- ✅ Habit management UI (context menu, reorder)

**Success Metrics:**

- Zero data loss in offline scenarios
- Edit/delete operations complete in < 100ms
- 95%+ test coverage on new code

---

## Week 4: Design System & Launch Prep (Story 1.8 + QA)

**Goal:** Production-ready codebase, consistent UI, zero critical bugs
**Story:** 1.8 - Core Design System Foundation + Epic 1 QA
**Effort:** 35-40 hours

### Day 16 (Monday): Design System Documentation

**Tasks:**

1. ✅ Document color palette (expand from 6 to 12-16 colors)
2. ✅ Define typography scale (heading, body, caption sizes)
3. ✅ Create spacing system (4px base unit: 4, 8, 12, 16, 24, 32, 48)
4. ✅ Document component API (Button, Card, Input, Modal)

**Acceptance Criteria:**

- [ ] Design system documented in /docs/design-system.md
- [ ] Color palette includes primary, secondary, neutrals, feedback colors
- [ ] Typography follows mobile-friendly sizing
- [ ] All spacing uses consistent scale

**Testing:**

- Review: Show to designer or get user feedback

**Time Estimate:** 6-7 hours

---

### Day 17 (Tuesday): Component Library

**Tasks:**

1. ✅ Create reusable Button component (primary, secondary, text variants)
2. ✅ Create Card component (with elevation, border radius)
3. ✅ Create Input component (with validation states)
4. ✅ Extract common patterns from existing components

**Acceptance Criteria:**

- [ ] Components follow design system
- [ ] All variants documented with examples
- [ ] Components used consistently across app
- [ ] Storybook or similar documentation (optional)

**Testing:**

- Visual regression: Screenshot tests for all variants
- Accessibility: Test with VoiceOver, Dynamic Type

**Time Estimate:** 7-8 hours

---

### Day 18 (Wednesday): Dark Mode Foundation (Stretch Goal)

**Tasks:**

1. ✅ Define dark mode color palette
2. ✅ Implement theme provider context
3. ✅ Add theme toggle in settings
4. ✅ Update all components to support dark mode

**Acceptance Criteria:**

- [ ] Dark mode toggle works globally
- [ ] All screens render correctly in dark mode
- [ ] Follows iOS/Android system preference
- [ ] Smooth theme transition animation

**Testing:**

- Visual QA: Review every screen in dark mode
- Edge case: Switch theme mid-interaction

**Time Estimate:** 8-9 hours (or skip if time-constrained)

---

### Day 19 (Thursday): End-to-End QA - Part 1

**Tasks:**

1. ✅ Test complete user journey: Install → Onboard → Create → Check-off → Edit
2. ✅ Test all Epic 1 acceptance criteria systematically
3. ✅ Document bugs in issue tracker (priority: Critical, High, Medium, Low)
4. ✅ Fix critical bugs immediately

**Acceptance Criteria:**

- [ ] All Epic 1 stories pass acceptance criteria
- [ ] Zero critical bugs
- [ ] < 5 high-priority bugs remaining

**Testing:**

- Device matrix: iPhone SE, iPhone 14, iPad, Android phone
- Network conditions: Offline, slow 3G, fast WiFi

**Time Estimate:** 7-8 hours

---

### Day 20 (Friday): End-to-End QA - Part 2 + Polish

**Tasks:**

1. ✅ Fix remaining high-priority bugs
2. ✅ Polish animations and transitions
3. ✅ Optimize performance (reduce bundle size, improve load time)
4. ✅ Run final test suite (unit + integration)
5. ✅ Prepare for App Store submission (screenshots, metadata)

**Acceptance Criteria:**

- [ ] All tests passing
- [ ] App feels polished and professional
- [ ] Load time < 3 seconds
- [ ] Bundle size optimized

**Testing:**

- Performance audit: Lighthouse or similar
- Final approval: Internal stakeholder review

**Time Estimate:** 8-9 hours

---

### Week 4 Deliverables

**Completed Features:**

- ✅ Documented design system
- ✅ Reusable component library
- ✅ Dark mode support (stretch goal)
- ✅ Zero critical bugs
- ✅ App Store submission-ready

**Success Metrics:**

- 100% of Epic 1 stories marked DONE
- 95%+ test coverage
- App Store approval achieved (or submitted)
- > 60% onboarding completion rate

---

## Success Metrics Dashboard

Track these metrics weekly:

| Metric            | Week 1 | Week 2 | Week 3 | Week 4 | Target |
| ----------------- | ------ | ------ | ------ | ------ | ------ |
| Stories Complete  | 5/8    | 6/8    | 7/8    | 8/8    | 8/8    |
| Test Coverage     | 75%    | 80%    | 90%    | 95%    | 95%+   |
| Critical Bugs     | ?      | ?      | ?      | 0      | 0      |
| Onboarding Rate   | -      | 50%    | 55%    | 65%    | 60%+   |
| Performance Score | -      | -      | -      | 90+    | 85+    |

---

## Risk Mitigation

**Risk 1: Offline sync complexity**
**Mitigation:** Allocate extra Day 11 time, consider simplifying if needed

**Risk 2: Dark mode scope creep**
**Mitigation:** Mark as stretch goal, skip if behind schedule

**Risk 3: QA uncovers major bugs**
**Mitigation:** Buffer Day 20 for critical fixes, defer nice-to-haves

---

## Next Actions

**To start Week 1 immediately:**

1. Create Story 1.2 tech spec (or use existing epic details)
2. Set up task tracking (Jira, Linear, or simple checklist)
3. Begin Day 1 tasks (gesture infrastructure)

**Questions before starting?**

- Clarify any acceptance criteria
- Adjust timeline if needed
- Review technical approach

---

**Sprint Plan Created:** 2025-10-26
**Ready to execute!** 🚀
