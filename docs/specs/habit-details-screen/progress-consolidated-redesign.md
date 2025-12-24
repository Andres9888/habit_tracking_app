# Progress Section Consolidated Redesign - Technical Specification

**Version:** 1.0
**Date:** 2024-12-24
**Status:** Draft
**Design Mock:** `.superdesign/design_iterations/progress_consolidated_1.html`

---

## 1. Overview

### 1.1 Problem Statement

The current Progress section has visual hierarchy and information density issues:

- 3 separate cards with different gradient themes create visual noise
- Redundant information (streak/strength shown in stats strip AND in cards)
- Excessive vertical scrolling required
- No clear information hierarchy or narrative flow
- High cognitive load from competing visual elements

### 1.2 Solution

Consolidate the 3 cards (YourProgressCard, PersonalBestsCard, ThisMonthCard) into a single unified component with:

- Clear visual hierarchy (Hero → Insights → Pattern → Action)
- Horizontal scroll insight chips to reduce vertical space
- Single neutral gradient theme
- Progressive disclosure for secondary information (streak records)
- ~35% reduction in vertical space

### 1.3 Success Metrics

- Reduced scroll depth to view all progress information
- Improved user comprehension (qualitative feedback)
- Maintained accessibility standards (VoiceOver/TalkBack)
- No regression in animation performance

---

## 2. Design Specifications

### 2.1 Component Structure

```
ProgressSectionConsolidated/
├── ProgressSectionConsolidated.tsx  (main container)
├── HeroStrengthSection.tsx          (progress ring + level info)
├── InsightChips.tsx                 (horizontal scroll chips)
├── WeeklyPatternChart.tsx           (compact bar chart)
├── ActionableTipCard.tsx            (CTA section)
├── StreakRecordsAccordion.tsx       (collapsed streak medals)
├── types.ts                         (shared interfaces)
├── utils.ts                         (calculations - reuse existing)
└── __tests__/
    ├── ProgressSectionConsolidated.test.tsx
    ├── HeroStrengthSection.test.tsx
    ├── InsightChips.test.tsx
    ├── WeeklyPatternChart.test.tsx
    └── StreakRecordsAccordion.test.tsx
```

### 2.2 Visual Specifications

#### Container Card

- **Background:** Neutral gradient `linear-gradient(135deg, #fff 0%, #fafaf9 50%, #f5f5f4 100%)`
- **Border:** `1px solid rgba(214, 211, 209, 0.6)` (stone-300/60)
- **Border Radius:** 16px
- **Shadow:** `0 1px 3px rgba(0,0,0,0.1)`
- **Padding:** 16px

#### Hero Section (HeroStrengthSection)

- **Progress Ring Size:** 100px (increased from 88px)
- **Ring Stroke Width:** 10px
- **Ring Glow:** `drop-shadow(0 0 8px rgba(color, 0.3))`
- **Emoji Size:** 24px (text-2xl)
- **Percentage Size:** 20px bold (text-xl)
- **Level Badge:** 14px semibold, pill shape
- **Trend Badge:** 12px medium, emerald/red based on direction

#### Insight Chips (InsightChips)

- **Layout:** Horizontal scroll (flex, overflow-x-auto)
- **Chip Padding:** 8px 12px
- **Chip Border Radius:** 12px
- **Chip Background:** white
- **Chip Border:** 1px solid (contextual color)
- **Gap:** 8px
- **Scroll Behavior:** `-webkit-overflow-scrolling: touch`

| Chip           | Icon | Border Color | Pulse Animation |
| -------------- | ---- | ------------ | --------------- |
| Current Streak | 🔥   | orange-200   | Yes (if active) |
| Best Day       | 🏆   | emerald-200  | No              |
| Focus Day      | ⚡   | amber-200    | No              |
| This Month     | 📅   | violet-200   | No              |

#### Weekly Pattern Chart (WeeklyPatternChart)

- **Container Height:** 56px (h-14)
- **Bar Width:** 20px (w-5)
- **Bar Max Height:** 40px (h-10)
- **Background:** stone-50 rounded-xl
- **Bar Colors:**
  - Best day: emerald-500
  - Worst day: amber-400
  - Good (>70%): stone-400
  - Medium (50-70%): stone-300
  - Low (<50%): stone-200
- **Day Labels:** 10px, bold for best/worst

#### Actionable Tip Card (ActionableTipCard)

