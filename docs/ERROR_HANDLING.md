# Error Handling & Error States Guide

## Overview

Chain Day implements a comprehensive error handling system with three layers:
1. **Global Error Boundaries** - Catch catastrophic errors
2. **Screen Error Boundaries** - Isolate screen-level failures
3. **Inline Error States** - Handle query/mutation failures gracefully

## Components

### 1. Global Error Boundaries

#### Web (`main.tsx`)
- Catches all unhandled errors in the web app
- Shows retry button + reload button
- Full dark mode support
- Displays error details in dev mode

#### Native (`App.tsx`)
- Uses `SentryErrorBoundary` for crash reporting
- Wraps entire app tree
- Reports to Sentry for monitoring

### 2. Screen Error Boundaries

**Location:** `src/components/ErrorBoundary/ScreenErrorBoundary.tsx`

Wrap individual screens to prevent one screen crash from killing the app:

```tsx
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

export function MyScreen(props) {
  return (
    <ScreenErrorBoundary screenName="My Screen" onGoBack={navigation.goBack}>
      <MyScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
```

**Features:**
- Retry button (resets error state)
- Optional "Go Back" navigation
- Dark mode support
- Shows error details in dev mode
- Maintains user data safety

**Currently wrapped screens:**
- ✅ HabitDetailScreen
- ✅ HabitEditScreen
- ✅ AnalyticsScreen
- ✅ CharacterScreen
- ✅ TemplatesScreen
- ✅ OnboardingScreen
- ✅ Auth screens (SignIn, SignUp, Welcome)

### 3. Inline Error States

**Location:** `src/components/ErrorStates/QueryErrorState.tsx`

For non-critical errors like failed data fetches:

```tsx
import { QueryErrorState } from '../../components/ErrorStates';

function MyComponent() {
  const { data, error, refetch } = useQuery(...);
  
  if (error) {
    return (
      <QueryErrorState
        error={error}
        message="Failed to load habits"
        onRetry={refetch}
      />
    );
  }
  
  return <DataView data={data} />;
}
```

**Props:**
- `error` - Error object or string
- `message` - User-friendly message (default: "Failed to load data")
- `onRetry` - Optional retry callback
- `compact` - Smaller variant for tight spaces

**Features:**
- Dark mode support
- Animated entrance
- Shows dev error details
- Consistent styling with design system

### 4. Network Error Banner

**Location:** `src/components/NetworkErrorBanner/NetworkErrorBanner.tsx`

Global banner that appears when device goes offline:

```tsx
// Already included in App.tsx
<NetworkErrorBanner />
```

**Features:**
- Slides down from top when offline
- Slides up when back online
- Retry button
- Dark mode support
- Non-intrusive design
- Respects safe area insets

## Dark Mode Support

All error components support dark mode:
- Uses `useThemeColors` hook
- Checks `isDark` flag
- Adjusts backgrounds, text, and shadows
- Maintains accessibility contrast ratios

## Design System Compliance

All error states follow the design system:
- Typography: 22pt titles, 17pt body, 13pt captions
- Border radius: 16px cards, 12px buttons
- Shadows: 4px offset, 16px blur, proper opacity
- Colors: Primary green (#047857), error red
- Animations: Spring with damping(18)

## Best Practices

### When to use what:

1. **ScreenErrorBoundary** - Wrap entire screens
   - Prevents app crash from screen-level errors
   - Use for all top-level screen components

2. **QueryErrorState** - For data loading failures
   - Network requests fail
   - API returns error
   - Query hook errors

3. **Global ErrorBoundary** - Already in place
   - Last resort for uncaught errors
   - Don't add more - already at app root

### Retry Strategy

1. **Optimistic retry** - Let user retry immediately
2. **Error details in dev** - Help developers debug
3. **User-friendly messages** - Never show raw error text in production
4. **Multiple retry options:**
   - Soft retry (reset error state)
   - Hard retry (reload page/app)

### Error Messages

❌ **Bad:**
- "An error occurred"
- "Error 500"
- Stack traces in production

✅ **Good:**
- "Failed to load habits"
- "Couldn't save changes"
- "Network connection lost"

Always include:
- What failed
- That data is safe
- How to recover (retry/reload)

## Testing Error States

### Manual Testing

1. **Network errors:**
   - Turn off WiFi/data
   - Verify NetworkErrorBanner appears
   - Turn on network
   - Verify banner disappears

2. **Component errors:**
   - Inject error in component
   - Verify ScreenErrorBoundary catches it
   - Click retry
   - Verify component recovers

3. **Dark mode:**
   - Toggle dark mode
   - Check all error states render correctly
   - Verify contrast ratios

### Error Injection (Dev)

```tsx
// Throw error to test boundary
if (__DEV__ && shouldTestError) {
  throw new Error('Test error boundary');
}
```

## Migration Checklist

When adding error handling to a new screen:

- [ ] Wrap screen in ScreenErrorBoundary
- [ ] Add onGoBack handler if applicable
- [ ] Use QueryErrorState for data fetch errors
- [ ] Test retry functionality
- [ ] Test in dark mode
- [ ] Verify error messages are user-friendly
- [ ] Check design system compliance

## Future Improvements

- [ ] Add error telemetry (track retry rates)
- [ ] Offline queue for mutations
- [ ] Background sync recovery
- [ ] Smart retry delays (exponential backoff)
- [ ] Error categorization (network vs logic vs data)
