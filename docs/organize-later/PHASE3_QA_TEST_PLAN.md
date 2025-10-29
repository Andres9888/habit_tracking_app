# Phase 3 QA Test Plan

**Comprehensive Testing Checklist for All 4 Features**

## Testing Environment

### Required Devices

- [ ] **iPhone SE** (375pt width, minimum target device)
- [ ] **iPhone 13/14/15** (390pt width, standard device)
- [ ] **iPhone 15 Pro Max** (428pt width, large device)
- [ ] **iPad** (Optional, future consideration)

### Required Accounts

- [ ] **Free User** account (no subscription)
- [ ] **Premium User** account (active subscription)
- [ ] **Trial User** account (7-day free trial active)

### Required Tools

- [ ] **Xcode** (for iOS build)
- [ ] **Instruments** (for performance profiling)
- [ ] **Accessibility Inspector** (for VoiceOver testing)
- [ ] **Network Link Conditioner** (for offline testing)

---

## Test Execution Order

**Priority:**

1. Critical Path Tests (P0)
2. Feature Integration Tests (P1)
3. Edge Cases & Error Handling (P2)
4. Performance & Accessibility (P3)

---

## Feature 1: Templates Library

### P0: Critical Path

#### TC1.1: View Templates Tab

**Preconditions:** App installed, templates seeded (20 templates)

| Step | Action                          | Expected Result        | Pass/Fail |
| ---- | ------------------------------- | ---------------------- | --------- |
| 1    | Open app                        | Home tab displays      | ⬜        |
| 2    | Tap Templates tab (middle icon) | Templates screen loads | ⬜        |
| 3    | Verify template count           | See ~20 template cards | ⬜        |
| 4    | Scroll through list             | Smooth 60fps scrolling | ⬜        |

**Success Criteria:** Templates screen loads <2 seconds, all cards visible

---

#### TC1.2: Filter by Category

**Preconditions:** Templates screen open

| Step | Action                              | Expected Result          | Pass/Fail |
| ---- | ----------------------------------- | ------------------------ | --------- |
| 1    | Verify "All" chip active by default | Blue background on "All" | ⬜        |
| 2    | Tap "Morning Routine" chip          | Filter to 4 templates    | ⬜        |
| 3    | Tap "Health & Fitness" chip         | Filter to 5 templates    | ⬜        |
| 4    | Tap "Productivity" chip             | Filter to 5 templates    | ⬜        |
| 5    | Tap "Mindfulness" chip              | Filter to 6 templates    | ⬜        |
| 6    | Tap "All" chip again                | Show all 20 templates    | ⬜        |

**Success Criteria:** Filtering is instant (<100ms), correct counts displayed

---

#### TC1.3: Import Template

**Preconditions:** Templates screen open

| Step | Action                              | Expected Result                  | Pass/Fail |
| ---- | ----------------------------------- | -------------------------------- | --------- |
| 1    | Find "5-Minute Meditation" template | Card visible with citation       | ⬜        |
| 2    | Tap template card                   | Preview modal slides up          | ⬜        |
| 3    | Read full description               | Scientific reference shown       | ⬜        |
| 4    | Tap "Import" button                 | Success toast appears            | ⬜        |
| 5    | Modal auto-dismisses                | Return to templates screen       | ⬜        |
| 6    | Navigate to Home tab                | New habit visible in list        | ⬜        |
| 7    | Verify habit details                | Name, icon, color match template | ⬜        |
| 8    | Check strength                      | 0% strength (Starting 🌱)        | ⬜        |

**Success Criteria:** Habit created <3 seconds, appears immediately on Home

---

### P1: Feature Integration

#### TC1.4: Import Multiple Templates

**Preconditions:** Templates screen open

| Step | Action                      | Expected Result      | Pass/Fail |
| ---- | --------------------------- | -------------------- | --------- |
| 1    | Import "Morning Meditation" | Habit created        | ⬜        |
| 2    | Import "7-Minute Workout"   | Second habit created | ⬜        |
| 3    | Import "Deep Work Session"  | Third habit created  | ⬜        |
| 4    | Go to Home tab              | All 3 habits visible | ⬜        |
| 5    | Verify order                | Newest habit at top  | ⬜        |

