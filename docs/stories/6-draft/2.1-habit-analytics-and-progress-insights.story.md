# Story 2.1: Habit Analytics and Progress Insights

**Status:** Draft
**Epic:** 2 - User Engagement & Insights
**Story ID:** 2.1
**Created:** 2025-10-12

---

## User Story

**As a** user tracking daily habits,
**I want** access to detailed analytics and progress insights showing my performance trends, completion rates, and achievement patterns,
**so that** I can understand my habit-forming progress, identify areas for improvement, and stay motivated through visual feedback on my consistency and growth.

---

## Acceptance Criteria

### AC1: Analytics Dashboard Access

- [ ] Analytics button appears in main app header (next to Settings icon)
- [ ] Analytics icon uses trending-up/chart line icon from lucide-react-native
- [ ] Tapping analytics button opens full-screen analytics modal
- [ ] Modal has close button in top-right corner
- [ ] Analytics modal is accessible from main habit tracking screen

### AC2: Overall Performance Summary

- [ ] Display current active habits count with large number
- [ ] Show today's completion rate (X/Y habits completed)
- [ ] Display current longest streak across all habits
- [ ] Show weekly completion percentage (last 7 days)
- [ ] Include motivational message based on performance tier
- [ ] All metrics update in real-time as habits are toggled

### AC3: Individual Habit Performance Cards

- [ ] Each habit displays as a card with name, emoji, and key metrics
- [ ] Show completion rate for last 30 days (percentage)
- [ ] Display current streak for each habit
- [ ] Show longest historical streak for each habit
- [ ] Include total completions count
- [ ] Color-code performance (green >80%, yellow 50-80%, red <50%)

### AC4: Visual Progress Charts

- [ ] Weekly completion bar chart (last 4 weeks)
- [ ] 30-day completion trend line chart
- [ ] Heat map showing completion patterns by day of week
- [ ] Circular progress indicator for overall consistency
- [ ] Charts are interactive with tap-to-view details
- [ ] All charts use consistent color scheme (green for success, gray for incomplete)

### AC5: Time-Based Insights

- [ ] Best performing day of week identification
- [ ] Average completion rate by month
- [ ] Habit consistency score (1-100 scale)
- [ ] Performance improvement indicator (up/down/stable trend)
- [ ] Time-based achievement badges (7-day streak, 30-day consistency, etc.)

### AC6: Achievement System

- [ ] Milestone badges for streak achievements (7, 14, 30, 60, 100 days)
- [ ] Perfect week/month achievement badges
- [ ] Consistency badges (90%+ completion for 30 days)
- [ ] Improvement badges for increasing completion rates
- [ ] Badge display case with unlock dates and descriptions
- [ ] Share achievement functionality for major milestones

### AC7: Export and Sharing Features

- [ ] Export analytics data as CSV/JSON
- [ ] Generate progress summary image for sharing
- [ ] Share individual habit progress via native share sheet
- [ ] Include watermark/branding on shared content
- [ ] Option to share anonymized progress with community

### AC8: Responsive Design and Platform Support

- [ ] Analytics layout adapts to different screen sizes
- [ ] Charts render correctly on iOS, Android, and Web
- [ ] Touch interactions work properly on mobile devices
- [ ] Performance optimized for smooth scrolling and chart rendering
- [ ] Accessibility labels for all charts and metrics

---

## Dev Notes

### Technical Context

**Current Analytics Infrastructure:**

- `convex/habits.ts` already has `getStats()` function returning consistency and streak
- Schema includes `totalCompletions`, `totalMisses`, `consecutiveDays` fields
- Settings system exists for user preferences (`userSettings` table)
- Date handling uses `date-fns` library throughout app

**New Data Requirements:**

- Enhanced tracking calculations for historical analysis
- Achievement badges storage in userSettings or new badges table
- Analytics aggregation queries for performance metrics
- Export functionality with data formatting

### Component Structure

**New Components Needed:**

1. **`AnalyticsButton.tsx`** - Header button to access analytics
2. **`AnalyticsModal.tsx`** - Full-screen analytics container
3. **`PerformanceSummary.tsx`** - Overview metrics section
4. **`HabitPerformanceCard.tsx`** - Individual habit stats
5. **`ProgressCharts.tsx`** - Collection of chart components
6. **`WeeklyBarChart.tsx`** - Bar chart for weekly completion
7. **`TrendLineChart.tsx`** - Line chart for 30-day trends
8. **`HeatMap.tsx`** - Day of week completion patterns
9. **`CircularProgress.tsx`** - Circular progress indicator
10. **`AchievementBadge.tsx`** - Individual badge component
11. **`BadgeCase.tsx`** - Achievement collection display
12. **`ExportMenu.tsx`** - Data export options

**Updated Components:**

1. **`App.tsx`** - Add Analytics button to header
2. **`convex/habits.ts`** - Add analytics queries and mutations

### Data Schema Additions

**New Convex Functions Required:**

