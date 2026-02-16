# iOS Widget Roadmap for ChainDay

**Created by:** Sonnet  
**Date:** February 16, 2026  
**Status:** 🚧 Planning Phase

---

## Overview

This document outlines the plan to add iOS Home Screen widgets to ChainDay, allowing users to view their habit progress at a glance without opening the app.

---

## 1. Widget Data Display

### Core Metrics to Show

**Priority 1 (MVP):**
- **Today's Habits**: List of habits scheduled for today with completion status
- **Completion Percentage**: Today's progress (e.g., "3/5 completed — 60%")
- **Current Streak**: Longest active streak across all habits

**Priority 2 (Future):**
- **Habits at Risk**: Habits with accessibility < 0.3 (using the Memory Accessibility System)
- **Weekly Progress**: Mini calendar showing this week's completion pattern
- **Motivational Quote**: Daily affirmation or identity statement

### Data Requirements

From Convex backend:
```typescript
interface WidgetData {
  habits: Array<{
    id: string;
    name: string;
    icon?: string;
    color?: string;
    completed: boolean; // from tracking record for today
    currentStreak: number;
    accessibility?: number; // for "at risk" detection
  }>;
  
  todayStats: {
    completed: number;
    total: number;
    percentage: number;
  };
  
  bestStreak: {
    habitName: string;
    count: number;
  };
  
  lastUpdated: number; // timestamp for cache validation
}
```

---

## 2. Widget Size Designs

### Small Widget (2×2 grid)
**Visual Layout:**
```
┌─────────────────┐
│  ChainDay 🔗    │
│                 │
│     3/5 ✓       │
│    60% today    │
│                 │
│  🔥 12 day      │
│  streak         │
└─────────────────┘
```

**Content:**
- App branding
- Today's completion ratio
- Best current streak

**Technical:** Single timeline entry, updates every 15 minutes

---

### Medium Widget (4×2 grid)
**Visual Layout:**
```
┌─────────────────────────────────┐
│  ChainDay          3/5 done     │
│  ────────────────────────────   │
│  💧 Drink Water        ✓        │
│  📚 Read 20 min        ✓        │
│  🧘 Meditate           ○        │
│  🏃 Exercise           ✓        │
│  🌙 Sleep early        ○        │
└─────────────────────────────────┘
```

**Content:**
- Today's completion summary
- List of up to 5 habits with icons and status
- Visual checkmarks/circles

**Technical:** Timeline updates every 15 minutes, refresh on habit toggle

---

### Large Widget (4×4 grid)
**Visual Layout:**
```
┌─────────────────────────────────┐
│  ChainDay          3/5 — 60%    │
│  ────────────────────────────   │
│  💧 Drink Water        ✓  5 🔥  │
│  📚 Read 20 min        ✓  12 🔥 │
│  🧘 Meditate           ○  2 🔥  │
│  🏃 Exercise           ✓  7 🔥  │
│  🌙 Sleep early        ○  0 🔥  │
│  ────────────────────────────   │
│  Best Streak: Read 📚 12 days   │
│  ────────────────────────────   │
│  "I am becoming a healthy       │
│   person, one habit at a time"  │
└─────────────────────────────────┘
```

**Content:**
- Full habit list with icons, status, and individual streaks
- Best streak highlight
- Motivational identity statement or affirmation
- More detailed progress tracking

**Technical:** Timeline updates every 15 minutes, rich interactions

---

## 3. Technical Approach

### Option A: Native iOS Widget Extension (Recommended)

**Pros:**
- Full WidgetKit API access
- Best performance and native feel
- Official Apple support
- Deep customization (timelines, intents, etc.)

**Cons:**
- Requires native Swift code
- More complex setup with Expo managed workflow
- Need custom development client
- Requires Xcode and macOS for development