**Success Criteria:** All habits created successfully, no duplicates

---

### P2: Edge Cases

#### TC1.5: Empty Category

**Preconditions:** Remove all templates from a category (test only)

| Step | Action                   | Expected Result                 | Pass/Fail |
| ---- | ------------------------ | ------------------------------- | --------- |
| 1    | Filter to empty category | Empty state displays            | ⬜        |
| 2    | Verify empty message     | "No templates in this category" | ⬜        |
| 3    | Tap "All" category       | Show all templates again        | ⬜        |

---

#### TC1.6: Offline Import

**Preconditions:** Enable airplane mode

| Step | Action                 | Expected Result              | Pass/Fail |
| ---- | ---------------------- | ---------------------------- | --------- |
| 1    | Tap template to import | Error toast: "No connection" | ⬜        |
| 2    | Disable airplane mode  | Templates reload             | ⬜        |
| 3    | Retry import           | Success                      | ⬜        |

---

## Feature 2: Milestone Celebration

### P0: Critical Path

#### TC2.1: Trigger 20% Milestone (Starting 🌱)

**Preconditions:** Habit with 18% strength

| Step | Action                           | Expected Result                | Pass/Fail |
| ---- | -------------------------------- | ------------------------------ | --------- |
| 1    | Complete habit                   | Strength updates to 21%        | ⬜        |
| 2    | Verify celebration modal appears | Full-screen modal slides up    | ⬜        |
| 3    | Verify backdrop                  | 60% opacity black backdrop     | ⬜        |
| 4    | Verify confetti                  | 100 particles falling          | ⬜        |
| 5    | Verify emoji                     | 🌱 emoji (80pt, bounces)       | ⬜        |
| 6    | Verify level name                | "Starting Level!" displayed    | ⬜        |
| 7    | Verify strength                  | "21%" shown                    | ⬜        |
| 8    | Verify haptic                    | Heavy impact felt              | ⬜        |
| 9    | Verify buttons                   | "Share" and "Continue" visible | ⬜        |

**Success Criteria:** Modal appears <500ms after strength update, confetti smooth

---

#### TC2.2: Trigger 60% Milestone (Strong 💪)

**Preconditions:** Habit with 58% strength

| Step | Action                 | Expected Result           | Pass/Fail |
| ---- | ---------------------- | ------------------------- | --------- |
| 1    | Complete habit         | Strength updates to 61%   | ⬜        |
| 2    | Verify modal appears   | Celebration displayed     | ⬜        |
| 3    | Verify emoji           | 💪 emoji (80pt, bounces)  | ⬜        |
| 4    | Verify level name      | "Strong Level!" displayed | ⬜        |
| 5    | Verify confetti colors | Green + gold particles    | ⬜        |

---

#### TC2.3: Dismiss Celebration

**Preconditions:** Celebration modal open

| Step | Action                  | Expected Result         | Pass/Fail |
| ---- | ----------------------- | ----------------------- | --------- |
| 1    | Tap "Continue" button   | Modal slides down       | ⬜        |
| 2    | Verify return           | Back to Home screen     | ⬜        |
| 3    | Trigger milestone again | Tap backdrop to dismiss | ⬜        |
| 4    | Verify dismissal        | Modal closes            | ⬜        |

**Success Criteria:** Smooth animation (300ms), no visual glitches

---

### P1: Feature Integration

#### TC2.4: All Milestone Levels

**Preconditions:** Habits at various strengths

| Strength | Level      | Emoji | Pass/Fail |
| -------- | ---------- | ----- | --------- |
| 21%      | Starting   | 🌱    | ⬜        |
| 42%      | Building   | 🌿    | ⬜        |
| 62%      | Developing | 🌳    | ⬜        |
| 81%      | Strong     | 💪    | ⬜        |
| 91%      | Automatic  | ⚡    | ⬜        |

**Success Criteria:** Correct emoji/label for each level

---

### P2: Edge Cases