```typescript
// Analytics queries
export const getDetailedAnalytics = query({...}) // Comprehensive analytics
export const getHistoricalStats = query({...}) // Historical performance data
export const getAchievements = query({...}) // User achievements
export const unlockAchievement = mutation({...}) // Achievement system

// Enhanced stats
export const getWeeklyStats = query({...}) // Week-by-week breakdown
export const getMonthlyStats = query({...}) // Monthly performance
export const getBestPerformanceDay = query({...}) // Best day analysis
```

**Achievement Schema Addition:**

```typescript
// Add to schema.ts
achievements: defineTable({
  userId: v.optional(v.string()),
  habitId: v.optional(v.id("habits")),
  badgeType: v.string(), // "streak", "consistency", "perfect_week", etc.
  badgeValue: v.number(), // 7, 14, 30, etc.
  unlockedAt: v.number(),
  unlockedDate: v.string(), // YYYY-MM-DD format
}).index("by_user", ["userId"]),
```

### Chart Library Integration

**React Native Chart Options:**

- **react-native-svg-charts** (already has react-native-svg)
- **react-native-chart-kit** - Simple, responsive charts
- **victory-native** - Comprehensive charting library

**Recommendation:** Use `react-native-chart-kit` for simplicity and React Native compatibility.

### Color Scheme

**Analytics Color Palette:**

```typescript
const analyticsColors = {
  success: '#48bb78', // green-400 (matches existing)
  warning: '#ed8936', // orange-400
  danger: '#f56565', // red-400
  neutral: '#a0aec0', // slate-400
  background: '#f7fafc', // gray-50
  textPrimary: '#101727', // slate-900
  textSecondary: '#4a5568', // slate-600
  chartGrid: '#e2e8f0', // slate-200
};
```

### File Locations

Based on existing project structure:

- **Analytics Components:** `src/components/analytics/`
- **Charts:** `src/components/charts/`
- **Utils:** `src/utils/analytics.ts`
- **Convex Functions:** `convex/analytics.ts`
- **Types:** `src/types/analytics.ts`

### Performance Considerations

**Optimization Strategies:**

1. **Data Caching:** Cache analytics calculations for 5-10 minutes
2. **Lazy Loading:** Load charts data only when analytics modal opens
3. **Pagination:** Load historical data in chunks
4. **Memoization:** Cache expensive calculations using React.memo
5. **Background Processing:** Pre-calculate stats in Convex functions

### Testing Considerations

**Unit Tests:**

- Analytics calculation accuracy
- Chart data transformation logic
- Achievement unlocking logic
- Export data formatting

**Integration Tests:**

- Analytics modal opening/closing
- Chart rendering with real data
- Achievement badge display
- Share functionality

**Manual Testing:**

- Performance with large datasets (1000+ tracking entries)
- Chart responsiveness on different screen sizes
- Export functionality across platforms
- Achievement triggering scenarios

---

## Design Reference

**Visual Hierarchy:**

1. **Header:** Analytics title + close button
2. **Performance Summary:** Large metrics at top
3. **Individual Habit Cards:** Scrollable list
4. **Visual Charts:** Half-screen interactive charts
5. **Achievements:** Badge showcase section
6. **Export Options:** Bottom action buttons

**Layout Guidelines:**

- Use existing 24px side margins
- Maintain 16px component spacing
- Follow card-based design from existing habit cards
- Use Inter font family for consistency
- Apply existing shadow and border radius patterns

**Interaction Patterns:**

- Tap habits to view detailed history
- Tap chart segments for drill-down views
- Swipe between different chart types
- Long press badges for achievement details
- Pull to refresh analytics data

---

## Tasks / Subtasks

### Task 1: Create Analytics Button Component (AC: 1)

**Assigned Agent:** @dev

1.1. Create `src/components/analytics/AnalyticsButton.tsx`
1.2. Use TrendingUp icon from lucide-react-native
1.3. Style to match Settings button positioning
1.4. Add accessibility labels and haptic feedback
1.5. Export as reusable component

### Task 2: Implement Analytics Modal Container (AC: 1, 8)

**Assigned Agent:** @architect

2.1. Create `src/components/analytics/AnalyticsModal.tsx`
2.2. Full-screen modal with safe area handling
2.3. Close button in top-right corner
2.4. Scrollable content area for analytics sections
2.5. Loading state handling for data fetching
2.6. Error handling for analytics data failures

### Task 3: Build Performance Summary Component (AC: 2)

**Assigned Agent:** @dev

3.1. Create `src/components/analytics/PerformanceSummary.tsx`
3.2. Display active habits count, today's completion rate
3.3. Show longest streak and weekly percentage
3.4. Implement motivational message logic based on performance tiers
3.5. Add real-time updates when habits are toggled
3.6. Style with large numbers and clear typography

### Task 4: Create Habit Performance Cards (AC: 3)

**Assigned Agent:** @dev

4.1. Create `src/components/analytics/HabitPerformanceCard.tsx`
4.2. Display 30-day completion rate with percentage
4.3. Show current and longest streak for each habit
4.4. Include total completions count
4.5. Implement color-coding based on performance tiers
4.6. Add touch interaction for detailed view

### Task 5: Implement Chart Components (AC: 4)

**Assigned Agent:** @ux-expert

