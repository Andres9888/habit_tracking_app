# UX Audit Report: Habit Tracking App

**Date:** 2026-02-08
**Auditor:** Sally (UX Expert)
**App Version:** v1.0.0 (React Native / Expo)
**Overall Score:** 8.5/10 Polish | 7/10 New-User Clarity

---

## Executive Summary

This is a **polished, spring-animated habit tracking app** with strong micro-interaction design, real-time sync, gamification, and offline-first architecture. The app excels at making daily habit completion feel rewarding through layered haptic + visual + animation feedback.

**Key strengths:** Sophisticated animations, haptic strategy, accessibility foundations, offline-first, celebratory feedback.
**Key gaps:** Discoverability of hidden gestures, minimal settings, unclear metrics ("strength"), missing onboarding guidance for power features.

---

## 1. Home Screen (HabitsApp)

### What Works

- Clear completion feedback (checkmark, chain, color fill)
- Week-at-a-glance calendar provides context
- Drag-and-drop habit reordering
- Smart time-aware empty state ("Good morning" + relevant suggestions)
- Offline sync status badges

### Issues

| #   | Issue                                                                                                        | Severity | Fix                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------ |
| 1   | **FAB hidden in empty state** — New users only see "Custom Habit" card, no floating button                   | High     | Show FAB in empty state with onboarding pulse animation                  |
| 2   | **No view mode selector** — Can't switch between Today/Week/All views                                        | Medium   | Add segmented control or tab bar for view modes                          |
| 3   | **Week navigation constraints unclear** — Users don't know they can only view current + past weeks           | Low      | Add "This Week" label and grey out future navigation                     |
| 4   | **Long habit names truncated** — `numberOfLines={1}` cuts off names like "Read for 30 minutes every morning" | Medium   | Allow 2-line names or implement smart abbreviation                       |
| 5   | **Strength % lacks context** — Small text with no explanation of what it means                               | High     | Add help icon/tooltip: "Based on your consistency over the last 30 days" |

---

## 2. Habit Creation & Editing

### What Works

- Progressive disclosure with animated sections
- Validation feedback (disabled button until valid)
- 12 preset colors with visual swatches
- Emoji customization
- Reminder integration in same form
- Danger zone with clear red visual hierarchy

### Issues

| #   | Issue                                                                                          | Severity | Fix                                                                           |
| --- | ---------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| 6   | **No live preview** — Users can't see how their habit card will look with selected color/emoji | High     | Add card preview at top of creation form                                      |
| 7   | **Emoji picker performance** — Large list could lag on older devices                           | Medium   | Add category tabs + virtualized list                                          |
| 8   | **Reminder time not validated** — Can set reminder for past time today                         | Low      | Show "Will notify tomorrow" if time has passed                                |
| 9   | **Delete requires stronger confirmation** — Accidental deletion risk in edit modal             | High     | Add 2-step confirmation: "Delete" → "Are you sure? This removes all history." |
| 10  | **Quick-win habits not customizable** — Predefined names can't be edited before creation       | Medium   | Allow tap-to-edit on quick-win card name                                      |

---

## 3. Habit Detail Screen

### What Works

- Large emoji icon with gradient background
- Prominent streak badge ("🔥 X day streak")
- Interactive calendar for toggling past dates
- Smooth staggered entry animations
- Modal structure prevents accidental navigation

### Issues

| #   | Issue                                                                                         | Severity | Fix                                                        |
| --- | --------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- |
| 11  | **Notes feature not discoverable** — Feature exists but no visible entry point in detail view | High     | Add notes icon in header or "Add note" card in content     |
| 12  | **"Strength" not explained** — Users don't know if 75% is good or bad                         | High     | Add contextual label: "Strong — 75% consistent this month" |
| 13  | **Month navigation limited** — Only shows current month in history heatmap                    | Medium   | Add ← Month → navigation arrows                            |
| 14  | **No undo for date toggles** — Accidental taps on calendar can't be reversed easily           | Medium   | Show brief undo toast after each calendar toggle           |
| 15  | **No tap feedback on calendar days** — Missing haptic + ripple for day cell presses           | Low      | Add `ImpactFeedbackStyle.Light` + subtle scale animation   |