- **Background:** `linear-gradient(to right, violet-50, indigo-50)`
- **Border:** 1px solid violet-100
- **Border Radius:** 12px
- **Padding:** 12px
- **Icon Container:** 40px circle, violet-100 bg

#### Streak Records Accordion (StreakRecordsAccordion)

- **Default State:** Collapsed
- **Container:** white bg, stone-200 border, 12px radius
- **Padding:** 12px
- **Preview:** Medal emojis with counts (🥇6 🥈6 🥉2)
- **Expanded Content:** Same as current PersonalBestsCard medals

### 2.3 Animation Specifications

| Element              | Animation                   | Duration                  | Easing                     |
| -------------------- | --------------------------- | ------------------------- | -------------------------- |
| Progress Ring Fill   | strokeDashoffset            | 1200ms                    | ease-out (cubic)           |
| Emoji Scale          | scale 0→1                   | 300ms delay + spring      | damping: 8, stiffness: 150 |
| Insight Chips        | FadeInRight staggered       | 50ms delay each           | ease-out                   |
| Bar Chart            | scaleY 0→1 staggered        | 600ms total, 50ms stagger | spring                     |
| Streak Accordion     | height + opacity            | 250ms                     | ease-out                   |
| Current Streak Pulse | scale 1→1.05, opacity 0.6→1 | 2000ms infinite           | ease-in-out                |

### 2.4 Accessibility Requirements

- All chips keyboard navigable
- VoiceOver/TalkBack labels for all data points
- Respect `reduceMotion` preference
- Minimum touch targets: 44x44px
- Color contrast ratio ≥ 4.5:1
- Accordion state announced to screen readers

---

## 3. Data Flow

### 3.1 Props Interface

```typescript
interface ProgressSectionConsolidatedProps {
  // Existing props (unchanged)
  tracking: TrackingEntry[];
  habitCreatedAt: string;
  strength: number;
  weeklyChange?: number;

  // Callbacks
  onInfoPress?: () => void;
  onFocusDayPress?: () => void;
  onSeeAllPress?: () => void;
  onTipPress?: () => void;
}
```

### 3.2 Derived Data (reuse existing utils)

- `dayStats` - from `calculateDayOfWeekStats()`
- `currentStreak` - from `calculateCurrentStreak()`
- `streakRecords` - from `calculateStreakRecords()`
- `trend` - from `calculateTrendComparison()`
- `bestDay` / `worstDay` - from existing logic
- `actionableTip` - from `generateActionableTip()`

---

## 4. Implementation Tasks

### Phase 1: Component Architecture (Foundation)

- [x] **Task 1.1:** Create `ProgressSectionConsolidated/` directory structure ✅
  - Create folder and index.ts exports
  - Set up types.ts with new interfaces
  - Dependencies: None
  - Estimate: 0.5h
  - **Completed:** Created full directory structure with:
    - `index.ts` with all component exports and re-exports from ProgressSection utils
    - `types.ts` with comprehensive interfaces for all sub-components, STRENGTH_LEVELS constants, and helper functions (getLevelFromStrength, getProgressToNextLevel)
    - Placeholder implementations for all 6 components (ProgressSectionConsolidated, HeroStrengthSection, InsightChips, WeeklyPatternChart, ActionableTipCard, StreakRecordsAccordion)
    - `__tests__/` directory for future test files

- [x] **Task 1.2:** Create `HeroStrengthSection` component ✅
  - Progress ring (100px) with glow effect
  - Level badge and trend indicator
  - Progress bar to next level
  - Reuse existing animation logic from YourProgressCard
  - Dependencies: 1.1
  - Estimate: 2h
  - **Completed:** Implemented full HeroStrengthSection component with:
    - 100px animated progress ring with glow effect (shadowColor matching level color)
    - 1200ms ease-out ring fill animation with strokeDashoffset
    - Animated emoji scale (300ms delay + spring with damping: 8, stiffness: 150)
    - Level badge displaying current level (Starting Out, Building, Growing, Strong, Unbreakable)
    - Trend indicator showing weekly change (+X%, -X%, or Stable)
    - Animated progress bar to next level with "X% to [emoji]" text
    - Full accessibility support (VoiceOver/TalkBack labels, reduceMotion preference)
    - 27 passing unit tests covering all levels, trends, clamping, and accessibility