#### TC2.5: Duplicate Milestone Prevention

**Preconditions:** Habit at 19% strength

| Step | Action                      | Expected Result               | Pass/Fail |
| ---- | --------------------------- | ----------------------------- | --------- |
| 1    | Complete habit              | Strength → 21%, modal appears | ⬜        |
| 2    | Dismiss modal               | Modal closes                  | ⬜        |
| 3    | Force strength to 21% again | No duplicate modal            | ⬜        |
| 4    | Increase to 22%             | Still no duplicate            | ⬜        |

**Success Criteria:** Each milestone triggers only once

---

### P3: Accessibility

#### TC2.6: Reduce Motion Support

**Preconditions:** Enable Reduce Motion in iOS Settings

| Step | Action                  | Expected Result         | Pass/Fail |
| ---- | ----------------------- | ----------------------- | --------- |
| 1    | Trigger milestone       | Modal appears           | ⬜        |
| 2    | Verify confetti         | No confetti animation   | ⬜        |
| 3    | Verify modal transition | Instant fade (no slide) | ⬜        |
| 4    | Verify emoji            | No bounce animation     | ⬜        |

**Success Criteria:** All motion disabled, feature still usable

---

#### TC2.7: VoiceOver Announcements

**Preconditions:** Enable VoiceOver

| Step | Action                   | Expected Result                              | Pass/Fail |
| ---- | ------------------------ | -------------------------------------------- | --------- |
| 1    | Trigger milestone        | VoiceOver announces achievement              | ⬜        |
| 2    | Verify announcement text | "Milestone reached! [Habit] reached [Level]" | ⬜        |
| 3    | Navigate buttons         | "Share Achievement" and "Continue" labeled   | ⬜        |

---

## Feature 3: Share Card Generator

### P0: Critical Path

#### TC3.1: Open from Celebration

**Preconditions:** Celebration modal open

| Step | Action                  | Expected Result                        | Pass/Fail |
| ---- | ----------------------- | -------------------------------------- | --------- |
| 1    | Tap "Share Achievement" | ShareCardGenerator opens               | ⬜        |
| 2    | Verify card preview     | Habit name, strength, emoji visible    | ⬜        |
| 3    | Verify gradient         | Default gradient applied               | ⬜        |
| 4    | Verify science badge    | "Research-backed (Lally et al.)" shown | ⬜        |

**Success Criteria:** Opens <1 second, card renders correctly

---

#### TC3.2: Customize Card

**Preconditions:** ShareCardGenerator open

| Step | Action                     | Expected Result                | Pass/Fail |
| ---- | -------------------------- | ------------------------------ | --------- |
| 1    | Tap "Growth" gradient      | Card updates to green gradient | ⬜        |
| 2    | Tap "Achievement" gradient | Card updates to gold gradient  | ⬜        |
| 3    | Type personal message      | Text appears on card preview   | ⬜        |
| 4    | Toggle user name off       | Name disappears from card      | ⬜        |
| 5    | Toggle user name on        | Name reappears                 | ⬜        |

**Success Criteria:** All customizations reflect in preview <100ms

---

#### TC3.3: Share to Instagram Story

**Preconditions:** Instagram installed, ShareCardGenerator open

| Step | Action                       | Expected Result               | Pass/Fail |
| ---- | ---------------------------- | ----------------------------- | --------- |
| 1    | Tap "Instagram Story" button | Image generates               | ⬜        |
| 2    | Verify loading state         | Spinner shows                 | ⬜        |
| 3    | Wait for generation          | Native share sheet opens      | ⬜        |
| 4    | Select Instagram Stories     | Instagram opens               | ⬜        |
| 5    | Verify image                 | 1080x1920px image in composer | ⬜        |
| 6    | Post story                   | Success                       | ⬜        |

**Success Criteria:** Image generates <2 seconds, correct dimensions

---

### P1: Platform Testing

#### TC3.4: All Platform Formats

**Preconditions:** ShareCardGenerator open, all apps installed

