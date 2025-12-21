# Habit Details - UX Polish & Improvements

**Related Story:** `docs/specs/habit-details-screen/stories/story-1.9-habit-detail-page-redesign.md`
**Design Mockup:** `.superdesign/design_iterations/habit_details_tabbed_1.html`
**Priority:** Medium
**Status:** 🔴 TODO
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
  - **Completed:** Added spring bounce animation to HeroSection icon using `useSharedValue` and `withSpring` from react-native-reanimated
  - **Animation:** 600ms spring animation with damping=8, stiffness=150, mass=0.8, starting from scale 0.8 and translateY -10
  - **Implementation:** Modified `HeroSection` component in `src/screens/HabitDetailScreen.tsx:97-137`
- [x] T1.2: Add streak badge with animated entrance
  - **Completed:** Added celebratory streak badge when streak >= 7 days with animated entrance (fade + scale)
  - **Badge text:** "⚡ X day streak!" (7-13 days), "🔥 X day streak!" (14-29 days), "🌟 X day streak!" (30+ days)
  - **Animation:** 400ms delay after icon bounce, then 200ms fade-in + spring scale animation (damping=10, stiffness=200, mass=0.6)
  - **Positioning:** Centered below habit name, styled with orange-amber gradient background
  - **Implementation:** Modified `HeroSection` component in `src/screens/HabitDetailScreen.tsx:88-153`
