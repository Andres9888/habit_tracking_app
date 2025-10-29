# Story 1.5: Basic Onboarding Flow

**Epic:** Epic 1 - MVP Foundation
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 25-30 hours

---

## User Story

**As a** first-time user
**I want to** understand the science-backed approach quickly
**So that** I'm motivated to start tracking habits

---

## Prerequisites

- Story 1.1 complete (can create habits) ✅
- Onboarding screen designs finalized - PENDING

---

## Acceptance Criteria

1. [ ] Three-screen onboarding flow on first app launch
2. [ ] Screen 1: "Real Habit Science, Not Just Streaks" - Shows Lally automaticity curve visualization, explains 90-day formation
3. [ ] Screen 2: "Live Demo" - Interactive: create example "Morning Run" habit, tap to complete, see strength calculate to 3%, delete example
4. [ ] Screen 3: "Get Started" - Permission requests (notifications) with clear value prop, "Create Your First Habit" CTA
5. [ ] Swipe or tap "Next" to advance screens
6. [ ] "Skip" option available (top-right) but tracks skip rate in analytics
7. [ ] Never shows again after completion (AsyncStorage flag)
8. [ ] Completion rate >60% target

---

## Technical Notes

**Libraries to Consider:**

- `react-native-onboarding-swiper` or custom implementation
- `victory-native` for automaticity curve visualization
- `@react-native-async-storage/async-storage` for persistence

**Implementation:**

- Library: react-native-onboarding-swiper or custom implementation
- Visualizations: Use Victory Native charts for automaticity curve
- Persistence: AsyncStorage for onboarding_completed flag
- Analytics: Track screen views, completion rate, skip points
- Design: Match premium aesthetic (calm, science-forward, no gimmicks)

**Key Files to Create:**

- `src/screens/OnboardingScreen.tsx` - Main onboarding flow
- `src/components/Onboarding/WelcomeScreen.tsx` - Screen 1
- `src/components/Onboarding/ScienceExplainerScreen.tsx` - Screen 2
- `src/components/Onboarding/GuidedFirstHabitScreen.tsx` - Screen 3
- `src/utils/onboarding.ts` - Completion tracking helpers

---

## Testing Strategy

**Unit Tests:**

- Onboarding completion flag persistence
- Skip button functionality
- Screen navigation flow

**Integration Tests:**

- Full onboarding flow → first habit creation
- Analytics events firing correctly
- Onboarding never shows again after completion

**User Testing:**

- Test with 10 first-time users
- Measure completion rate
- Measure time to first habit created
- Gather feedback on clarity

**Analytics to Track:**

- Onboarding start rate
- Screen-by-screen drop-off
- Skip vs. complete rate
- Time spent per screen
- First habit creation rate

---

## Implementation Plan (Week 2)

### Day 6: Onboarding Architecture

- Create OnboardingScreen component (3 pages)
- Implement swipeable navigation
- Add page indicator dots
- Design completion detection logic

### Day 7: Screen 1 - Welcome

- Design welcome layout
- Add hero illustration/animation
- Implement "Get Started" CTA
- Add skip button

### Day 8: Screen 2 - Science Explainer

- Create visual explanation of strength algorithm
- Show example progression (0% → 100%)
- Add animated demo
- Write copy citing research

### Day 9: Screen 3 - Guided First Habit

- Embed simplified CreateHabitModal
- Pre-select popular template
- Guide through customization
- Add celebration animation

### Day 10: Polish & Persistence

- Implement completion flag
- Skip onboarding on subsequent opens
- Add analytics tracking
- Polish animations

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] User testing complete (n=10, >60% completion)
- [ ] Analytics events verified
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to main branch

---

## Sprint Planning

**Week:** Week 2 of Epic 1 Sprint
**Days:** Days 6-10 (Monday-Friday)
**Total Effort:** 25-30 hours
**Dependencies:** Story 1.1 (met)

---

**Created:** 2025-10-26
**Target Start:** Week 2, Day 1
**Target Complete:** Week 2, Day 5