- [x] **Task 1.3:** Create `InsightChips` component ✅
  - Horizontal scroll container
  - 4 chip types: streak, best day, focus day, monthly
  - Pulse animation for active streak
  - Haptic feedback on tap
  - Dependencies: 1.1
  - Estimate: 2h
  - **Completed:** Implemented full InsightChips component with:
    - Horizontal ScrollView with touch momentum and hidden scroll indicator
    - 4 chip types: Current Streak (🔥), Best Day (🏆), Focus Day (⚡), Monthly (📅)
    - Staggered entrance animations (50ms delay per chip) with FadeInRight effect
    - Pulse animation (scale 1→1.05, opacity 0→0.6→0) for active streak chip (continuous 2s cycle)
    - Haptic feedback via useHapticFeedback hook (triggerSelection on tap)
    - Press animation with spring scale (0.95 on press)
    - Full accessibility support (labels, hints, roles, reduceMotion preference)
    - 36 passing unit tests covering rendering, interactions, and accessibility

- [x] **Task 1.4:** Create `WeeklyPatternChart` component ✅
  - Compact 7-day bar chart (56px height)
  - Color coding by performance
  - Staggered bar animations
  - Dependencies: 1.1
  - Estimate: 1.5h
  - **Completed:** Implemented full WeeklyPatternChart component with:
    - 56px compact chart container with 40px max bar height
    - 7 animated day bars with staggered entrance (50ms delay per bar)
    - Color coding: emerald-500 (best day), amber-400 (focus/worst day), stone gradients by rate
    - Best day identification (highest rate with data)
    - Focus day identification (lowest rate < 70%, different from best)
    - "Details" button with onSeeAllPress callback
    - Legend showing Best/Focus indicators
    - Full accessibility: chart summary, per-bar labels with day/rate/status
    - reduceMotion preference support via useReduceMotion hook
    - 30 passing unit tests covering rendering, highlighting, accessibility, edge cases

- [ ] **Task 1.5:** Create `ActionableTipCard` component
  - Gradient background with icon
  - Tip text from existing generator
  - Chevron for tap affordance
  - Dependencies: 1.1
  - Estimate: 1h

- [ ] **Task 1.6:** Create `StreakRecordsAccordion` component
  - Collapsed by default with preview
  - Expand/collapse animation
  - Medal display when expanded
  - Dependencies: 1.1
  - Estimate: 1.5h

### Phase 2: Integration & Container

- [ ] **Task 2.1:** Create `ProgressSectionConsolidated` container
  - Compose all sub-components
  - Single card wrapper with unified styling
  - Data flow from props to children
  - Dependencies: 1.2, 1.3, 1.4, 1.5, 1.6
  - Estimate: 2h

- [ ] **Task 2.2:** Update `HabitDetailScreen` to use new component
  - Feature flag for A/B testing (optional)
  - Replace ProgressSection import
  - Verify prop compatibility
  - Dependencies: 2.1
  - Estimate: 1h

- [ ] **Task 2.3:** Remove redundant stats strip when Progress tab active
  - Conditional rendering based on active tab
  - Smooth transition when switching tabs
  - Dependencies: 2.2
  - Estimate: 1h

### Phase 3: Testing

- [x] **Task 3.1:** Unit tests for `HeroStrengthSection` ✅
  - Ring animation, level display, trend indicator
  - Accessibility labels
  - reduceMotion behavior
  - Dependencies: 1.2
  - Estimate: 1h
  - **Completed:** 27 passing tests covering level display, trend indicators, progress to next level, strength clamping, accessibility, visual elements, and reduceMotion support

- [x] **Task 3.2:** Unit tests for `InsightChips` ✅
  - Chip rendering, scroll behavior
  - Pulse animation for active streak
  - Tap callbacks
  - Dependencies: 1.3
  - Estimate: 1h
  - **Completed:** 36 passing tests covering:
    - Rendering (all 4 chip types, conditional rendering when data is null)
    - Streak chip (singular/plural formatting, zero streak handling)
    - Best Day chip (name display, completion rate with rounding)
    - Focus Day chip (interactive state, onPress callback, haptic feedback)
    - Monthly chip (fraction display, edge cases)
    - Accessibility (container role, chip labels/hints, active streak indication)
    - Edge cases (minimal props, large numbers, 0%/100% rates)
    - Chip data generation (ordering, memoization)
    - Reduced motion preference handling
    - Press interactions (pressIn/pressOut events)