| Platform        | Format | Expected Size | Pass/Fail |
| --------------- | ------ | ------------- | --------- |
| Instagram Story | 9:16   | 1080x1920px   | ⬜        |
| Instagram Feed  | 1:1    | 1080x1080px   | ⬜        |
| Twitter         | 16:9   | 1200x675px    | ⬜        |
| Facebook        | 1.91:1 | 1200x630px    | ⬜        |

**Test:** Select each platform, verify image dimensions in share sheet

---

#### TC3.5: Share to Twitter

**Preconditions:** Twitter installed

| Step | Action                | Expected Result                 | Pass/Fail |
| ---- | --------------------- | ------------------------------- | --------- |
| 1    | Select Twitter format | 1200x675px generated            | ⬜        |
| 2    | Tap Share             | Share sheet opens               | ⬜        |
| 3    | Select Twitter        | Twitter opens                   | ⬜        |
| 4    | Verify caption        | Pre-filled with hashtags + link | ⬜        |
| 5    | Post tweet            | Success                         | ⬜        |

---

### P2: Edge Cases

#### TC3.6: App Not Installed

**Preconditions:** Instagram uninstalled

| Step | Action               | Expected Result                  | Pass/Fail |
| ---- | -------------------- | -------------------------------- | --------- |
| 1    | Tap Instagram button | Alert: "Instagram not installed" | ⬜        |
| 2    | Verify suggestion    | "Save to Photos instead?"        | ⬜        |
| 3    | Tap OK               | Image saved to Photos            | ⬜        |

---

#### TC3.7: Image Generation Failure

**Preconditions:** Low memory condition

| Step | Action                        | Expected Result                       | Pass/Fail |
| ---- | ----------------------------- | ------------------------------------- | --------- |
| 1    | Trigger share with low memory | Error toast appears                   | ⬜        |
| 2    | Verify message                | "Failed to generate image. Try again" | ⬜        |
| 3    | Tap retry                     | Retry generation                      | ⬜        |

---

### P3: Performance

#### TC3.8: Image Generation Speed

**Test:** Measure time from tap to share sheet

| Device        | Time (ms) | Target  | Pass/Fail |
| ------------- | --------- | ------- | --------- |
| iPhone SE     | \_\_\_    | <2000ms | ⬜        |
| iPhone 13     | \_\_\_    | <1000ms | ⬜        |
| iPhone 15 Pro | \_\_\_    | <500ms  | ⬜        |

---

## Feature 4: Habit Detail with Advanced Stats

### P0: Critical Path

#### TC4.1: Open Habit Detail (Free User)

**Preconditions:** Free user, habit with history

| Step | Action                    | Expected Result                   | Pass/Fail |
| ---- | ------------------------- | --------------------------------- | --------- |
| 1    | Tap any habit card        | HabitDetailScreen opens           | ⬜        |
| 2    | Verify swipe-to-dismiss   | Swipe right from edge to close    | ⬜        |
| 3    | Verify strength indicator | Large variant displayed           | ⬜        |
| 4    | Verify formula tooltip    | "See how it's calculated" button  | ⬜        |
| 5    | Tap tooltip               | Formula explanation appears       | ⬜        |
| 6    | Scroll to history chart   | Locked state with upgrade prompt  | ⬜        |
| 7    | Scroll to predictions     | Locked state with upgrade prompt  | ⬜        |
| 8    | Verify action buttons     | Edit/Pause/Archive/Delete visible | ⬜        |

**Success Criteria:** Opens <500ms, all locked features show paywall

---

#### TC4.2: Open Habit Detail (Premium User)

**Preconditions:** Premium user, habit with 30+ days history

| Step | Action                  | Expected Result                  | Pass/Fail |
| ---- | ----------------------- | -------------------------------- | --------- |
| 1    | Tap habit card          | Detail screen opens              | ⬜        |
| 2    | Scroll to history chart | 30-day line graph displayed      | ⬜        |
| 3    | Verify chart data       | Smooth line with data points     | ⬜        |
| 4    | Tap data point          | Stats tooltip appears (optional) | ⬜        |
| 5    | Scroll to predictions   | 7-day forecast shown             | ⬜        |
| 6    | Verify risk assessment  | High/Medium/Low badge            | ⬜        |
| 7    | Verify trend indicator  | Improving/Stable/Declining       | ⬜        |
| 8    | Verify suggestions      | Actionable advice displayed      | ⬜        |