**Implementation:**
1. Create iOS Widget Extension target in Xcode
2. Configure **Shared App Groups** for data sharing:
   - App Group ID: `group.com.chainday.app.shared`
   - Use `UserDefaults(suiteName:)` for data bridge
3. Export widget data from React Native to shared storage
4. Widget reads from shared UserDefaults on timeline updates
5. Use EAS Build for custom native code compilation

---

### Option B: expo-widgets (Experimental)

**Pros:**
- Managed workflow compatible
- JavaScript/TypeScript configuration
- Simpler for React Native developers

**Cons:**
- Community package, not official Expo
- Limited documentation
- May not support all WidgetKit features
- Potentially unstable

**Status:** As of Expo SDK 54, this is still experimental. Monitor for updates.

---

### Option C: react-native-widget-extension

**Pros:**
- More mature than expo-widgets
- Good documentation
- Community support

**Cons:**
- Still requires native code
- Not optimized for Expo managed workflow
- Similar complexity to Option A

---

### Recommended Path: Native iOS Widget Extension

Given ChainDay is already using EAS Build and has custom native plugins (`withPrivacyManifest.cjs`), adding a native widget extension is the most reliable approach.

---

## 4. Data Bridge Architecture

### Data Flow

```
┌─────────────────┐
│  React Native   │
│  (Main App)     │
└────────┬────────┘
         │
         │ Write widget data on:
         │ - Habit toggle
         │ - App background
         │ - Periodic sync
         │
         ▼
┌─────────────────┐
│ Shared App      │
│ Group Storage   │
│ (UserDefaults)  │
└────────┬────────┘
         │
         │ Read on timeline
         │ refresh (every 15min)
         │
         ▼
┌─────────────────┐
│  iOS Widget     │
│  Extension      │
└─────────────────┘
```

### Shared Data Format

Store in `UserDefaults(suiteName: "group.com.chainday.app.shared")`:

```json
{
  "widget_data_v1": {
    "habits": [
      {
        "id": "abc123",
        "name": "Drink Water",
        "icon": "💧",
        "color": "#059669",
        "completed": true,
        "streak": 5
      }
    ],
    "todayStats": {
      "completed": 3,
      "total": 5,
      "percentage": 60
    },
    "bestStreak": {
      "name": "Read",
      "count": 12
    },
    "lastUpdated": 1708124400000
  }
}
```

### Update Triggers

**From React Native:**
- When user toggles a habit (immediate)
- On app backgrounding (write latest state)
- Every 5 minutes when app is active (passive sync)
- On push notification delivery

**Widget Timeline:**
- Request updates every 15 minutes (WidgetKit limit)
- Use `getTimeline()` to batch next 12 hours of entries
- Reload timeline on app foreground with `WidgetCenter.reloadAllTimelines()`

---

## 5. Dependencies & Setup

### New Dependencies

**Native (iOS):**
- WidgetKit framework (built into iOS 14+)
- SwiftUI (for widget UI)

**React Native:**
```bash
# For shared storage access
npm install @react-native-async-storage/async-storage
# (already installed ✓)

# For app group communication (if needed)
npm install react-native-shared-group-preferences
```

**Config Plugins:**
```bash
# Create custom config plugin for widget extension
# File: plugins/withWidgetExtension.js
```

### App Configuration

**app.json modifications:**
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.chainday.app",
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.chainday.app.shared"
        ]
      }
    },
    "plugins": [
      // ... existing plugins
      "./plugins/withWidgetExtension.js"
    ]
  }
}
```

### EAS Build Configuration

**eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

### Required Files Structure

```
ios/
├── ChainDay/                    # Main app target
│   └── Info.plist
├── ChainDayWidget/              # NEW: Widget extension
│   ├── ChainDayWidget.swift
│   ├── ChainDayWidgetBundle.swift
│   ├── ChainDayWidget.intentdefinition
│   ├── Assets.xcassets/
│   └── Info.plist
└── ChainDay.xcodeproj
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create widget extension target in Xcode
- [ ] Configure shared app group entitlements
- [ ] Set up data bridge (UserDefaults shared suite)
- [ ] Create basic small widget with static data
- [ ] Test EAS build with custom native code