5.1. Install and configure react-native-chart-kit
5.2. Create `src/components/charts/WeeklyBarChart.tsx`
5.3. Create `src/components/charts/TrendLineChart.tsx`
5.4. Create `src/components/charts/HeatMap.tsx` (custom SVG implementation)
5.5. Create `src/components/charts/CircularProgress.tsx`
5.6. Implement consistent color scheme across all charts
5.7. Add touch interactions and tap-to-view details

### Task 6: Build Time-Based Insights (AC: 5)

**Assigned Agent:** @dev

6.1. Create analytics calculation utilities
6.2. Implement best day of week analysis
6.3. Calculate monthly average completion rates
6.4. Develop consistency scoring algorithm
6.5. Create trend analysis (improving/declining/stable)
6.6. Display insights in clear, readable format

### Task 7: Implement Achievement System (AC: 6)

**Assigned Agent:** @dev

7.1. Add achievements table to Convex schema
7.2. Create achievement badge components
7.3. Implement badge unlocking logic and triggers
7.4. Create badge case display component
7.5. Design achievement icons using react-native-svg
7.6. Store unlock dates and achievement metadata

### Task 8: Add Export and Sharing Features (AC: 7)

**Assigned Agent:** @dev

8.1. Create `src/components/analytics/ExportMenu.tsx`
8.2. Implement CSV export functionality
8.3. Create progress summary image generation
8.4. Add native share sheet integration
8.5. Include branding/watermark on shared content
8.6. Handle permissions for file system access

### Task 9: Implement Convex Analytics Functions (AC: 2-6)

**Assigned Agent:** @backend-dev

9.1. Create `convex/analytics.ts` with comprehensive queries
9.2. Implement `getDetailedAnalytics` for main dashboard data
9.3. Add `getHistoricalStats` for chart data
9.4. Create achievement system queries and mutations
9.5. Optimize queries for performance with proper indexing
9.6. Add data validation and error handling

### Task 10: Integrate Analytics Button in Main App (AC: 1)

**Assigned Agent:** @dev

10.1. Import AnalyticsButton in `src/App.tsx`
10.2. Add button to header alongside Settings
10.3. Create state for analytics modal visibility
10.4. Wire up button press to open AnalyticsModal
10.5. Pass necessary props and context to modal

### Task 11: Add Achievement Schema and Logic (AC: 6)

**Assigned Agent:** @backend-dev

11.1. Update `convex/schema.ts` with achievements table
11.2. Add proper indexing for user-based queries
11.3. Create achievement validation rules
11.4. Implement badge unlock conditions and checks
11.5. Add data migration for existing users

### Task 12: Testing and Polish (AC: 8)

**Assigned Agent:** @tester

12.1. Test analytics calculations for accuracy
12.2. Verify chart rendering on all platforms
12.3. Test achievement unlocking scenarios
12.4. Validate export functionality
12.5. Performance testing with large datasets
12.6. Accessibility testing with screen readers
12.7. Cross-platform compatibility testing

---

## Implementation Notes

### Recommended Implementation Order:

1. Start with AnalyticsButton and AnalyticsModal (foundation)
2. Build PerformanceSummary (core metrics display)
3. Implement HabitPerformanceCard (individual stats)
4. Add basic chart components (visual elements)
5. Create Convex analytics functions (data layer)
6. Implement achievement system (gamification)
7. Add export and sharing features (utility)
8. Comprehensive testing and polish

### Key Challenges:

- **Chart Performance:** Rendering charts with large datasets may impact performance
- **Data Calculations:** Complex analytics queries need optimization
- **Achievement Logic:** Determining when badges are unlocked requires careful state management
- **Export Functionality:** File system access varies across platforms
- **Real-time Updates:** Analytics should update when habits are toggled

### Dependencies:

- `react-native-chart-kit` (charting library)
- `react-native-svg` (already installed, needed for custom charts)
- `react-native-share` (for sharing functionality)
- `@react-native-async-storage/async-storage` (for caching analytics data)
- `date-fns` (already installed, for date calculations)

---

## Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Analytics calculations are accurate and consistent
- [ ] Charts render smoothly on all platforms
- [ ] Achievement system works correctly
- [ ] Export functionality produces valid output
- [ ] Performance is acceptable with large datasets
- [ ] Code follows existing React Native patterns
- [ ] Components are properly typed (TypeScript)
- [ ] Accessibility features are implemented
- [ ] Tested on iOS, Android, and Web
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Story marked as "Done" in tracking system

---

## References

- **Current Implementation:** src/App.tsx, convex/habits.ts, convex/schema.ts
- **Related Components:** src/components/SettingsModal.tsx
- **Chart Library:** https://github.com/indiespirit/react-native-chart-kit
- \*\*Achievement Inspiration: Duolingo, Fitbit, Strava badge systems
- **Analytics Design:** Apple Health, Google Fit dashboard patterns

---

**Story Created By:** Story Creation Agent
**Date:** 2025-10-12

---

## QA Results

### Review Date: [To be completed after implementation]

### Reviewed By: [To be assigned]

### Code Quality Assessment

[To be completed after implementation]

### Gate Status

[To be determined after QA review]

### Recommended Status

[To be determined after QA review]