**Success Criteria:** All premium features unlocked, charts render <1 second

---

### P1: Chart Testing

#### TC4.3: History Chart (Premium)

**Preconditions:** Premium user, habit with 30 days data

| Step | Action                        | Expected Result             | Pass/Fail |
| ---- | ----------------------------- | --------------------------- | --------- |
| 1    | View chart                    | Line graph from day 1 to 30 | ⬜        |
| 2    | Verify X-axis                 | Days labeled correctly      | ⬜        |
| 3    | Verify Y-axis                 | 0-100% strength range       | ⬜        |
| 4    | Verify line color             | Brand primary green         | ⬜        |
| 5    | Scroll chart (if pan enabled) | Smooth scrolling            | ⬜        |

**Success Criteria:** Chart accurate, readable, smooth rendering

---

#### TC4.4: Prediction Insights (Premium)

**Preconditions:** Premium user, habit with stable pattern

| Step | Action                    | Expected Result               | Pass/Fail |
| ---- | ------------------------- | ----------------------------- | --------- |
| 1    | View predictions section  | 7-day forecast visible        | ⬜        |
| 2    | Verify predicted strength | Reasonable value (e.g., 67%)  | ⬜        |
| 3    | Verify confidence level   | High/Medium/Low shown         | ⬜        |
| 4    | Verify risk assessment    | Matches habit stability       | ⬜        |
| 5    | Verify suggestions        | Actionable, contextual advice | ⬜        |

**Success Criteria:** Predictions make sense, match habit patterns

---

### P2: Action Buttons

#### TC4.5: Edit Habit

**Preconditions:** Detail screen open

| Step | Action            | Expected Result         | Pass/Fail |
| ---- | ----------------- | ----------------------- | --------- |
| 1    | Tap "Edit" button | Edit modal opens (TODO) | ⬜        |
| 2    | Modify habit name | Changes saved           | ⬜        |
| 3    | Close edit modal  | Return to detail screen | ⬜        |
| 4    | Verify updates    | Name updated in UI      | ⬜        |

**Note:** Edit modal integration TODO

---

#### TC4.6: Pause Habit

**Preconditions:** Detail screen open

| Step | Action             | Expected Result                        | Pass/Fail |
| ---- | ------------------ | -------------------------------------- | --------- |
| 1    | Tap "Pause" button | Confirmation dialog appears            | ⬜        |
| 2    | Verify warning     | "Habit will be hidden from daily list" | ⬜        |
| 3    | Tap Confirm        | Habit paused (TODO: backend)           | ⬜        |
| 4    | Return to Home     | Habit not visible in list              | ⬜        |

**Note:** Pause mutation TODO

---

#### TC4.7: Archive Habit

**Preconditions:** Detail screen open

| Step | Action                    | Expected Result                      | Pass/Fail |
| ---- | ------------------------- | ------------------------------------ | --------- |
| 1    | Tap "Archive" button      | Confirmation dialog appears          | ⬜        |
| 2    | Verify message            | "Move to archive? History preserved" | ⬜        |
| 3    | Tap Confirm               | Habit archived                       | ⬜        |
| 4    | Return to Home            | Habit removed from list              | ⬜        |
| 5    | Go to Settings > Archived | Habit visible in archive             | ⬜        |

---

#### TC4.8: Delete Habit

**Preconditions:** Detail screen open

| Step | Action              | Expected Result               | Pass/Fail |
| ---- | ------------------- | ----------------------------- | --------- |
| 1    | Tap "Delete" button | Confirmation dialog appears   | ⬜        |
| 2    | Verify warning      | "Cannot be undone!" in red    | ⬜        |
| 3    | Tap Cancel          | Dialog dismisses, no action   | ⬜        |
| 4    | Tap Delete again    | Dialog reappears              | ⬜        |
| 5    | Tap Confirm Delete  | Habit deleted (TODO: backend) | ⬜        |
| 6    | Return to Home      | Habit permanently removed     | ⬜        |

