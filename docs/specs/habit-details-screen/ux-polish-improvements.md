# Habit Details - UX Polish & Improvements

**Related Story:** `docs/specs/habit-details-screen/stories/story-1.9-habit-detail-page-redesign.md`
**Design Mockup:** `.superdesign/design_iterations/habit_details_tabbed_1.html`
**Priority:** Medium
**Status:** 🟢 Phase 2 COMPLETE - Phase 3 Ready
**Estimated Effort:** 4-6 hours

---

## Overview

Polish improvements to enhance the Habit Details screen user experience with animations, micro-interactions, and visual feedback.

---

## Improvements

### 1. Hero Section Animations

#### 1.1 Icon Bounce on Load
- Subtle spring bounce animation when screen opens
- Duration: 600ms, spring physics
- Creates welcoming, playful feel

#### 1.2 Streak Badge
- Show celebratory badge when streak > 7 days
- Examples: "🔥 12 day streak!", "⚡ On fire!"
- Positioned below habit name
- Animated entrance (fade + scale)

#### 1.3 Complete Button States
- **Incomplete**: Pulse animation (subtle glow every 2s)
- **Completing**: Confetti burst animation
- **Completed**: Check icon + green gradient, no pulse
- Haptic feedback: medium impact on complete, light on undo

### 2. Quick Stats Strip Enhancements

#### 2.1 Trend Indicators
- Show directional arrows with change percentage
- Examples: "↑ +5%", "↓ -2%", "→ same"
- Green for positive, red for negative, gray for neutral
- Compare to previous 7 days

#### 2.2 Visual Hierarchy
- Make streak stat slightly larger (primary metric)
- Streak: 24px font, others: 20px font
- Add subtle background gradient to streak card

#### 2.3 Number Animation
- Animate numbers counting up on screen load
- Duration: 800ms with easing
- Stagger: 100ms between each stat

### 3. Tab Navigation Improvements

#### 3.1 Pill/Segment Control Style
- Replace underline with pill indicator
- Active tab: filled background + white text
- Inactive tabs: transparent + gray text
- Smooth sliding pill animation on switch

#### 3.2 Swipe Gestures
- Swipe left/right to switch tabs
- Use react-native-gesture-handler
- Velocity-based detection (not just distance)
- Smooth spring animation to snap

#### 3.3 Haptic Feedback
- Light haptic on tab switch
- Both tap and swipe triggers

### 4. Progress Tab Enhancements

#### 4.1 Today Indicator Pulse
- Calendar "today" cell has subtle pulse animation
- Draws attention to complete action
- Stops pulsing once completed

#### 4.2 Streak Chain Message
- Show contextual message below streak chain
- Examples:
  - "Keep going! 5 more days to beat your record"
  - "New record! 🎉"
  - "Start a new streak today!"

#### 4.3 Strength Ring Animation
- Animate ring fill on screen load
- Duration: 1000ms with spring physics
- Start from 0%, animate to actual value
- Percentage number counts up in sync

### 5. Motivation Tab Improvements

#### 5.1 Full Card Tap Target
- Entire card is tappable (not just edit icon)
- Remove separate edit icon
- Add subtle press state (scale 0.98)

#### 5.2 Vision Board Preview
- Tap image for full-screen preview
- Pinch to zoom support
- Swipe to dismiss

#### 5.3 Affirmation Shuffle
- Add shuffle button in section header
- Randomizes displayed affirmation
- Subtle card flip animation

### 6. Manage Tab Polish

#### 6.1 Next Reminder Display
- Show relative time: "In 8 hours", "Tomorrow at 7am"
- Updates in real-time (every minute)

#### 6.2 Swipe to Delete
- Swipe left reveals delete action
- Red background slides in
- Requires full swipe or tap to confirm
- Undo toast for 5 seconds

#### 6.3 Danger Zone Styling
- Group destructive actions (Archive, Delete) in separate section
- Red-tinted section header
- Confirmation modal for delete

