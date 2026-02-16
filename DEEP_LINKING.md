# Deep Linking Guide

## Overview

ChainDay supports deep linking to allow users to share habits and open specific screens from notifications or external sources. This document explains how deep linking works in the app and how to use it.

## Supported Routes

### 1. Habit Detail Screen
Opens the detail screen for a specific habit.

**Format:**
```
chainday://habit/:habitId
```

**Example:**
```
chainday://habit/abc123xyz
```

**Usage in notifications:** Already implemented. When a user taps a habit reminder notification, the app opens the activation modal for that habit.

**Usage for sharing:** To share a habit with another user:
```javascript
import * as Linking from 'expo-linking';

const shareHabit = (habitId: string) => {
  const url = `chainday://habit/${habitId}`;
  // Share via native share sheet or copy to clipboard
  Linking.openURL(url);
};
```

### 2. Settings Screen
Opens the settings modal.

**Format:**
```
chainday://settings
```

**Example:**
```
chainday://settings
```

**Usage:**
```javascript
import * as Linking from 'expo-linking';

Linking.openURL('chainday://settings');
```

### 3. Analytics Screen (Coming Soon)
Opens the analytics dashboard.

**Format:**
```
chainday://analytics
```

**Example:**
```
chainday://analytics
```

**Note:** Analytics screen is not yet wired into the modal system. Deep link handler is in place but currently logs in dev mode only.

## Implementation Details

### Architecture

ChainDay uses a modal-based navigation system rather than React Navigation. Deep links are handled by:

1. **`useDeepLinking` hook** (`src/hooks/useDeepLinking.ts`)
   - Parses incoming URLs
   - Routes to appropriate handlers
   - Handles both app launch and background-to-foreground transitions

2. **URL Parsing**
   - Uses `expo-linking` to parse URLs
   - Extracts route type (habit/analytics/settings) and parameters
   - Validates habitId format

3. **Handler Integration**
   - Integrated into `HabitsApp` component
   - Uses existing modal state handlers (`openHabitDetail`, `openSettings`)
   - Finds habit by ID in the current habits list

### Configuration

The deep link scheme is configured in `app.json`:

```json
{
  "expo": {
    "scheme": "chainday"
  }
}
```

This allows URLs like `chainday://...` to open the app.

### Notification Integration

Habit reminder notifications automatically include deep linking data:

```javascript
// From src/utils/notifications/habitReminders.ts
{
  content: {
    title: "Time to build your habit!",
    body: "Don't break the chain!",
    data: { habitId: "abc123" }  // Used for deep linking
  }
}
```

When a user taps the notification:
1. `useNotificationResponse` hook catches the tap
2. Extracts `habitId` from notification data
3. Calls `onHabitNotificationTap(habitId)`
4. Opens the activation modal for that habit

This provides a seamless experience from notification → app → specific habit screen.

## Testing Deep Links

### iOS Simulator
```bash
xcrun simctl openurl booted "chainday://habit/abc123"
xcrun simctl openurl booted "chainday://settings"
xcrun simctl openurl booted "chainday://analytics"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "chainday://habit/abc123"
adb shell am start -W -a android.intent.action.VIEW -d "chainday://settings"
adb shell am start -W -a android.intent.action.VIEW -d "chainday://analytics"
```

### Physical Device
1. Create a test HTML file with links:
   ```html
   <a href="chainday://habit/abc123">Open Habit</a>
   <a href="chainday://settings">Open Settings</a>
   <a href="chainday://analytics">Open Analytics</a>
   ```
2. Host it locally or send via email/message
3. Tap the links to test

### From JavaScript/TypeScript
```javascript
import * as Linking from 'expo-linking';

// Test habit deep link
await Linking.openURL('chainday://habit/abc123');

// Test settings deep link
await Linking.openURL('chainday://settings');

// Test analytics deep link
await Linking.openURL('chainday://analytics');
```

## Adding New Routes

To add a new deep link route:

1. **Update `parseDeepLink` in `useDeepLinking.ts`**
   ```typescript
   // Add new route type
   type: 'habit' | 'analytics' | 'settings' | 'your-new-route'

   // Add parsing logic
   if (hostname === 'your-route' || path === 'your-route') {
     return { type: 'your-new-route', /* params */ };
   }
   ```

2. **Update `handleDeepLink` in `useDeepLinking.ts`**
   ```typescript
   case 'your-new-route':
     if (handlers.onOpenYourRoute) {
       handlers.onOpenYourRoute(/* params */);
     }
     break;
   ```

3. **Update `DeepLinkHandlers` interface**
   ```typescript
   export interface DeepLinkHandlers {
     // ... existing handlers
     onOpenYourRoute?: (params) => void;
   }
   ```

4. **Wire handler in `HabitsApp.tsx`**
   ```typescript
   useDeepLinking({
     // ... existing handlers
     onOpenYourRoute: useCallback(() => {
       // Implementation
     }, [deps]),
   });
   ```

5. **Update this documentation**

## Universal Links (Future Enhancement)

For a production app, you should also configure Universal Links (iOS) and App Links (Android) to allow `https://chainday.app/habit/123` to open the app instead of requiring a custom scheme.

### iOS Universal Links
- Add `apple-app-site-association` file to your domain
- Configure in `app.json`:
  ```json
  {
    "ios": {
      "associatedDomains": ["applinks:chainday.app"]
    }
  }
  ```

### Android App Links
- Add `assetlinks.json` file to your domain
- Configure in `app.json`:
  ```json
  {
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "autoVerify": true,
        "data": [{
          "scheme": "https",
          "host": "chainday.app"
        }]
      }]
    }
  }
  ```

## Error Handling

The deep linking system handles errors gracefully:

- **Unknown routes:** Silently ignored (logged in dev mode)
- **Invalid habitId:** Opens nothing if habit not found in list
- **Missing handlers:** No-op if handler not provided

This ensures the app doesn't crash from malformed deep links.

## Best Practices

1. **Always validate habitId:** Check if the habit exists before opening
2. **Use existing modal handlers:** Don't create new navigation paths
3. **Test all routes:** Use the testing commands above
4. **Update docs:** Keep this file current when adding routes
5. **Consider permissions:** Some screens may require premium access
6. **Handle auth state:** Deep links only work after user is authenticated

## Troubleshooting

### Deep link doesn't open the app
- Check that the scheme matches `app.json`
- Verify the app is installed
- On iOS, check Settings → ChainDay → "Open with..."

### Deep link opens app but doesn't navigate
- Check console logs in dev mode
- Verify the habitId exists in the user's habits
- Ensure handlers are properly wired in `HabitsApp`

### Notification tap doesn't open habit
- Check notification data includes `habitId`
- Verify `useNotificationResponse` is mounted
- Check that the habit hasn't been deleted

## Future Enhancements

1. **Analytics Deep Link:** Wire AnalyticsScreen into modal system
2. **Universal Links:** Support `https://chainday.app/...` URLs
3. **Onboarding Deep Links:** Allow linking to specific onboarding steps
4. **Template Deep Links:** Share habit templates via deep links
5. **Challenge Deep Links:** Link to specific challenges or achievements
6. **Social Sharing:** Generate rich preview links with Open Graph tags

---

**Created by:** Sonnet
**Last Updated:** 2026-02-16