### Phase 2: Data Integration (Week 2)
- [ ] Implement React Native → shared storage writer
- [ ] Hook into habit toggle events to update widget data
- [ ] Implement background data refresh
- [ ] Add widget timeline provider logic
- [ ] Test widget updates in response to app changes

### Phase 3: Widget Sizes & Design (Week 2-3)
- [ ] Implement small widget (2×2)
- [ ] Implement medium widget (4×2)
- [ ] Implement large widget (4×4)
- [ ] Apply ChainDay design system:
  - Colors: #047857 (text), #059669 (primary)
  - Fonts: SF Pro (system)
  - Border radius: 12-16px equivalent
  - Shadows with 0.08 opacity
- [ ] Test all sizes on iPhone and iPad

### Phase 4: Polish & Optimization (Week 3-4)
- [ ] Add widget configuration (select which habits to show)
- [ ] Implement deep links (tap widget → open specific habit)
- [ ] Optimize timeline efficiency (battery usage)
- [ ] Add placeholder states (no data, first launch)
- [ ] Error handling and fallbacks
- [ ] Widget preview images for App Store

### Phase 5: Testing & Release (Week 4)
- [ ] TestFlight beta with widget testers
- [ ] Performance profiling (CPU, memory, battery)
- [ ] Accessibility testing (VoiceOver, Dynamic Type)
- [ ] App Store submission with widget screenshots
- [ ] Documentation update (help docs, widget features)

---

## 7. User Experience Considerations

### Widget Interaction Patterns

**Tap Behaviors:**
- **Small widget tap:** Open app to Today view
- **Medium widget tap (habit row):** Deep link to specific habit detail
- **Large widget tap (identity statement):** Open app to reflection/journal

**Visual Feedback:**
- Use subtle animations for state changes (SwiftUI transitions)
- Show "Last updated X minutes ago" on large widget
- Gray out paused habits
- Use SF Symbols for icons when emoji not available

### Error States

**No Data Available:**
```
┌─────────────────┐
│  ChainDay 🔗    │
│                 │
│  Open app to    │
│  get started    │
└─────────────────┘
```

**Sync Error:**
```
┌─────────────────┐
│  ChainDay       │
│  ⚠️ Unable to   │
│  sync data      │
│  Tap to refresh │
└─────────────────┘
```

---

## 8. Future Enhancements

### Widget Intents (iOS 16+)
- Allow users to select which habits appear in widget
- Configure widget to show specific categories
- Choose between "Today's habits" vs "At Risk habits"

### Live Activities (iOS 16.1+)
- Real-time habit completion notifications on Dynamic Island
- Progress bar for daily goal completion

### Interactive Widgets (iOS 17+)
- Toggle habit completion directly from widget (no app launch)
- SwiftUI Button and Toggle support

### watchOS Complications
- Extend to Apple Watch faces
- Quick glance at streak count

---

## 9. Privacy & Performance

### Privacy Considerations
- Widget data stored in shared app group (sandboxed)
- No sensitive personal data in widget (follow Clerk auth model)
- Respect user's "Show Previews" iOS setting
- Add to privacy policy: "Widget displays habit names and progress"

### Performance Guidelines
- Widget bundle size: < 5MB (including assets)
- Timeline entries: Maximum 12 hours ahead
- Update frequency: 15-minute minimum (iOS limitation)
- Memory usage: < 30MB per widget instance
- Launch time: < 100ms for timeline generation

---

## 10. Dependencies Summary

### Required Packages

```json
{
  "dependencies": {
    "react-native-shared-group-preferences": "^1.1.26"
  },
  "devDependencies": {
    "@types/react-native-shared-group-preferences": "^1.1.0"
  }
}
```