---

## Technical Notes

### Animation Libraries
- Use `react-native-reanimated` for performant animations
- Use `react-native-gesture-handler` for swipe gestures
- Use `expo-haptics` for haptic feedback

### Performance Considerations
- All animations should run on UI thread (worklets)
- Lazy load tab content (don't render hidden tabs)
- Debounce rapid tab switches

### Accessibility
- Reduce motion preference: disable non-essential animations
- Ensure animations don't block interaction
- Screen reader announces tab changes

---

## Tasks

### Phase 1: Core Animations (2-3 hours)
- [x] T1.1: Implement icon bounce animation on load
  - *Implemented in HabitDetailScreen.tsx:105-146: Spring bounce animation (scale 0.8→1, translateY -10→0) with damping:8, stiffness:150, mass:0.8*
- [x] T1.2: Add streak badge with animated entrance
  - *Implemented in HabitDetailScreen.tsx:127-138, 183-194: Shows when streak >= 7, animated entrance with 400ms delay, fade+scale animation, dynamic emoji based on streak length (⚡7+, 🔥14+, 🌟30+)*
- [x] T1.3: Create confetti animation for completion
  - *Implemented in QuickCompleteButton.tsx: 12-particle confetti burst with spring physics, haptic feedback, respects reduce motion*
- [x] T1.4: Implement stats number counting animation
  - *Implemented in QuickStatsStrip.tsx: 800ms duration with 100ms stagger, Easing.out(Easing.cubic), respects reduce motion*
- [x] T1.5: Add strength ring fill animation
  - *Implemented in StrengthRing.tsx: Spring animation with level-up celebration*

### Phase 2: Tab Navigation (1-2 hours)
- [x] T2.1: Convert tab bar to pill/segment control style
  - *Implemented in HabitDetailTabs.tsx: Pill-style segment control with violet animated backdrop, spring animation (damping:18, stiffness:180, mass:0.8), bg-stone-100 container with rounded-xl, active tab white text on violet pill*
- [x] T2.2: Implement swipe gesture for tab switching
  - *Implemented in HabitDetailScreen.tsx:1041-1060: Pan gesture with velocity-based detection (500px/s threshold) and translation fallback (80px), GestureDetector wraps tab content at line 1682, respects vertical scrolling (failOffsetY)*
- [x] T2.3: Add haptic feedback to tab interactions
  - *Implemented in HabitDetailTabs.tsx:132 (tap) and HabitDetailScreen.tsx:1030,1034 (swipe): Light haptic on both tap and swipe triggers using Haptics.impactAsync(ImpactFeedbackStyle.Light)*

### Phase 3: Micro-interactions (1-2 hours)
- [x] T3.1: Add today indicator pulse in calendar
  - *Already implemented in DayCell.tsx:43-81: Pulse animation (scale 1→1.3, opacity 0.6→0) triggers when day.isToday && !day.completed && !reduceMotion. Uses withRepeat for infinite animation, respects reduce motion accessibility setting, stops pulsing once habit is completed*
- [ ] T3.2: Implement contextual streak messages
- [ ] T3.3: Make motivation cards fully tappable
- [ ] T3.4: Add next reminder relative time display
- [ ] T3.5: Implement swipe-to-delete for manage actions

### Phase 4: Polish (1 hour)
- [ ] T4.1: Add vision board full-screen preview
- [ ] T4.2: Implement affirmation shuffle
- [ ] T4.3: Create danger zone section styling
- [ ] T4.4: Respect reduce motion accessibility setting

---

## Definition of Done

- [ ] All animations run at 60fps
- [ ] Haptic feedback works on iOS and Android
- [ ] Reduce motion setting disables non-essential animations
- [ ] No visual regressions from current implementation
- [ ] Tested on iPhone SE (small) and iPad (large)

---

**Created:** 2025-12-20
**Author:** UX Expert (Sally)
