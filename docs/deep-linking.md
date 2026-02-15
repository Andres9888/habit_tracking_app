# Deep Linking Guide - Chain Day

## Overview

Chain Day supports deep linking via the `habit-tracker://` URL scheme. This allows you to open specific screens directly from:

- Push notifications
- Email campaigns
- Marketing materials
- Share links
- External apps

## URL Scheme

**Scheme**: `habit-tracker://`

## Supported Routes

### 1. Open Habit Detail

Opens the detail screen for a specific habit.

**Format**: `habit-tracker://habit/{habitId}`

**Example**:
```
habit-tracker://habit/kg2ar5xj8h7p9q6r5s4t3u2v1w0x
```

**Use Cases**:
- Push notification: "You haven't logged your meditation today!"
- Email: "Check your 30-day streak progress"
- Share link: "Look at my habit progress"

---

### 2. Create New Habit

Opens the create habit modal.

**Format**: `habit-tracker://create`

**Example**:
```
habit-tracker://create
```

**Use Cases**:
- Onboarding flow: "Add your first habit"
- Quick action widget
- External integrations

---

### 3. Open Settings

Opens the settings screen.

**Format**: `habit-tracker://settings`

**Example**:
```
habit-tracker://settings
```

**Use Cases**:
- Customer support: "Update your notification preferences"
- Account management flows

---

### 4. Browse Templates

Opens the templates browser.

**Format**: `habit-tracker://templates`

**Example**:
```
habit-tracker://templates
```

**Use Cases**:
- Marketing: "Discover scientifically-backed habits"
- Onboarding: "Start with a proven template"

---

## Testing Deep Links

### iOS Simulator

```bash
xcrun simctl openurl booted "habit-tracker://habit/YOUR_HABIT_ID"
xcrun simctl openurl booted "habit-tracker://create"
xcrun simctl openurl booted "habit-tracker://settings"
xcrun simctl openurl booted "habit-tracker://templates"
```

### Android Emulator

```bash
adb shell am start -W -a android.intent.action.VIEW -d "habit-tracker://habit/YOUR_HABIT_ID" com.chainday.app
adb shell am start -W -a android.intent.action.VIEW -d "habit-tracker://create" com.chainday.app
adb shell am start -W -a android.intent.action.VIEW -d "habit-tracker://settings" com.chainday.app
adb shell am start -W -a android.intent.action.VIEW -d "habit-tracker://templates" com.chainday.app
```

### Physical Device

Use a browser or Notes app to create a clickable link:
```html
<a href="habit-tracker://habit/YOUR_HABIT_ID">Open Habit</a>
```

Or send yourself an email/message with the deep link.

---

## Implementation Details

### useDeepLinking Hook

Located at: `src/hooks/useDeepLinking.ts`

**Usage**:
```tsx
useDeepLinking({
  onOpenHabit: (habitId) => {
    const habit = habits.find(h => h._id === habitId);
    if (habit) openHabitDetail(habit);
  },
  onOpenCreate: openCreateHabitScreen,
  onOpenSettings: openSettings,
  onOpenTemplates: openTemplatesScreen,
});
```

**Features**:
- Handles initial URL (app opened from link)
- Listens for URLs while app is running
- Parses routes and extracts parameters
- Calls appropriate handler for each route

### Integration Point

The hook is integrated in `src/features/habits/hooks/useHabitsApp.ts`:

```tsx
const handleOpenHabit = useCallback(
  (habitId: Id<'habits'>) => {
    const habit = list.habits.find((h) => h._id === habitId);
    if (habit) {
      modals.openHabitDetail(habit);
    }
  },
  [list.habits, modals]
);

useDeepLinking({
  onOpenHabit: handleOpenHabit,
  onOpenCreate: modals.openCreateHabitScreen,
  onOpenSettings: modals.openSettings,
  onOpenTemplates: modals.openTemplatesScreen,
});
```

---

## Future Enhancements

### Analytics Deep Link
`habit-tracker://analytics/{habitId}` - View detailed analytics for a habit

### Calendar Deep Link
`habit-tracker://calendar` - Open full calendar view

### Share Deep Link with Params
`habit-tracker://habit/{habitId}?tab=progress` - Open specific tab in habit detail

### Universal Links (HTTPS)
Support `https://chainday.app/habit/{habitId}` for better sharing and SEO.

---

## Troubleshooting

### Link Not Opening App

**iOS**:
- Check `app.json` has `"scheme": "habit-tracker"`
- Rebuild app after changing URL scheme
- Check Info.plist includes URL scheme

**Android**:
- Check `app.json` has `"scheme": "habit-tracker"`
- Verify intent filter in AndroidManifest.xml
- Rebuild app

### Invalid Habit ID

The app silently ignores invalid habit IDs (habit not found). Consider adding error feedback in the future:

```tsx
const handleOpenHabit = useCallback(
  (habitId: Id<'habits'>) => {
    const habit = list.habits.find((h) => h._id === habitId);
    if (habit) {
      modals.openHabitDetail(habit);
    } else if (__DEV__) {
      console.warn('Habit not found:', habitId);
    }
  },
  [list.habits, modals]
);
```

---

## Security Considerations

1. **Validate habit IDs**: Only open habits that belong to the authenticated user
2. **Auth check**: Deep links should respect authentication state (currently handled by AuthGate)
3. **Rate limiting**: Consider rate limiting deep link handling to prevent abuse
4. **Sanitize inputs**: Expo Linking already sanitizes URLs, but be cautious with future query params

---

## Related Files

- `src/hooks/useDeepLinking.ts` - Deep linking hook
- `src/features/habits/hooks/useHabitsApp.ts` - Integration point
- `app.json` - URL scheme configuration
- `docs/NAVIGATION_AUDIT.md` - Navigation architecture overview