**Note:** Delete mutation TODO

---

### P3: Performance

#### TC4.9: Chart Rendering Performance

**Test:** Measure chart render time

| Device        | Data Points | Time (ms) | Target  | Pass/Fail |
| ------------- | ----------- | --------- | ------- | --------- |
| iPhone SE     | 30          | \_\_\_    | <500ms  | ⬜        |
| iPhone 13     | 30          | \_\_\_    | <300ms  | ⬜        |
| iPhone 15 Pro | 30          | \_\_\_    | <200ms  | ⬜        |
| iPhone SE     | 90          | \_\_\_    | <1000ms | ⬜        |

**Tool:** Use Xcode Instruments Time Profiler

---

## Cross-Feature Integration Tests

### P0: End-to-End User Journey

#### TC5.1: Complete User Flow (Day 1 to Milestone)

**Test:** New user from template import to first milestone

| Step | Action                                       | Expected Result                       | Pass/Fail |
| ---- | -------------------------------------------- | ------------------------------------- | --------- |
| 1    | **Templates:** Import "Morning Meditation"   | Habit created                         | ⬜        |
| 2    | **Home:** See habit at 0% strength           | Starting 🌱                           | ⬜        |
| 3    | **Tracking:** Complete habit 7 days straight | Strength increases daily              | ⬜        |
| 4    | **Milestone:** Day 7, reach 21% strength     | Celebration modal appears             | ⬜        |
| 5    | **Confetti:** Watch animation                | Smooth confetti, no lag               | ⬜        |
| 6    | **Share:** Tap "Share Achievement"           | ShareCardGenerator opens              | ⬜        |
| 7    | **Customize:** Select gradient, add message  | Preview updates                       | ⬜        |
| 8    | **Post:** Share to Instagram                 | Story posted                          | ⬜        |
| 9    | **Detail:** Tap habit to view stats          | Detail screen opens                   | ⬜        |
| 10   | **Charts:** View 7-day history               | Chart displayed (free user sees lock) | ⬜        |

**Success Criteria:** Entire flow completes without errors, <5 minutes total

---

#### TC5.2: Premium Upgrade Journey

**Test:** Free user encounters paywall, upgrades, unlocks features

| Step | Action                  | Expected Result            | Pass/Fail |
| ---- | ----------------------- | -------------------------- | --------- |
| 1    | Free user taps habit    | Detail screen opens        | ⬜        |
| 2    | Scroll to history chart | Locked with upgrade button | ⬜        |
| 3    | Tap "Upgrade"           | Paywall modal appears      | ⬜        |
| 4    | Start 7-day trial       | Payment sheet authorizes   | ⬜        |
| 5    | Return to detail screen | Charts now unlocked        | ⬜        |
| 6    | View 30-day history     | Full chart displayed       | ⬜        |
| 7    | View predictions        | 7-day forecast shown       | ⬜        |

**Success Criteria:** Premium unlocks instantly after purchase

---

### P1: Multi-Habit Scenarios

#### TC5.3: Multiple Habits, Multiple Milestones

**Test:** Track 3 habits, each hitting different milestones

| Step | Action                  | Expected Result                 | Pass/Fail |
| ---- | ----------------------- | ------------------------------- | --------- |
| 1    | Import 3 templates      | 3 habits created                | ⬜        |
| 2    | Complete Habit A to 21% | Celebration for Habit A         | ⬜        |
| 3    | Dismiss celebration     | Return to Home                  | ⬜        |
| 4    | Complete Habit B to 41% | Celebration for Habit B         | ⬜        |
| 5    | Complete Habit C to 61% | Celebration for Habit C         | ⬜        |
| 6    | Verify no duplicates    | Each celebration triggered once | ⬜        |

**Success Criteria:** Correct milestone for each habit, no mix-ups

---

## Performance Testing

### P3: Overall App Performance

#### TC6.1: App Launch Time

