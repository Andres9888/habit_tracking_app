# Siri Shortcuts Integration

## Overview

ChainDay supports Siri Shortcuts for zero-friction habit logging. Users can say
**"Hey Siri, I did my workout"** to instantly log a habit completion.

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────┐
│  Siri / Spotlight │────▶│  NSUserActivity       │────▶│  App Delegate  │
│  "I did my..."   │     │  com.chainday.app...  │     │  → JS callback │
└─────────────────┘     └──────────────────────┘     └───────────────┘
                                                            │
                              ┌──────────────────────┐      ▼
                              │  SiriShortcutService  │◀── useSiriShortcuts
                              │  donate / suggest     │    hook
                              └──────────────────────┘
```

### Components

| File | Purpose |
|------|---------|
| `src/services/siri/SiriShortcutService.ts` | Core service: donate, suggest, listen |
| `src/services/siri/useSiriShortcuts.ts` | React hook for habit list integration |
| `src/components/SiriShortcut/AddToSiriButton.tsx` | UI button on habit detail screen |
| `plugins/withSiriShortcuts.js` | Expo config plugin for native setup |

## How It Works

### 1. Donating Shortcuts (Learning)

Every time a user completes a habit, we **donate** that interaction to Siri:

```ts
import { donateShortcut } from '@/services/siri';
donateShortcut(habit._id, habit.name, habit.icon);
```

Siri uses donation frequency to suggest shortcuts on the lock screen and in
Spotlight.

### 2. Suggesting Shortcuts (Bulk)

On app launch, we suggest all active habits:

```ts
const { donateCompletion } = useSiriShortcuts({
  habits: activeHabits,
  onSiriComplete: (habitId) => completeHabit(habitId),
});
```

### 3. "Add to Siri" Button

The habit detail screen shows an "Add to Siri" button that opens the native
iOS voice shortcut configuration sheet, letting users record a custom phrase.

### 4. Handling Invocations

When Siri triggers a shortcut, the app receives the `NSUserActivity` with
`userInfo` containing `{ habitId, habitName }`. The `useSiriShortcuts` hook
listens for these events and calls the `onSiriComplete` callback.

## Setup

### Dependencies

```bash
npm install react-native-siri-shortcut
npx pod-install  # or: cd ios && pod install
```

### Expo Config Plugin

The `./plugins/withSiriShortcuts` plugin is registered in `app.json` and
automatically:

- Adds `NSUserActivityTypes` to `Info.plist`
- Adds `com.apple.developer.siri` entitlement
- No manual Xcode configuration needed

### Apple Developer Portal

Ensure the **Siri** capability is enabled for your App ID in the
[Apple Developer Portal](https://developer.apple.com/account/resources/identifiers).

## Testing

1. Build with `npx expo run:ios`
2. Complete a habit → check Siri Suggestions in Spotlight
3. Tap "Add to Siri" on habit detail → record a phrase
4. Test with "Hey Siri, [your phrase]"

> **Note:** Siri Shortcuts require a physical device. The Simulator supports
> the "Add to Siri" UI but cannot test voice invocation.