- [x] T1.3: Create confetti animation for completion
  - **Completed:** Added confetti burst animation to QuickCompleteButton when completing a habit
  - **Animation:** 12 colorful particles burst outward from button center using spring physics (damping=12, stiffness=200, mass=0.5)
  - **Colors:** Emerald/green theme (#10B981, #34D399, #6EE7B7, #059669) with amber/gold accents (#F59E0B, #FBBF24)
  - **Duration:** ~700ms total (staggered particle animations + fade out)
  - **Accessibility:** Respects `reduceMotion` preference - animation is skipped when enabled
  - **Implementation:** Added `ConfettiBurst` sub-component in `src/components/QuickCompleteButton/QuickCompleteButton.tsx:62-153`
- [x] T1.4: Implement stats number counting animation
  - **Completed:** Added animated counting effect to QuickStatsStrip component
  - **Animation:** 800ms duration with `Easing.out(Easing.cubic)` for smooth deceleration
  - **Stagger:** 100ms delay between each stat (streak → strength → success)
  - **Values:** Numbers count from 0 to target value with per-frame updates via `useDerivedValue` + `runOnJS`
  - **Accessibility:** Respects `reduceMotion` preference - values set immediately when enabled
  - **Implementation:** Modified `src/components/QuickStatsStrip/QuickStatsStrip.tsx:138-232`
- [x] T1.5: Add strength ring fill animation
  - **Completed:** Added animated ring fill and percentage counting on screen load
  - **Ring Animation:** 1000ms duration with `Easing.out(Easing.cubic)` for smooth deceleration
  - **Percentage Text:** AnimatedPercentageText component using `useDerivedValue` + `runOnJS` pattern, counts up in sync with ring fill
  - **Start:** Ring and percentage both start from 0 on initial mount
  - **Accessibility:** Respects `reduceMotion` preference - values set immediately when enabled, skipping animation
  - **Implementation:** Added `AnimatedPercentageText` sub-component and modified animation logic in `src/components/HabitStrengthSection/HabitStrengthSection.tsx:129-204`

### Phase 2: Tab Navigation (1-2 hours)
- [x] T2.1: Convert tab bar to pill/segment control style
  - **Completed:** Converted HabitDetailTabs from underline-style to pill/segment control style
  - **Visual Design:** Gray background container (`bg-stone-100 rounded-xl`) with sliding violet pill indicator (`bg-violet-600 rounded-lg`)
  - **Active tab:** White text on violet pill background; Inactive tabs: Gray text on transparent background
  - **Animation:** Smooth spring animation (damping=18, stiffness=180, mass=0.8) with dynamic width calculation based on container layout
  - **Implementation:** Modified `src/components/HabitDetailTabs/HabitDetailTabs.tsx`
- [x] T2.2: Implement swipe gesture for tab switching
  - **Completed:** Added horizontal swipe gesture detection for tab switching using react-native-gesture-handler
  - **Gesture Handler:** `Gesture.Pan()` with `activeOffsetX([-20, 20])` and `failOffsetY([-15, 15])` to distinguish horizontal swipes from vertical scrolling
  - **Velocity-based detection:** Uses both velocity threshold (500 px/s) and translation threshold (80 px) as specified in requirements
  - **Haptic Feedback:** Triggers light haptic impact on successful tab switch (same as tab tap)
  - **Direction:** Swipe left = next tab, Swipe right = previous tab
  - **Boundary handling:** Swipes at first/last tabs are ignored (no wrap-around)
  - **Implementation:** Modified `src/screens/HabitDetailScreen.tsx:949-984` (gesture handler) and `1551-1636` (GestureDetector wrapper)
- [x] T2.3: Add haptic feedback to tab interactions
  - **Completed:** Haptic feedback already implemented in previous tasks (T2.1 and T2.2)
  - **Tab Tap:** Light haptic impact triggered in `HabitDetailTabs.tsx:132` via `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
  - **Tab Swipe:** Light haptic impact triggered in `HabitDetailScreen.tsx:954,958` via `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
  - **Both methods:** Use consistent `ImpactFeedbackStyle.Light` as specified in requirements
  - **Implementation:** Already complete as part of T2.1 (tab tap) and T2.2 (swipe gesture)

### Phase 3: Micro-interactions (1-2 hours)
- [x] T3.1: Add today indicator pulse in calendar
  - **Completed:** Added subtle pulse animation to "today" cell in CalendarHeatmap when habit is not completed
  - **Animation:** Infinite pulse ring expanding from 1.0→1.3 scale with 0→0.6→0 opacity over 1200ms cycle
  - **Timing:** 500ms delay after cell fade-in, then repeating pulse animation using `withRepeat`
  - **Visual:** Amber-colored border ring (`border-amber-400`) expands outward and fades
  - **Behavior:** Stops pulsing automatically once habit is completed (`shouldPulse = day.isToday && !day.completed`)
  - **Accessibility:** Respects `reduceMotion` preference - animation is skipped when enabled
  - **Implementation:** Modified `src/components/CalendarHeatmap/DayCell.tsx:37-106, 199-206`
- [x] T3.2: Implement contextual streak messages
  - **Completed:** Added animated contextual message component below the 7-day streak chain
  - **Message Logic:** Dynamic messages based on streak state:
    - New record: "New personal record! 🎉" (amber gradient background)
    - Tied record: "You matched your best! Keep going! 🏆" (emerald gradient)
    - Zero streak: "Start a new streak today! ⚡" (orange gradient)
    - Close to record (1-3 days): "X more days to beat your record! 🔥" (violet gradient)
    - Close to record (4-7 days): "Keep going! X days to your best! 💪" (violet gradient)
    - Milestone celebrations: Day 1, 3, 7, 14, 21, 30 with custom messages and emojis
    - Default: "Keep the chain going! 🔗" or "Great progress! Keep it up! ✨"
  - **Animation:** Fade-in + spring translateY after chain animation completes (345ms delay)
  - **Visual Design:** Color-coded message types (record/celebrate/motivation/start) with gradient backgrounds
  - **Implementation:** Added `getContextualMessage()` function and `ContextualMessage` component in `src/components/StreakChainSection/StreakChainSection.tsx:142-259`
- [x] T3.3: Make motivation cards fully tappable
  - **Completed:** Enhanced SectionCard component with animated press state and removed edit icons from motivation cards
  - **Press State Animation:** Added scale animation (1.0 → 0.98) on press using `useSharedValue` and `withTiming`/`withSpring` from react-native-reanimated
  - **Animation Timing:** 100ms scale down on press-in, spring animation (damping=15, stiffness=200) for scale up on press-out
  - **Edit Icon Removal:** Removed Edit3 icons from "Your Why", "Your Identity", and "Your Cue" sections - entire cards are now the tap target
  - **UX Improvement:** Cards feel more responsive and touchable; cleaner visual design without redundant edit indicators
  - **Implementation:** Modified `SectionCard` component in `src/screens/HabitDetailScreen.tsx:315-376`
- [x] T3.4: Add next reminder relative time display
  - **Completed:** Added relative time display for next reminder in ManageTabContent
  - **Display Logic:** Shows "In X hours", "In Xh Ym", "In X minutes", or "Tomorrow at Xam/pm" based on time until next reminder
  - **Real-time Updates:** Uses `useEffect` with setInterval to update display every minute
  - **Styling:** Enabled reminders show blue text (`text-blue-600 font-medium`), disabled shows gray (`text-stone-500`)
  - **Accessibility:** Properly handles both 12-hour ("2:00 PM") and 24-hour ("14:00") time formats
  - **Testing:** Added comprehensive unit tests in `src/utils/__tests__/notifications.test.ts` (23 tests passing)
  - **Implementation:**
    - Added `getNextReminderRelativeTime()` function in `src/utils/notifications.ts:183-236`
    - Modified `ManageTabContent` in `src/screens/HabitDetailScreen.tsx:841-876`
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
