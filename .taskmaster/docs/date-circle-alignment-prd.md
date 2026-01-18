# PRD: Date-Circle Alignment and Timeline Enhancement

## Overview

Align habit completion dates with circle visualizations and implement a proper timeline view that clearly shows which date each circle represents.

## Problem Statement

Currently, the habit tracking circles are disconnected from their associated dates:

- Circles render based on status arrays without visible date labels
- Users cannot easily identify which date each circle represents
- ChainLinkVisualizer component is a stub and not functional
- No clear timeline showing date progression
- Potential timezone misalignment between stored dates and displayed circles

## Goals

1. Make date-circle association explicit and visible to users
2. Implement proper timeline view with date labels
3. Ensure accurate date handling across timezones
4. Improve accessibility with date information
5. Complete the ChainLinkVisualizer implementation

## Requirements

### 1. Date Labels on Circles

**Description**: Add visible date labels to each circle in the streak chain
**Acceptance Criteria**:

- Each circle displays abbreviated day label (MON, TUE, etc.) or date number
- Date labels are positioned consistently above or below circles
- Labels use app's existing typography system (#64748b secondary color)
- Labels are readable at current circle size (28px)
- Labels update correctly when date range changes

**Technical Notes**:

- Modify StreakChain.tsx to accept dates array alongside statuses
- Pass weekDates from App.tsx to StreakChain component
- Use date-fns format function for consistent date formatting
- Ensure labels align with circle centers

### 2. Date-Aware Circle Rendering

**Description**: Pass explicit date information to circle components
**Acceptance Criteria**:

- StreakChain component receives both dates and statuses arrays
- Each circle has accessibility label with full date
- Circle tooltips show full date on long press (if applicable)
- Date information flows from App.tsx → StreakChain → individual circles

**Technical Notes**:

- Update StreakChainProps interface to include dates: Date[] or dateStrings: string[]
- Update DraggableHabit to pass date information
- Add accessibility labels using accessibilityLabel prop

### 3. Implement ChainLinkVisualizer

**Description**: Complete the ChainLinkVisualizer component for linked habits
**Acceptance Criteria**:

- Component renders visual connections between linked habits
- Shows date-aligned progress across linked habits
- Displays which dates have completions for linked habit groups
- Integrates with existing tracking data

**Technical Notes**:

- Review ChainLinkVisualizer.tsx current stub implementation
- Use similar visual language to StreakChain (circles, connectors)
- Query tracking data for linked habits
- Handle cases where linked habits have different completion patterns

### 4. Timeline View Enhancements

**Description**: Create a proper timeline showing date progression
**Acceptance Criteria**:

- Clear visual timeline with date markers
- Current day is visually distinct (highlighted or marked)
- Timeline scrolls horizontally if showing more than 5 days
- Timeline adapts to different date ranges (5-day, 7-day, monthly)

**Technical Notes**:

- Consider adding timeline header to HabitCard or as separate component
- Use ScrollView for extended date ranges
- Implement "today" marker with distinct styling
- Maintain performance with large date ranges

### 5. Timezone Handling

**Description**: Ensure dates are calculated correctly across timezones
**Acceptance Criteria**:

- Dates align with user's local timezone
- Date comparisons in getHabitStatus are timezone-aware
- Stored date strings (YYYY-MM-DD) represent user's local dates
- No date shifting when toggling habits

**Technical Notes**:

- Review App.tsx getHabitStatus function (lines 60-73)
- Use date-fns/tz or ensure consistent date handling
- Consider storing timezone with tracking data
- Test across timezone changes and DST transitions

### 6. Accessibility Improvements

**Description**: Add comprehensive accessibility support for date information
**Acceptance Criteria**:

- Screen readers announce date when focusing circles
- Full date information available via accessibility API
- Accessible labels follow format "Habit completed on Monday, October 5th"
- Support for VoiceOver gestures showing date details

**Technical Notes**:

- Use accessibilityLabel on circle Views
- Use accessibilityHint for additional context
- Test with iOS VoiceOver
- Follow iOS accessibility guidelines

### 7. Visual Consistency

**Description**: Maintain Apple-like design language while adding date features
**Acceptance Criteria**:

- Date labels use existing color palette (#0f172a, #64748b, #e2e8f0)
- Typography matches existing styles (letterSpacing, fontWeight)
- Spacing and padding follow existing 8px grid system
- Animations are smooth and purposeful (if added)

**Technical Notes**:

- Reference existing styles in StreakChain.tsx and App.tsx
- Use StyleSheet for performance
- Maintain 24px border radius for rounded elements
- Keep visual weight balanced with date labels

## Implementation Plan

### Phase 1: Date Labels (High Priority)

- Update StreakChain to receive date information
- Add date labels above/below circles
- Update DraggableHabit to pass dates

### Phase 2: Accessibility (High Priority)

- Add accessibility labels with dates
- Test with VoiceOver
- Ensure timezone accuracy

### Phase 3: Timeline Enhancements (Medium Priority)

- Add timeline header/view
- Implement "today" marker
- Support horizontal scrolling

### Phase 4: ChainLinkVisualizer (Medium Priority)

- Implement date-aligned linked habits visualization
- Query tracking data for linked habits
- Add visual connections

### Phase 5: Testing & Polish (High Priority)

- Comprehensive date handling tests
- Timezone edge case testing
- Visual regression testing
- Accessibility audit

## Success Metrics

- Users can identify which date each circle represents without confusion
- Zero date misalignment bugs reported
- VoiceOver users can understand habit completion dates
- Timeline view provides clear date progression visualization
- ChainLinkVisualizer shows linked habit progress accurately

## Technical Constraints

- Must work within existing React Native + Expo setup
- Compatible with Convex database schema
- Maintains current performance (no lag with 5+ habits)
- Works on iOS (primary target)

## Dependencies

- date-fns library (already in use)
- Existing Convex tracking schema
- StreakChain component
- App.tsx habit rendering logic

## Out of Scope

- Full calendar view (covered in separate PRD)
- Multi-week timeline (future enhancement)
- Date range selection UI (future enhancement)
- Historical date editing (future enhancement)