**Test:** Measure cold start time

| Device        | Time (ms) | Target  | Pass/Fail |
| ------------- | --------- | ------- | --------- |
| iPhone SE     | \_\_\_    | <3000ms | ⬜        |
| iPhone 13     | \_\_\_    | <2000ms | ⬜        |
| iPhone 15 Pro | \_\_\_    | <1500ms | ⬜        |

---

#### TC6.2: Frame Rate During Animations

**Test:** Use Xcode Instruments to measure FPS

| Animation    | Device    | FPS    | Target | Pass/Fail |
| ------------ | --------- | ------ | ------ | --------- |
| Confetti     | iPhone SE | \_\_\_ | 60fps  | ⬜        |
| Modal slide  | iPhone SE | \_\_\_ | 60fps  | ⬜        |
| Chart render | iPhone SE | \_\_\_ | 60fps  | ⬜        |
| Share card   | iPhone SE | \_\_\_ | 60fps  | ⬜        |

**Tool:** Xcode > Debug > View Debugging > Rendering

---

#### TC6.3: Memory Usage

**Test:** Monitor memory during intensive operations

| Operation              | Before (MB) | After (MB) | Leak   | Pass/Fail |
| ---------------------- | ----------- | ---------- | ------ | --------- |
| Import 10 templates    | \_\_\_      | \_\_\_     | \_\_\_ | ⬜        |
| Trigger 5 celebrations | \_\_\_      | \_\_\_     | \_\_\_ | ⬜        |
| Generate 5 share cards | \_\_\_      | \_\_\_     | \_\_\_ | ⬜        |
| View 10 detail screens | \_\_\_      | \_\_\_     | \_\_\_ | ⬜        |

**Tool:** Xcode Instruments > Leaks

---

## Accessibility Testing

### P3: WCAG 2.1 Level AA Compliance

#### TC7.1: VoiceOver Full Flow

**Preconditions:** VoiceOver enabled

| Step | Action                       | Expected Result                           | Pass/Fail |
| ---- | ---------------------------- | ----------------------------------------- | --------- |
| 1    | Navigate to Templates tab    | "Templates" announced                     | ⬜        |
| 2    | Swipe through template cards | Each card labeled with name + description | ⬜        |
| 3    | Double-tap to import         | "Importing [name]" announced              | ⬜        |
| 4    | Navigate to Home             | "Home" announced, habit count read        | ⬜        |
| 5    | Swipe through habits         | Each habit labeled with name + strength   | ⬜        |
| 6    | Trigger milestone            | Achievement announced                     | ⬜        |
| 7    | Navigate celebration modal   | Buttons labeled correctly                 | ⬜        |

**Success Criteria:** All content accessible, logical reading order

---

#### TC7.2: Dynamic Type Support

**Preconditions:** Set text size to XXXL

| Screen       | Layout | Text Readable | No Clipping | Pass/Fail |
| ------------ | ------ | ------------- | ----------- | --------- |
| Templates    | ⬜     | ⬜            | ⬜          | ⬜        |
| Celebration  | ⬜     | ⬜            | ⬜          | ⬜        |
| Share Card   | ⬜     | ⬜            | ⬜          | ⬜        |
| Detail Stats | ⬜     | ⬜            | ⬜          | ⬜        |

**Success Criteria:** All text scales, no horizontal scrolling

---

#### TC7.3: Color Contrast

**Test:** Verify all text meets WCAG AA standards

| Element              | Foreground | Background | Ratio  | Min   | Pass/Fail |
| -------------------- | ---------- | ---------- | ------ | ----- | --------- |
| Habit name           | #374151    | #FFFFFF    | \_\_\_ | 4.5:1 | ⬜        |
| Strength %           | #10B981    | #FFFFFF    | \_\_\_ | 3:1   | ⬜        |
| Button text          | #FFFFFF    | #10B981    | \_\_\_ | 4.5:1 | ⬜        |
| Template description | #6B7280    | #FFFFFF    | \_\_\_ | 4.5:1 | ⬜        |

**Tool:** WebAIM Contrast Checker

---