### Native Dependencies
- iOS 14.0+ (WidgetKit requirement)
- Xcode 14+ (for development)
- Swift 5.5+

### Infrastructure
- EAS Build (custom native code)
- App Store Connect (widget screenshots, metadata)
- Convex backend (existing, no changes needed)

---

## 11. Testing Strategy

### Unit Tests
- Data serialization to shared storage
- Widget data transformer logic
- Timeline entry generation

### Integration Tests
- End-to-end: Toggle habit → widget updates
- Background refresh → timeline reload
- Deep link navigation

### Manual Testing Checklist
- [ ] Small/medium/large widgets display correctly
- [ ] Widget updates when habit toggled
- [ ] Widget updates when app backgrounded
- [ ] Deep links work (tap habit row → opens app to detail)
- [ ] Placeholder states (no data, loading)
- [ ] Dark mode appearance
- [ ] Accessibility (VoiceOver, Dynamic Type)
- [ ] Multiple widget instances (different sizes)
- [ ] Memory usage under 30MB
- [ ] Battery impact minimal
- [ ] Works on iOS 14, 15, 16, 17

---

## 12. Success Metrics

### Development Milestones
- ✅ Widget extension builds successfully
- ✅ Data bridge functional (app → widget)
- ✅ All three widget sizes implemented
- ✅ EAS Build produces working .ipa

### User Engagement (Post-Launch)
- Widget adoption rate (% of users who add widget)
- Widget tap-through rate (opens from widget)
- Habit completion rate increase (with vs without widget)
- User feedback & App Store reviews mentioning widgets

---

## 13. Resources & References

### Official Documentation
- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [Expo Custom Native Code Guide](https://docs.expo.dev/workflow/customizing/)
- [EAS Build Configuration](https://docs.expo.dev/build/introduction/)

### Community Resources
- [react-native-widget-extension GitHub](https://github.com/anday013/react-native-widget-extension)
- [expo-widgets GitHub](https://github.com/gaishimo/expo-widgets)

### Design Inspiration
- Streaks app widget design
- Apple Health app widgets
- Things 3 widgets

---

## 14. Timeline Estimate

**Total Development Time:** 3-4 weeks (single developer)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Foundation | 3-5 days | Extension target, shared storage, basic widget |
| Data Integration | 4-6 days | Real data flow, update triggers, timeline logic |
| Widget Designs | 5-7 days | Small/medium/large widgets, design system applied |
| Polish | 3-5 days | Deep links, configuration, error states |
| Testing & Release | 3-4 days | TestFlight, bug fixes, App Store submission |

**Critical Path:** EAS Build setup → Data bridge → Medium widget → Testing

---

## 15. Risk Assessment

### High Risk
- **EAS Build complexity:** Custom native code may require troubleshooting
  - *Mitigation:* Start with simplest possible widget, test build early
  
- **Data sync reliability:** Widget may show stale data
  - *Mitigation:* Add "last updated" timestamp, graceful degradation

### Medium Risk
- **WidgetKit learning curve:** Team may be unfamiliar with Swift/SwiftUI
  - *Mitigation:* Use templates, lean on community examples

- **Timeline refresh limits:** 15-minute minimum may feel slow
  - *Mitigation:* Use background refresh, aggressive timeline reloads

### Low Risk
- **Design system consistency:** Widget UI may not match app perfectly
  - *Mitigation:* Extract colors/fonts to shared constants

---

## Next Steps

1. **Approval:** Review this roadmap with team and stakeholders
2. **Environment Setup:** Install Xcode, configure EAS credentials
3. **Spike:** Create minimal widget extension, verify EAS build works
4. **Iteration:** Follow phase plan, ship incrementally
5. **Feedback:** TestFlight beta → iterate based on user testing

---

**Document Status:** ✅ Ready for Review  
**Last Updated:** February 16, 2026  
**Author:** Sonnet (Subagent)
