# App Shortcuts & Quick Actions

This document describes the implementation of iOS Quick Actions (3D Touch / Haptic Touch) and Siri Shortcuts integration for ChainDay.

## Overview

ChainDay supports multiple ways for users to quickly access common actions:

1. **iOS Quick Actions** - Home screen icon long-press shortcuts
2. **Siri Shortcuts** - Voice and automation integration (planned)
3. **Android Quick Actions** - Similar functionality for Android (future)

## iOS Quick Actions

### Implementation

Quick Actions are configured in `app.json` and handled via the `useQuickActions` hook.

### Available Actions

| Action | Title | Description | Icon |
|--------|-------|-------------|------|
| `complete-top-habit` | Complete Top Habit | Mark your highest priority habit as done | checkmark.circle.fill |
| `add-habit` | Add New Habit | Create a new habit to track | plus.circle.fill |
| `view-streaks` | View Streaks | See your current streaks | flame.fill |

### Configuration

Quick Actions are defined in `app.json`:

```json
{
  "ios": {
    "shortcuts": [
      {
        "title": "Complete Top Habit",
        "subtitle": "Mark your highest priority habit as done",
        "icon": "checkmark.circle.fill",
        "type": "complete-top-habit"
      }
    ]
  }
}
```

### Usage

The `useQuickActions` hook is integrated into the main App component:

```tsx
import { useQuickActions } from '@/hooks/useQuickActions';

export function App() {
  useQuickActions(); // Set up quick actions
  return <YourApp />;
}
```

### Navigation Flow

- **Complete Top Habit**: Navigates to home tab → (Future: Auto-completes top habit)
- **Add New Habit**: Navigates to `/create-habit` screen
- **View Streaks**: Navigates to stats tab `/(tabs)/stats`

## Siri Shortcuts Integration (Planned)

### Phase 1: NSUserActivity

Expose app activities that users can add to Siri Shortcuts:

```typescript
// Example: Expose "Complete Habit" activity
NSUserActivity.createActivity('com.chainday.complete-habit', {
  title: 'Complete Habit',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
});
```

### Phase 2: Intents Extension

Create custom Intents for more advanced shortcuts:

1. **Complete Habit Intent**
   - Parameters: Habit name (optional)
   - Returns: Success/failure status
   
2. **View Stats Intent**
   - Parameters: Time period (week/month/year)
   - Returns: Streak info, completion rate

3. **Add Habit Intent**
   - Parameters: Habit name, frequency, time
   - Returns: Created habit confirmation

### Phase 3: Shortcuts App Integration

- Create pre-built shortcuts for common workflows
- Share via Shortcuts gallery (if approved by Apple)
- Examples:
  - "Morning Routine" - Complete multiple habits
  - "Weekly Review" - View stats + export
  - "Motivation Boost" - Show longest streak

## Technical Details

### Dependencies

- **expo-quick-actions**: ^8.0.0+ (iOS 9+ support)
- **expo-router**: Navigation handling
- Future: `expo-intent-launcher` for Android equivalents

### File Structure

```
src/
├── hooks/
│   └── useQuickActions.ts    # Quick actions hook
├── utils/
│   └── shortcuts.ts          # (Future) Siri Shortcuts utilities
└── App.tsx                   # Integration point
```

### Platform Support

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Quick Actions | ✅ Yes | 🚧 Planned | ❌ N/A |
| Siri Shortcuts | 🚧 Planned | ❌ N/A | ❌ N/A |
| Google Assistant | ❌ N/A | 🚧 Planned | ❌ N/A |

## Testing

### Manual Testing

1. **Quick Actions (iOS)**
   - Build app in development mode
   - Long-press app icon on home screen
   - Verify 3 shortcuts appear
   - Tap each shortcut, verify navigation

2. **Production Build**
   ```bash
   eas build --platform ios --profile production
   ```

### Automated Testing

Quick action handling is tested via integration tests:

```typescript
// __tests__/shortcuts/quick-actions.test.ts
describe('Quick Actions', () => {
  it('navigates to correct screen on complete-top-habit', () => {
    // Test navigation logic
  });
});
```

## Future Enhancements

### Short Term
- [ ] Auto-complete top habit from quick action
- [ ] Dynamic quick action badges (show streak count)
- [ ] Quick action analytics

### Medium Term
- [ ] Siri Shortcuts (NSUserActivity)
- [ ] Android App Shortcuts
- [ ] Widget integration

### Long Term
- [ ] Custom Intents Extension
- [ ] Shortcuts gallery submission
- [ ] Voice-only habit completion
- [ ] Lock screen widgets (iOS 16+)

## Design Considerations

### Icons

Using SF Symbols for iOS ensures:
- Consistent with system UI
- Automatic light/dark mode support
- Locale-aware (RTL languages)

### Copy

- **Titles**: Action-oriented, < 20 characters
- **Subtitles**: Descriptive, < 40 characters
- Avoid jargon, use plain language

### Performance

- Quick actions are set up on app launch (< 100ms)
- Navigation is immediate (no loading states)
- Graceful degradation if feature unavailable

## Analytics

Track quick action usage:

```typescript
analytics.track('quick_action_used', {
  action_type: 'complete-top-habit',
  platform: 'ios',
});
```

## Troubleshooting

### Quick actions not appearing
1. Check `app.json` configuration is valid
2. Rebuild native app (quick actions require native rebuild)
3. Verify iOS version (9.0+)

### Navigation not working
1. Check route names match app navigation structure
2. Verify `expo-router` is configured correctly
3. Check console for error messages

## References

- [Expo Quick Actions Docs](https://docs.expo.dev/versions/latest/sdk/quick-actions/)
- [Apple HIG - Home Screen Actions](https://developer.apple.com/design/human-interface-guidelines/home-screen-actions)
- [iOS Shortcuts User Guide](https://support.apple.com/guide/shortcuts/welcome/ios)

---

**Created by:** Sonnet  
**Last Updated:** Feb 16, 2025  
**Status:** ✅ Implemented (Quick Actions) | 🚧 Planned (Siri Shortcuts)