---

## 4. Templates Screen

### What Works

- Multiple discovery paths (categories, search, browse all)
- Research-backed filter toggle
- Preview before import
- Customization modal (name/color/reminder)
- Skeleton loaders during fetch

### Issues

| #   | Issue                                                                                          | Severity | Fix                                                       |
| --- | ---------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| 16  | **Category expansion unclear** — No visual indicator that categories can collapse              | Medium   | Add animated chevron (▼/▶) with rotation                  |
| 17  | **Template cards lack preview** — List only shows title + description, no emoji/color          | Medium   | Add emoji + color swatch to template list cards           |
| 18  | **Search doesn't highlight matches** — Users can't see why a result matched                    | Low      | Highlight matching text in bold                           |
| 19  | **Templates not prominent in empty state** — Button hidden in header, not visible to new users | High     | Add "Browse Science-Backed Templates" card in empty state |

---

## 5. Habit Card Interactions

### What Works

- Multi-layer gesture composition (tap + pan + long-press)
- Spring-based animations feel organic
- Layered celebration (confetti + floating XP + haptic + chain animation)
- Pending sync badge for offline operations
- Full accessibility labels with state information

### Issues

| #   | Issue                                                                                           | Severity | Fix                                                                 |
| --- | ----------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| 20  | **Swipe actions not discoverable** — No hint that cards are swipeable                           | High     | Show swipe tutorial on first app launch + subtle edge indicator     |
| 21  | **Chain link animation meaning unclear** — Users may not understand chain = streak continuation | Medium   | Add brief tooltip on first chain animation: "Keep the chain going!" |
| 22  | **Offline completion animation muted** — Chain dims when pending sync, may feel broken          | Medium   | Keep full animation, add small sync indicator separately            |
| 23  | **"At risk" status unexplained** — Prop exists but no user-facing explanation                   | Medium   | Show "⚠️ Streak at risk — complete today!" label                    |

---

## 6. Settings Screen

### What Works

- Clean organized sections
- Animated entry
- Habit completion icon toggle (checkbox vs. chain)
- Day shape toggle

### Issues

| #   | Issue                                                                                | Severity | Fix                                                                                                      |
| --- | ------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| 24  | **Too few settings** — Only 3-4 visual preferences, no functional settings           | High     | Add: streak reset time, time zone, notification management, haptic toggle, dark mode, celebration toggle |
| 25  | **Archived habits count missing** — Button says "Archived Habits" with no count      | Low      | Show badge: "Archived Habits (3)"                                                                        |
| 26  | **No notification center** — Users can't see/manage all habit reminders in one place | Medium   | Add dedicated notification preferences page                                                              |
| 27  | **Account section minimal** — Only "Sign out", no profile editing                    | Medium   | Add profile picture, name, email management                                                              |

---

## 7. Analytics Screen

### What Works

- Clear overview stats cards
- Multiple chart types (distribution, trends, heatmap)
- Premium upsell integration
- Pull-to-refresh
- Interactive elements (tap habit to jump to detail)

### Issues

| #   | Issue                                                                  | Severity | Fix                                                                 |
| --- | ---------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| 28  | **No time period selector** — Always shows "all time"                  | High     | Add date range picker: Week / Month / Year / Custom                 |
| 29  | **Chart labels unclear** — Axes not labeled, legend missing            | Medium   | Add proper axis labels and color legend                             |
| 30  | **No personalized insights** — Insights are static, not behavior-based | Medium   | Add: "You're 3x more consistent with morning habits" style insights |
| 31  | **Export button not prominent** — Feature exists but hard to find      | Low      | Move export to header action                                        |

---

## 8. Character Screen (Gamification)

### Issues

