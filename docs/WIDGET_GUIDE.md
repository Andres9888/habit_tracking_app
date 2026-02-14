# ChainDay iOS Widget - Implementation Guide

## Overview

The ChainDay widget provides two sizes for the iOS home screen:

- **Small**: A progress ring showing "X of Y" habits completed today
- **Medium**: Progress ring + scrollable list of individual habits with tap-to-complete via deep links

Both widgets use **WidgetKit** (iOS 17+) with **SwiftUI** and read data from a shared App Group (`group.com.chainday.app`).

## Architecture

```
┌─────────────────────┐     UserDefaults      ┌──────────────────────┐
│   React Native App  │ ──(App Group JSON)──▶  │  WidgetKit Extension │
│                     │                        │                      │
│  syncWidgetData()   │                        │  HabitTimelineEntry  │
│  (widgetBridge.ts)  │                        │  SmallWidgetView     │
│                     │                        │  MediumWidgetView    │
└─────────────────────┘                        └──────────────────────┘
         │                                              │
         │  Deep Link (habit-tracker://toggle/:id)      │
         ◀──────────────────────────────────────────────┘
```

## Files Created

| File | Purpose |
|------|---------|
| `ios/ChainDayWidget/ChainDayWidget.swift` | Full widget implementation (SwiftUI + WidgetKit) |
| `ios/ChainDayWidget/Info.plist` | Widget extension metadata |
| `ios/ChainDayWidget/ChainDayWidget.entitlements` | App Group entitlement |
| `ios/ChainDayWidget/Assets.xcassets/` | Widget color assets |
| `src/utils/widgetBridge.ts` | React Native → Widget data sync |
| `plugins/withChainDayWidget.js` | Expo config plugin for entitlements |

## Setup Instructions

### Step 1: Install Dependencies

```bash
# For App Group shared storage
npx expo install react-native-shared-group-preferences

# Or alternatively
npm install react-native-shared-group-preferences
```

### Step 2: Register the Expo Plugin

Add to `app.json` plugins array:

```json
{
  "plugins": [
    "./plugins/withChainDayWidget"
  ]
}
```

### Step 3: Prebuild and Add Widget Target in Xcode

```bash
npx expo prebuild --clean
open ios/ChainDay.xcworkspace
```

In Xcode:

1. **File → New → Target → Widget Extension**
2. Name: `ChainDayWidget`
3. Bundle ID: `com.chainday.app.widget`
4. Language: Swift
5. **Uncheck** "Include Configuration App Intent" (we use static config)
6. Click **Finish**

Then replace the auto-generated files:

1. **Delete** the auto-generated Swift files in the new target
2. **Add** `ios/ChainDayWidget/ChainDayWidget.swift` to the widget target
3. **Add** `ios/ChainDayWidget/Assets.xcassets` to the widget target

### Step 4: Configure App Group

In Xcode, for **both** the main `ChainDay` target and `ChainDayWidget` target:

1. Select target → **Signing & Capabilities**
2. Click **+ Capability** → **App Groups**
3. Add: `group.com.chainday.app`

Also ensure the widget target uses `ChainDayWidget.entitlements`.

### Step 5: Configure Signing

For the `ChainDayWidget` target:
- Team: Same as main app
- Bundle Identifier: `com.chainday.app.widget`
- Deployment Target: iOS 17.0

### Step 6: Integrate Widget Bridge in React Native

In your main habits screen or data provider, call `syncWidgetData` whenever habit data changes:

```typescript
import { syncWidgetData } from '../utils/widgetBridge';

// After fetching habits and tracking data:
useEffect(() => {
  if (habits && tracking) {
    syncWidgetData(habits, tracking);
  }
}, [habits, tracking]);
```

### Step 7: Handle Deep Links (Tap-to-Complete)

The medium widget generates `habit-tracker://toggle/:habitId` links. The app already uses `habit-tracker` as its URL scheme (configured in `app.json`). Add handling in your navigation/linking config:

```typescript
// In your linking configuration
const linking = {
  prefixes: ['habit-tracker://'],
  config: {
    screens: {
      // ... existing screens
    },
  },
  // Handle widget deep links
  subscribe(listener) {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const match = url.match(/^habit-tracker:\/\/toggle\/(.+)$/);
      if (match) {
        const habitId = match[1];
        // Toggle the habit and re-sync widget
        toggleHabit({ habitId, date: todayString() });
      }
      listener(url);
    });
    return () => subscription.remove();
  },
};
```

## Testing

### In Xcode
1. Select the `ChainDayWidget` scheme
2. Run on simulator
3. Long-press home screen → tap **+** → search "ChainDay"
4. Add small or medium widget

### Preview
The Swift file includes SwiftUI previews with placeholder data. Use Xcode Canvas (⌥⌘↩) to see them live.

### Debug Data Flow
1. Run the main app first to populate UserDefaults
2. Add widget to home screen
3. Check Console.app for `[WidgetBridge]` logs

## Design Specs

Follows the ChainDay design system:
- **Primary green**: `#059669` (buttons/ring), `#047857` (text)
- **Font**: SF Pro Rounded (system rounded design)
- **Sizes**: 34/22/17/13pt hierarchy
- **Border radius**: Native widget rounding
- **Background**: Light `#F7FAF8`, Dark `#1C1C1E`

## EAS Build Notes

For EAS Build, the widget target must be included in the Xcode project before building. Ensure:

1. The `ios/` folder is committed with the widget target configured
2. `eas.json` build profiles don't exclude the widget extension
3. Provisioning profiles cover both `com.chainday.app` and `com.chainday.app.widget`

In Apple Developer Portal, create a separate App ID for the widget extension with the same App Group.
