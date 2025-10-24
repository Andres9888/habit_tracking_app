# Story: Premium Analytics Dashboard

**Status:** Approved
**Epic:** Phase 2 - Monetization
**Story ID:** P2.1
**Created:** 2025-10-23
**Priority:** High

---

## User Story

**As a** premium subscriber,
**I want** a comprehensive analytics dashboard showing my habit patterns and insights,
**so that** I can understand my progress scientifically and make data-driven improvements to my habits.

---

## Business Context

This is a **Phase 2: Monetization** feature that justifies the $9.99/month subscription. Analytics must feel premium, scientific, and indispensable to drive 5-10% free-to-paid conversion.

**Revenue Impact:**
- Primary premium feature (alongside predictions)
- Drives trial-to-paid conversion
- Reduces churn through ongoing value demonstration
- Supports $2K-$10K MRR goal

---

## Acceptance Criteria

### AC1: Overview Dashboard Cards

- [ ] Display "Total Habits" stat card showing count of active habits
- [ ] Display "Average Strength" stat card showing overall habit strength percentage
- [ ] Display "Strongest Habit" card with name, emoji, and strength %
- [ ] Display "Weakest Habit" card with name, emoji, and strength %
- [ ] All cards use design system colors and spacing (16pt padding, 8pt margin)
- [ ] Cards are tappable to navigate to habit detail

### AC2: Strength Distribution Visualization

- [ ] Donut chart showing habit distribution by strength level (Starting 🌱, Building 🌿, Developing 🌳, Strong 💪, Automatic ⚡)
- [ ] Chart uses brand color palette from UX spec (Section 5.1)
- [ ] Legend below chart shows percentage for each level
- [ ] Tap segment to filter habit list by that level
- [ ] Chart animates on load (segments grow from 0 to value, spring physics, 400ms)
- [ ] Shows empty state if user has no habits

### AC3: 30-Day Trend Graph