| #   | Issue                                                                                         | Severity | Fix                                                               |
| --- | --------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| 32  | **Progression mechanics unclear** — No "X XP to next level" indicator                         | High     | Show progress bar with milestone preview                          |
| 33  | **Habit ↔ character connection not explained** — Users don't know how habits affect character | High     | Add onboarding tooltip: "Complete habits to earn XP and level up" |
| 34  | **Uses mock data** — Character doesn't reflect actual habit progress                          | Critical | Connect to real habit completion data                             |

---

## 9. Accessibility

### What Works

- `accessible={true}` with rich labels on HabitCard
- `accessibilityRole` and `accessibilityState` on interactive elements
- `accessibilityLiveRegion="polite"` on toasts
- `useReduceMotion()` respected system-wide
- Focus states for keyboard navigation
- High-contrast color choices for key text

### Issues

| #   | Issue                                                                                                                     | Severity | Fix                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| 35  | **Gesture-only features not accessible** — Swipe-to-delete and long-press-to-reorder have no accessible alternative       | High     | Add context menu with Reorder/Delete for assistive tech users                                   |
| 36  | **Modal focus not trapped** — Users can tab outside modals                                                                | Medium   | Implement focus trap in all modal components                                                    |
| 37  | **Loading states not announced** — Skeleton loaders shown but not communicated to screen readers                          | Medium   | Add `accessibilityLabel="Loading habits"` to skeleton containers                                |
| 38  | **Verbose compound labels** — "habit name, 75% strength, completed, swipe left for actions" is a lot for one announcement | Low      | Break into separate accessible elements with `accessibilityElementsHidden` for decorative parts |

---

## 10. Error Handling & Recovery

### What Works

- Toast notifications with 4 variants (info/success/warning/error)
- 5-second countdown undo toasts for delete/archive
- Optimistic updates with background sync
- Mutation guards prevent double-taps

### Issues

| #   | Issue                                                           | Severity | Fix                                                      |
| --- | --------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| 39  | **Vague network errors** — No clear explanation of what failed  | Medium   | Show specific error: "Connection timeout — tap to retry" |
| 40  | **No manual sync retry** — Pending sync badge has no tap action | Medium   | Add long-press → "Retry sync" action                     |
| 41  | **No trash/recovery bin** — Deleted habits are permanently gone | High     | Add 30-day recovery bin, or require 2-stage deletion     |
| 42  | **Toast stacking** — Multiple simultaneous toasts may overlap   | Low      | Implement toast queue (one at a time, FIFO)              |

---

## 11. Onboarding & First-Run Experience

### Issues

| #   | Issue                                                                       | Severity | Fix                                                                                             |
| --- | --------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| 43  | **No feature tour** — Swipe, long-press, chain, strength never explained    | High     | Add first-run tooltips: "Swipe left for actions", "Long press to reorder"                       |
| 44  | **Multiple creation paths confusing** — FAB, empty state, header, templates | Medium   | Standardize: FAB is primary → Templates as secondary CTA in empty state                         |
| 45  | **"Templates" not explained** — New users may not understand concept        | Medium   | Add subtitle: "Science-backed habits you can customize"                                         |
| 46  | **Strength metric not introduced** — Users encounter % without context      | High     | Explain on first habit reaching 25%: "This is your habit strength — how consistent you've been" |

---

## Priority Matrix

### P0 — Critical (Do This Sprint)

| #   | Issue                              | Impact                      |
| --- | ---------------------------------- | --------------------------- |
| 34  | Character uses mock data           | Feature is non-functional   |
| 9   | Delete needs stronger confirmation | Data loss risk              |
| 41  | No trash/recovery bin              | Permanent data loss         |
| 20  | Swipe actions not discoverable     | Hidden core functionality   |
| 43  | No feature tour/onboarding hints   | New users miss key features |

### P1 — High (Next Sprint)

