# iOS Widgets Roadmap

## Overview

iOS widgets are **critical for retention** — they keep Chain Day visible on users' home screens and lock screens, providing constant motivation and quick habit status updates without opening the app.

**Goal:** Implement iOS 14+ widgets (Home Screen) and iOS 16+ Lock Screen widgets using `react-native-widget-extension` or a custom native module.

---

## Current State

- ❌ No widget dependencies installed
- ❌ No widget configuration in `app.json`
- ❌ No native widget extension targets
- ✅ App uses Expo SDK 54 (bare workflow likely needed for widgets)

**Recommendation:** Use **`react-native-widget-extension`** for maximum flexibility and React Native integration, or explore **Expo Config Plugins** for widget extensions.

---

## Widget Specifications

### 1. Small Widget (2x2) - Today's Status
**Display:**
- Habit completion status: `X/Y completed`
- Progress ring or bar
- Current streak number (small text)
- Tapping opens app to Today view

**Data Required:**
- Total habits for today
- Completed habits count
- Current streak

**Visual Design:**
- Background: White (light mode) / Dark gray (dark mode)
- Primary green (#047857) for progress
- SF Pro typography: 34pt for count, 13pt for label
- 16px border radius, 4px shadow (0.08 opacity, 16px blur)

---

### 2. Medium Widget (4x2) - Streak + Habits
**Display:**
- Large streak counter with flame emoji 🔥
- List of today's habits (up to 3) with checkmarks
- "Tap to log" CTA if incomplete habits remain

**Data Required:**
- Current streak
- Today's habits (name + completion status)
- Habits sorted by: incomplete first, then by creation order

**Visual Design:**
- Same design system as small widget
- Habit list: 17pt body text, checkmark icons (green for complete, gray outline for incomplete)
- Streak: 34pt display weight

---

### 3. Lock Screen Widget - Streak Number
**Display:**
- Just the streak number with 🔥 emoji
- Minimal, glanceable
- iOS 16+ circular or rectangular lock screen widget

**Data Required:**
- Current streak only

**Visual Design:**
- Monochrome for lock screen compatibility
- Adaptive to light/dark mode
- 22pt title weight for number

---

## Implementation Plan

### Phase 1: Setup & Infrastructure
**Estimated Time:** 4-6 hours

1. **Install Dependencies**
   ```bash
   npm install react-native-widget-extension
   # OR explore Expo config plugin approach
   ```

2. **Update `app.json`**
   - Add widget extension configuration
   - Define widget families (small, medium, lock screen)
   - Set bundle identifiers

3. **Create Native Widget Extension**
   - Add iOS widget extension target to Xcode project
   - Configure Info.plist for widget
   - Set up shared App Group for data sharing between app and widget

4. **Set Up Data Sharing**
   - Create shared UserDefaults suite using App Groups
   - Define data schema for widget consumption
   - Implement background data sync from main app to widget data store

---

### Phase 2: Small Widget (MVP)
**Estimated Time:** 6-8 hours

1. **Create Widget Component**
   - `src/widgets/SmallWidget.tsx` (React Native component)
   - Display habit count: "X/Y completed"
   - Progress ring using `react-native-svg`
   - Streak number in corner

2. **Data Layer**
   - Create `src/widgets/widgetData.ts`
   - Fetch today's habits from Convex
   - Calculate completion percentage
   - Write to shared UserDefaults

3. **Widget Timeline Provider**
   - Native Swift code in widget extension
   - Read from shared UserDefaults
   - Provide timeline entries (update every 15 minutes or on app background)

4. **Deep Linking**
   - Configure widget tap to open app
   - Route to Today screen

---

### Phase 3: Medium Widget
**Estimated Time:** 4-6 hours

1. **Create Component**
   - `src/widgets/MediumWidget.tsx`
   - Streak display with flame emoji
   - List of up to 3 habits with status

2. **Data Extension**
   - Add habit list to shared data
   - Include habit names and completion status
   - Limit to top 3 incomplete or recently completed

3. **Widget Timeline Provider**
   - Extend native provider to handle medium size
   - Same data source, different layout

---

### Phase 4: Lock Screen Widget
**Estimated Time:** 3-4 hours

1. **iOS 16+ Configuration**
   - Add accessory widget family support
   - Define circular and rectangular lock screen variants

2. **Create Component**
   - `src/widgets/LockScreenWidget.tsx`
   - Minimalist streak number + emoji
   - Monochrome styling

3. **Timeline Provider**
   - Simplest data: just streak number
   - Update on streak change

---

### Phase 5: Background Updates & Optimization
**Estimated Time:** 3-4 hours

1. **Background Refresh**
   - Set up background tasks to update widget data
   - Use `expo-background-fetch` or native background tasks
   - Update widget timeline on habit completion

2. **Performance**
   - Minimize data size in shared storage
   - Optimize timeline refresh frequency
   - Test widget memory usage

3. **Error Handling**
   - Fallback UI if data unavailable
   - Handle app uninstall gracefully

---

## Technical Considerations

### App Groups (Required)
Widgets run in a separate process and need shared data storage:
```swift
// In Xcode, add App Group capability:
// group.com.chainday.app
```

### Data Schema (Shared UserDefaults)
```json
{
  "todayHabitsTotal": 5,
  "todayHabitsCompleted": 3,
  "currentStreak": 12,
  "habits": [
    { "id": "123", "name": "Morning Meditation", "completed": true },
    { "id": "456", "name": "Read 20 pages", "completed": false },
    { "id": "789", "name": "Workout", "completed": false }
  ],
  "lastUpdated": 1676505600
}
```

### Widget Update Triggers
- App enters background → update widget data
- Habit marked complete → update widget data
- Streak changes → update widget data
- Time-based: every 15 minutes via widget timeline

---

## Testing Checklist

- [ ] Small widget displays correctly on home screen
- [ ] Medium widget shows habits list
- [ ] Lock screen widget appears on iOS 16+
- [ ] Widget updates when habit completed in app
- [ ] Widget updates when streak changes
- [ ] Widget taps open app to correct screen
- [ ] Light/dark mode support
- [ ] Widget placeholder shown during loading
- [ ] Widget handles no habits gracefully
- [ ] Widget respects data privacy (no sensitive info visible when locked)

---

## Future Enhancements

- **Interactive Widgets (iOS 17+):** Allow marking habits complete directly from widget
- **Live Activities:** Show real-time streak progress throughout the day
- **Apple Watch Complications:** Extend to watchOS
- **Widget Configuration:** Let users choose which habits appear in medium widget
- **Smart Stack Rotation:** Optimize for iOS Smart Stack relevance

---

## Resources

- [react-native-widget-extension](https://github.com/birdrides/react-native-widget-extension)
- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [Expo Config Plugins for Widgets](https://docs.expo.dev/guides/config-plugins/)
- [App Groups Guide](https://developer.apple.com/documentation/security/app_sandbox/sharing_data_with_app_extensions)

---

## Estimated Total Time
**22-28 hours** (3-4 days of focused development)

**Priority:** HIGH — Widgets significantly improve retention by keeping the app top-of-mind without requiring users to open it.

---

## Dependencies to Install

```bash
# Primary widget library
npm install react-native-widget-extension

# May also need:
npm install react-native-shared-group-preferences  # For App Group data sharing
```

Update `app.json` with widget configuration:
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.chainday.app",
      "widgets": {
        "enabled": true,
        "appGroups": ["group.com.chainday.app"]
      }
    }
  }
}
```

---

**Next Steps:**
1. Confirm bare workflow setup (may need to eject from Expo managed workflow)
2. Set up Xcode widget extension target
3. Implement small widget as MVP
4. Iterate based on user feedback