- [x] **Task 3.3:** Unit tests for `WeeklyPatternChart` ✅
  - Bar heights, color coding
  - Best/worst day highlighting
  - Animation stagger
  - Dependencies: 1.4
  - Estimate: 1h
  - **Completed:** 30 passing tests covering:
    - Rendering (header, legend, all 7 day bars)
    - Best/worst day highlighting (identification, styling, edge cases)
    - Color coding (emerald for best, amber for focus, stone gradients)
    - Details button (rendering, callback invocation)
    - Accessibility (chart summary, per-bar labels, button role/label)
    - Edge cases (empty data, all zeros, all 100%, partial data, single day)
    - Bar heights (normalized relative to max rate)
    - Animation stagger and reduced motion support
    - Data memoization and updates

- [ ] **Task 3.4:** Unit tests for `StreakRecordsAccordion`
  - Expand/collapse state
  - Preview data display
  - Accessibility announcements
  - Dependencies: 1.6
  - Estimate: 1h

- [ ] **Task 3.5:** Integration tests for `ProgressSectionConsolidated`
  - Full component render with mock data
  - Data flow verification
  - Edge cases (no data, partial data)
  - Dependencies: 2.1
  - Estimate: 1.5h

### Phase 4: Polish & Cleanup

- [ ] **Task 4.1:** Accessibility audit
  - VoiceOver testing on iOS
  - TalkBack testing on Android
  - Fix any issues found
  - Dependencies: 2.2
  - Estimate: 1h

- [ ] **Task 4.2:** Performance optimization
  - Verify animation FPS
  - Memoization where needed
  - Bundle size check
  - Dependencies: 2.2
  - Estimate: 1h

- [ ] **Task 4.3:** Deprecate old components
  - Mark YourProgressCard, PersonalBestsCard, ThisMonthCard as deprecated
  - Add migration notes
  - Keep for reference until next major version
  - Dependencies: 3.5
  - Estimate: 0.5h

- [ ] **Task 4.4:** Update documentation
  - Update progress-post-calendar-redesign.md
  - Add component README
  - Update storybook if applicable
  - Dependencies: 4.3
  - Estimate: 1h

---

## 5. Task Dependency Graph

```
1.1 ─┬─> 1.2 ─┐
     ├─> 1.3 ─┤
     ├─> 1.4 ─┼─> 2.1 ─> 2.2 ─> 2.3 ─> 4.1 ─> 4.2 ─> 4.3 ─> 4.4
     ├─> 1.5 ─┤         │
     └─> 1.6 ─┘         │
                        ├─> 3.1
1.2 ────────────────────┼─> 3.2 (parallel with 3.1)
1.3 ────────────────────┼─> 3.3 (parallel)
1.4 ────────────────────┼─> 3.4 (parallel)
1.6 ────────────────────┘
2.1 ─────────────────────────> 3.5
```

---

## 6. Rollout Strategy

### 6.1 Feature Flag (Optional)

```typescript
const useConsolidatedProgress = useFeatureFlag('progress_consolidated_v2');

return useConsolidatedProgress ? (
  <ProgressSectionConsolidated {...props} />
) : (
  <ProgressSection {...props} />
);
```

### 6.2 Rollout Phases

1. **Internal Testing:** 100% of dev/staging
2. **Beta Users:** 20% rollout for 1 week
3. **General Availability:** 100% rollout
4. **Cleanup:** Remove feature flag and old components

---

## 7. Risks & Mitigations

| Risk                                     | Impact | Probability | Mitigation                                       |
| ---------------------------------------- | ------ | ----------- | ------------------------------------------------ |
| Animation performance on low-end devices | Medium | Low         | Test on older devices, add reduceMotion fallback |
| User confusion with new layout           | Medium | Medium      | A/B test metrics, rollback capability            |
| Horizontal scroll not discoverable       | Low    | Medium      | Add scroll indicator dots or fade hint           |
| Accessibility regression                 | High   | Low         | Dedicated accessibility testing phase            |

---

## 8. Acceptance Criteria

- [ ] Single unified card renders all progress information
- [ ] Vertical space reduced by ≥30% compared to current design
- [ ] All existing functionality preserved
- [ ] Animations run at 60fps on target devices
- [ ] VoiceOver/TalkBack fully functional
- [ ] All tests pass (≥90% coverage)
- [ ] No TypeScript errors
- [ ] Design matches mockup within acceptable variance

---

## 9. References

- **Current Implementation:** `src/components/ProgressSection/`
- **Design Mock (Before/After):** `.superdesign/design_iterations/progress_consolidated_1.html`
- **Previous Spec:** `docs/specs/habit-details-screen/progress-post-calendar-redesign.md`