| #   | Issue                                | Impact                      |
| --- | ------------------------------------ | --------------------------- |
| 5   | Strength % lacks context             | Core metric misunderstood   |
| 6   | No live preview in creation          | Poor creation confidence    |
| 11  | Notes feature not discoverable       | Underused feature           |
| 12  | "Strength" not explained             | User confusion              |
| 19  | Templates not in empty state         | Low template adoption       |
| 24  | Settings too minimal                 | Power user frustration      |
| 28  | No time period selector in analytics | Limited data exploration    |
| 32  | Character progression unclear        | Low gamification engagement |
| 33  | Habit ↔ character unexplained        | Feature disconnect          |
| 35  | Gestures not accessible              | Accessibility violation     |
| 46  | Strength metric not introduced       | Metric confusion            |

### P2 — Medium (Backlog)

| #   | Issue                           | Impact                   |
| --- | ------------------------------- | ------------------------ |
| 1   | FAB hidden in empty state       | Inconsistent entry point |
| 4   | Long names truncated            | Information loss         |
| 7   | Emoji picker performance        | Low-end device jank      |
| 10  | Quick-wins not customizable     | Extra steps to customize |
| 13  | Month navigation limited        | Historical data access   |
| 14  | No undo for date toggles        | Accidental changes       |
| 16  | Category expansion unclear      | Discovery friction       |
| 17  | Template cards lack preview     | Browse efficiency        |
| 21  | Chain animation meaning unclear | Feature confusion        |
| 22  | Offline animation muted         | Perceived breakage       |
| 23  | "At risk" unexplained           | Missed engagement        |
| 26  | No notification center          | Reminder management      |
| 27  | Account section minimal         | Basic account needs      |
| 29  | Chart labels unclear            | Data misinterpretation   |
| 30  | No personalized insights        | Low analytics engagement |
| 36  | Modal focus not trapped         | Accessibility gap        |
| 37  | Loading not announced           | Screen reader gap        |
| 39  | Vague network errors            | User frustration         |
| 40  | No manual sync retry            | Stuck sync state         |
| 44  | Multiple creation paths         | New user confusion       |
| 45  | Templates not explained         | Concept unclear          |

### P3 — Low (Polish)

| #   | Issue                        | Impact                   |
| --- | ---------------------------- | ------------------------ |
| 2   | No view mode selector        | Limited view options     |
| 3   | Week navigation unclear      | Minor confusion          |
| 8   | Reminder time not validated  | Edge case                |
| 15  | No tap feedback on calendar  | Missing polish           |
| 18  | Search doesn't highlight     | Minor friction           |
| 25  | Archived count missing       | Minor info gap           |
| 31  | Export not prominent         | Feature discovery        |
| 38  | Verbose accessibility labels | Screen reader experience |
| 42  | Toast stacking               | Edge case                |

---

## Interaction Design Assessment

### Haptic Strategy: 9/10

Sophisticated, context-sensitive haptics (Light → Medium → Heavy based on action importance). Multi-stage sequences for celebrations. Respects system reduce-motion preferences.

### Animation System: 9.5/10

Spring-based physics feel organic. Parameterized spring presets (snappy, bouncy, gentle) create consistent feel. Staggered entrance animations add polish. Reduce-motion fully supported.

### Gesture Handling: 8/10

Advanced composition (race + simultaneous gestures). Velocity-based dismissals feel responsive. Gap: no onboarding for hidden gestures.

### Visual Feedback: 8.5/10

Multi-layer celebration (confetti + XP + haptic + chain). Clear state indicators. Gap: some metrics lack explanation.

### Accessibility: 7.5/10

Strong foundations (labels, roles, states, reduce-motion). Gaps in focus trapping, gesture alternatives, and loading announcements.

### Error Recovery: 7/10

Good undo toasts with countdown. Offline-first is excellent. Gaps in permanent deletion recovery and error specificity.

---

## Top 5 Quick Wins (< 1 day each)

1. **Add swipe hint animation** — Show on first launch, one-time tooltip
2. **Add strength tooltip** — Tap help icon → "Based on 30-day consistency"
3. **Show templates in empty state** — Add "Browse Templates" card
4. **Add archived habits count** — Badge on settings button
5. **Add haptic to calendar day taps** — `ImpactFeedbackStyle.Light` on press

---

_Report generated as part of UX Expert audit. All severity ratings based on user impact and implementation complexity._
