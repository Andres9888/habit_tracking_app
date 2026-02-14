# Deep Linking — ChainDay

ChainDay supports deep links via a **custom URL scheme** (`habit-tracker://`) and **universal links** (`https://chainday.app/...`). These enable widgets, Siri shortcuts, referral campaigns, and marketing links to open specific screens in the app.

## URL Scheme

| Route | Custom Scheme | Universal Link | Action |
|-------|--------------|----------------|--------|
| Open habit detail | `habit-tracker://habit/:id` | `https://chainday.app/habit/:id` | Navigate to habit detail screen |
| Quick toggle | `habit-tracker://toggle/:id` | `https://chainday.app/toggle/:id` | Toggle today's completion for a habit |
| Settings | `habit-tracker://settings` | `https://chainday.app/settings` | Open settings modal |
| Premium | `habit-tracker://premium` | `https://chainday.app/premium` | Open premium/paywall screen |

### Parameters

- `:id` — The Convex document ID for a habit (e.g., `j57a8k3m2n...`)

## Integration Points

### Widgets (iOS)
```swift
// In your widget view
Link(destination: URL(string: "habit-tracker://toggle/\(habit.id)")!) {
    HabitRow(habit: habit)
}
```

### Siri Shortcuts
```swift
let activity = NSUserActivity(activityType: "com.chainday.app.openHabit")
activity.webpageURL = URL(string: "https://chainday.app/habit/\(habitId)")
activity.isEligibleForSearch = true
activity.isEligibleForPrediction = true
```

### Marketing / Referral Links
Use universal links for external sharing (email, social media, web):
```
https://chainday.app/premium
https://chainday.app/habit/abc123
```
These will open the app if installed, or fall back to the website.

## Architecture

### Hook: `useDeepLinks`
Located at `src/hooks/useDeepLinks.ts`. Subscribe to deep links by providing handler callbacks:

```typescript
import { useDeepLinks } from '../../hooks/useDeepLinks';

useDeepLinks({
  onOpenHabit: (habitId) => { /* open detail */ },
  onToggleHabit: (habitId) => { /* toggle completion */ },
  onOpenSettings: () => { /* open settings modal */ },
  onOpenPremium: () => { /* show paywall */ },
});
```

Handles both cold-start (`Linking.getInitialURL()`) and foreground (`Linking.addEventListener`).

### Parser: `parseDeepLink`
Pure function exported from the same module. Normalizes both custom-scheme and universal-link URLs into a structured `DeepLinkRoute`:

```typescript
import { parseDeepLink } from '../../hooks/useDeepLinks';

parseDeepLink('habit-tracker://habit/abc'); // { path: 'habit', habitId: 'abc', raw: '...' }
parseDeepLink('https://chainday.app/settings'); // { path: 'settings', raw: '...' }
```

## Platform Configuration

### iOS
- **Custom scheme**: Configured in `app.json` (`expo.scheme: "habit-tracker"`) and `Info.plist` (`CFBundleURLSchemes`)
- **Universal links**: Associated domains in `ChainDay.entitlements` and `app.json` (`ios.associatedDomains`)
- **AASA file**: `website/.well-known/apple-app-site-association` — must be served from `https://chainday.app/.well-known/apple-app-site-association` with `Content-Type: application/json`

### Android
- **Custom scheme**: Handled automatically by Expo via `app.json` scheme
- **App Links**: Intent filters in `app.json` (`android.intentFilters`)
- **Asset Links**: `website/.well-known/assetlinks.json` — must be served from `https://chainday.app/.well-known/assetlinks.json`

## Setup Checklist

- [x] Custom URL scheme configured (`habit-tracker://`)
- [x] Route parser with tests
- [x] `useDeepLinks` hook
- [x] iOS entitlements for associated domains
- [x] Android intent filters
- [x] AASA file for chainday.app
- [x] Android asset links file
- [ ] Replace `TEAM_ID` in AASA with actual Apple Team ID
- [ ] Replace SHA256 fingerprint in `assetlinks.json` with actual signing cert
- [ ] Deploy `.well-known` files to chainday.app hosting
- [ ] Wire `useDeepLinks` handlers to actual navigation/modal state
- [ ] Test with `xcrun simctl openurl booted "habit-tracker://habit/test123"`
- [ ] Test with `adb shell am start -a android.intent.action.VIEW -d "habit-tracker://habit/test123"`

## Testing

```bash
# iOS Simulator
xcrun simctl openurl booted "habit-tracker://habit/test123"
xcrun simctl openurl booted "habit-tracker://toggle/test123"
xcrun simctl openurl booted "habit-tracker://settings"
xcrun simctl openurl booted "habit-tracker://premium"

# Android Emulator
adb shell am start -a android.intent.action.VIEW -d "habit-tracker://habit/test123" com.chainday.app
adb shell am start -a android.intent.action.VIEW -d "habit-tracker://settings" com.chainday.app

# Unit tests
npx jest src/hooks/__tests__/useDeepLinks.test.ts
```