## Error Handling & Edge Cases

### P2: Network Conditions

#### TC8.1: Offline Mode

**Preconditions:** Enable airplane mode

| Action                    | Expected Result           | Pass/Fail |
| ------------------------- | ------------------------- | --------- |
| View templates (cached)   | Display cached templates  | ⬜        |
| Import template           | Error: "No connection"    | ⬜        |
| Trigger milestone (local) | Celebration works offline | ⬜        |
| Generate share card       | Works offline             | ⬜        |
| View detail stats         | Cached data displayed     | ⬜        |

---

#### TC8.2: Slow Network (3G)

**Preconditions:** Network Link Conditioner set to 3G

| Action                | Expected Result               | Pass/Fail |
| --------------------- | ----------------------------- | --------- |
| Load templates        | Loading spinner, then display | ⬜        |
| Import template       | Takes longer, success toast   | ⬜        |
| Sync habit completion | Queued, syncs when complete   | ⬜        |

---

### P2: Data Edge Cases

#### TC8.3: Empty States

**Test:** Verify all empty states

| Scenario        | Empty State Message             | Pass/Fail |
| --------------- | ------------------------------- | --------- |
| No templates    | "No templates available"        | ⬜        |
| No habits       | "Create your first habit"       | ⬜        |
| No history data | "Complete habit to see history" | ⬜        |

---

#### TC8.4: Boundary Values

**Test:** Extreme values

| Test                  | Input              | Expected               | Pass/Fail |
| --------------------- | ------------------ | ---------------------- | --------- |
| Habit at 0% strength  | Complete once      | Strength increases     | ⬜        |
| Habit at 99% strength | Complete once      | Caps at 100%, no error | ⬜        |
| 100 templates         | Scroll through all | Smooth performance     | ⬜        |
| 90-day history        | View chart         | Renders correctly      | ⬜        |

---

## Regression Testing

### P1: Existing Features Still Work

#### TC9.1: Core Habit Tracking

**Test:** Ensure Phase 3 didn't break existing features

| Feature              | Test                                      | Pass/Fail |
| -------------------- | ----------------------------------------- | --------- |
| Habit creation       | Create habit manually (not from template) | ⬜        |
| Habit completion     | Mark habit complete/incomplete            | ⬜        |
| Strength calculation | Strength updates correctly                | ⬜        |
| Settings             | All settings still accessible             | ⬜        |
| Analytics tab        | Analytics still work (if implemented)     | ⬜        |

---

## Test Execution Summary

### Coverage Report

```
Total Test Cases: ___
Passed: ___
Failed: ___
Blocked: ___
Not Tested: ___

Coverage: ____%
```

### Critical Bugs (P0)

```
Bug ID | Description | Status
-------|-------------|-------
       |             |
```

### High Priority Bugs (P1)

```
Bug ID | Description | Status
-------|-------------|-------
       |             |
```

### Medium Priority Bugs (P2)

```
Bug ID | Description | Status
-------|-------------|-------
       |             |
```

---

## Sign-Off

**QA Engineer:** ******\_\_\_******
**Date:** ******\_\_\_******

**Product Manager:** ******\_\_\_******
**Date:** ******\_\_\_******

**Developer:** ******\_\_\_******
**Date:** ******\_\_\_******

**Status:** [ ] Ready for Production / [ ] Needs Fixes

---

## Appendix: Testing Tools

### Recommended Tools

1. **Xcode Instruments** - Performance profiling
2. **Accessibility Inspector** - VoiceOver testing
3. **Network Link Conditioner** - Simulate network conditions
4. **Charles Proxy** - Monitor network requests
5. **TestFlight** - Beta testing distribution

### Useful Commands

```bash
# Run on specific device
npx expo run:ios --device "iPhone SE"

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Profile with Instruments
xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -destination 'platform=iOS Simulator,name=iPhone SE' -enableCodeCoverage YES test

# Check bundle size
npx expo export --platform ios
du -sh dist
```

---

**Last Updated:** October 22, 2025
**Version:** 1.0
**Total Estimated Testing Time:** 8-12 hours
