# iOS Habit Streaks Widget — Setup Guide

## Overview

This PR adds a **Habit Streaks Widget** for iOS using WidgetKit. The widget comes in three sizes:

| Size | What it shows |
|------|--------------|
| **Small** (2×2) | Single habit with streak count & today status |
| **Medium** (4×2) | Top 3 habits with streaks, flames, and completion dots |
| **Large** (4×4) | Weekly overview grid — all habits × 7 days with check dots |

## Architecture

```
React Native App
  └─ widgetDataBridge.ts (syncWidgetData)
       └─ Shared App Group UserDefaults
            └─ HabitStreaksWidget (SwiftUI / WidgetKit)
                 └─ Timeline refresh every 15 minutes
```

## Files Added

| File | Purpose |
|------|---------|
| `ios/HabitStreaksWidget/HabitStreaksWidget.swift` | All widget code (provider, views, bundle) |
| `ios/HabitStreaksWidget/Info.plist` | Widget extension metadata |
| `ios/HabitStreaksWidget/HabitStreaksWidget.entitlements` | App Group for shared storage |
| `src/utils/widgetDataBridge.ts` | React Native → Widget data sync |
| `plugins/withHabitStreaksWidget.js` | Expo config plugin (App Group + background fetch) |

## Xcode Setup (Required for EAS Build)

The widget extension **target** must be created in Xcode:

1. Open `ios/ChainDay.xcworkspace`
2. File → New → Target → **Widget Extension**
3. Name: `HabitStreaksWidget`
4. Bundle ID: `com.chainday.app.HabitStreaksWidget`
5. Delete the auto-generated Swift file
6. Add `ios/HabitStreaksWidget/HabitStreaksWidget.swift` to the target
7. In Signing & Capabilities, add **App Groups** → `group.com.chainday.app.shared`
8. Set deployment target to iOS 16.0+

## Wiring the Data Bridge

Call `syncWidgetData()` from `widgetDataBridge.ts` whenever habits are toggled:

```typescript
import { syncWidgetData } from '@/utils/widgetDataBridge';

// After a habit toggle or data refresh:
await syncWidgetData(habits, completionMap);
```

Requires one of:
- `@bittingz/expo-widgets` (recommended)
- `react-native-shared-group-preferences`

## Deep Links

Tapping a habit in the widget opens `chainday://habit/{habitId}`. The app's existing deep link handler should route to the habit detail screen.

## Testing

1. Build with EAS: `eas build --platform ios --profile development`
2. Long-press Home Screen → Edit → Add Widget → search "ChainDay"
3. Use Xcode Previews for fast iteration on widget views

## Design Tokens

All colors match the ChainDay design system:
- Primary green: `#047857` (text), `#059669` (buttons/accents)
- Font: SF Pro with rounded numeric variant
- Typography: 34/22/17/13 scale