- [ ] Line chart showing average habit strength over 30 days
- [ ] X-axis: Days (labeled every 7 days)
- [ ] Y-axis: Strength percentage (0-100%)
- [ ] Line color: Primary green (#10B981)
- [ ] Data points tappable to show exact date and strength value
- [ ] Chart scrollable/pannable for longer date ranges
- [ ] Animates on load (line draws from left to right, 500ms)

### AC4: Compliance Heatmap Calendar

- [ ] GitHub-style calendar showing last 90 days
- [ ] Green squares for days with >70% habit completion
- [ ] Light green for 40-70% completion
- [ ] Gray for <40% completion
- [ ] Empty squares for days with no data
- [ ] Tap square to show day detail with completed habits
- [ ] Responsive layout (adjusts to screen width)

### AC5: Habit Rankings List

- [ ] Scrollable list of all habits ranked by strength (highest to lowest)
- [ ] Each item shows: Habit name, emoji, strength %, strength indicator bar
- [ ] Tap habit to navigate to detail view
- [ ] Shows current streak days
- [ ] Indicates habits "at risk" (predicted to drop) with warning icon

### AC6: Weekly Insights Section (Premium)

- [ ] "This Week's Summary" card showing week-over-week changes
- [ ] "Habits Gained Strength" list (green +N%)
- [ ] "Habits Lost Strength" list (red -N%)
- [ ] "Habits at Risk" warning with suggested focus actions
- [ ] Insight data generated weekly via Convex scheduled function
- [ ] Archive of past weekly reports accessible

### AC7: Data Export Functionality

- [ ] "Export Data" button accessible from Analytics screen
- [ ] Format options: CSV, JSON
- [ ] Exports all habit data: name, dates, completions, strength history
- [ ] Uses iOS Share Sheet to save/email/share file
- [ ] Shows success toast on export completion
- [ ] Handles export errors gracefully

### AC8: Premium Paywall for Free Users

- [ ] Free users see blurred chart previews
- [ ] "Unlock Analytics" overlay with premium badge
- [ ] "Start 7-Day Trial" CTA button (48pt height, primary green)
- [ ] Tap CTA opens paywall modal (from Phase 2)
- [ ] Premium users have full access with no restrictions

### AC9: Loading & Error States

- [ ] Skeleton screens while loading data (shimmer effect per UX spec Section 8.2)
- [ ] Error state with retry button if data load fails
- [ ] Empty state if user has <7 days of data ("Collecting data...")
- [ ] Pull-to-refresh to manually sync latest data

### AC10: Accessibility & Performance

- [ ] All charts have text summary for VoiceOver users
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Touch targets are 44pt minimum
- [ ] Charts render at 60fps on iPhone SE
- [ ] Dynamic Type support up to XXXL
- [ ] Reduce Motion alternatives (instant transitions, no animations)

---

## Dev Agent Record

### Context Reference

**Primary Context:**
- UX Specification: `/Users/andres/Desktop/Code/Me/habit_tracking_app/docs/ux-specification.md`
  - Section 2.1: Analytics Tab Structure
  - Section 3 (Flow 4): Viewing Premium Analytics
  - Section 4.2: Chart Components
  - Section 5: Visual Design (colors, typography, spacing)
  - Section 8.2: Animation specs (skeleton screens, chart animations)
  - Section 9.2: Analytics Dashboard wireframe

**Technology Stack:**
- **Charts:** Victory Native (data visualization)
- **Animations:** React Native Reanimated (60fps native animations)
- **Backend:** Convex queries for analytics data aggregation
- **Premium Check:** Subscription status from StoreKit/RevenueCat

### Existing Codebase Context

**Related Files:**
- `src/App.tsx` - Main app structure, tab navigation
- `src/components/HabitStrengthIndicator.tsx` - Reusable strength visualization
- `convex/habits.ts` - Habit data queries
- `convex/schema.ts` - Data schema

**Existing Components to Reuse:**
- HabitStrengthIndicator (compact variant for rankings)
- Card component from design system
- Modal component for detail views

---

## Technical Tasks (Parallelizable)

### Task Group 1: Overview & Layout (Agent 1)
**Dependencies:** None
**Estimated Time:** 3-4 hours

1.1. Create `src/screens/AnalyticsScreen.tsx` with tab navigation integration
1.2. Build overview stat cards (Total Habits, Avg Strength, Strongest, Weakest)
1.3. Implement card layout with 8pt grid spacing
1.4. Add tap handlers to navigate to habit details
1.5. Implement pull-to-refresh functionality
1.6. Add skeleton loading states for cards

### Task Group 2: Charts Implementation (Agent 2)
**Dependencies:** None (can work in parallel)
**Estimated Time:** 5-6 hours

2.1. Install and configure Victory Native
2.2. Create `src/components/StrengthDistributionChart.tsx` (donut chart)
2.3. Create `src/components/TrendLineChart.tsx` (30-day trend)
2.4. Create `src/components/ComplianceHeatmap.tsx` (GitHub-style calendar)
2.5. Implement chart animations (spring physics, 400-500ms)
2.6. Add tap interactions for data point details
2.7. Test chart performance on iPhone SE (60fps requirement)

### Task Group 3: Insights & Rankings (Agent 3)
**Dependencies:** None (can work in parallel)
**Estimated Time:** 4-5 hours

3.1. Create `src/components/HabitRankingsList.tsx`
3.2. Create `src/components/WeeklyInsightsCard.tsx`
3.3. Implement habit ranking logic (sort by strength)
3.4. Build weekly insights UI (gained/lost/at-risk sections)
3.5. Add archive functionality for past insights
3.6. Implement "suggested focus" action buttons

### Task Group 4: Backend Data Aggregation (Agent 4)
**Dependencies:** None (can work in parallel)
**Estimated Time:** 3-4 hours

4.1. Create `convex/analytics.ts` with aggregation queries
4.2. Implement `getOverviewStats` query (total, avg, strongest, weakest)
4.3. Implement `getStrengthDistribution` query (group by level)
4.4. Implement `get30DayTrend` query (daily avg strength)
4.5. Implement `getComplianceData` query (90-day completion grid)
4.6. Implement `getWeeklyInsights` scheduled function
4.7. Add proper indexes for query performance

### Task Group 5: Export & Premium Integration (Agent 5)
**Dependencies:** Task 1 (layout)
**Estimated Time:** 2-3 hours

5.1. Create `src/utils/exportData.ts` with CSV/JSON formatters
5.2. Implement iOS Share Sheet integration
5.3. Add premium status check (subscription validation)
5.4. Create paywall overlay for free users (blurred previews)
5.5. Integrate with paywall modal from Phase 2
5.6. Add success/error toasts for export

### Task Group 6: Accessibility & Polish (Agent 6)
**Dependencies:** Tasks 1-5 (runs after core implementation)
**Estimated Time:** 2-3 hours

6.1. Add VoiceOver labels to all charts and interactive elements
6.2. Implement text summaries for charts (screen reader alternative)
6.3. Verify color contrast ratios (WCAG AA compliance)
6.4. Test with Dynamic Type at XXXL size
6.5. Implement Reduce Motion alternatives (no animations)
6.6. Test all touch targets are 44pt minimum
6.7. Full accessibility audit with VoiceOver enabled

---

## Definition of Done

- [ ] All 10 acceptance criteria verified and passing
- [ ] Charts render at 60fps on iPhone SE
- [ ] Premium paywall correctly gates free users
- [ ] Export functionality works (CSV and JSON)
- [ ] Weekly insights generate automatically
- [ ] VoiceOver fully functional for all elements
- [ ] WCAG AA accessibility compliance verified
- [ ] Pull-to-refresh syncs latest data
- [ ] Empty states and error states tested
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] Analytics tracking events firing correctly

---

## Success Metrics

- **Premium Conversion:** Target 5-10% of users who view analytics start trial
- **Feature Usage:** 70%+ of premium users access analytics weekly
- **Session Time:** Analytics increases avg session time by 30%
- **Churn Reduction:** Premium users who use analytics have <3% monthly churn
- **Export Usage:** 20%+ of premium users export data monthly

---

**Story Created By:** Amelia (Dev Agent)
**Date:** 2025-10-23

---
