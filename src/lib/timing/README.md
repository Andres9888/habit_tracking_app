# Timing Constants Module

This module provides centralized, named constants for all timing values in the application including animations, delays, and timeouts.

## Why Centralized Timing?

- **Single Source of Truth**: All timing values in one place makes it easier to understand and adjust timing globally
- **Consistency**: Ensures consistent timing patterns across the app
- **Maintainability**: Changes to timing are easier to track and implement
- **Performance**: Makes it easier to audit and optimize animation performance
- **Testing**: Simplifies test setup and manipulation of timing behavior

## Usage

### Import Constants

```typescript
import { ANIMATION_DURATIONS, DELAYS, TIMEOUTS } from '@/lib/timing';

// Use in animations
const animationConfig = { duration: ANIMATION_DURATIONS.STANDARD };

// Use in setTimeout
setTimeout(() => doSomething(), DELAYS.SHORT);

// Use in API calls
fetch(url, { signal: AbortSignal.timeout(TIMEOUTS.API_REQUEST) });
```

## Constants Overview

### ANIMATION_DURATIONS
Durations for UI animations in milliseconds. Grouped by animation type:
- Quick animations: QUICK (150ms), FORM_INTERACTION (200ms)
- Standard animations: STANDARD (280ms), MEDIUM (300ms)
- Complex animations: CELEBRATION, SUCCESS_ENTER, HERO (2000ms)
- Specific effects: PULSE_STANDARD (600ms), SPINNER_ROTATE (1000ms)

### STAGGER_DELAYS
Delays between sequential animations. Used in lists, grids, and multi-element sequences:
- BASE: 60ms
- MEDIUM: 100ms
- LARGE: 120ms
- Component-specific variations available

### DELAYS
Fixed delay values for UI interactions:
- SHORT: 100ms
- MEDIUM: 200ms
- LONG: 300ms
- Component-specific delays (AUTH_LOGO: 50ms, etc.)

### TIMEOUTS
Timeout values for async operations:
- API_REQUEST: 30 seconds
- CIRCUIT_BREAKER_RESET: 30 seconds
- PURCHASES_INIT: 500ms
- OFFLINE_QUEUE_PROCESS: 1000ms

### CONFETTI_DURATIONS
Specific durations for confetti and celebration effects:
- HERO: 3000ms
- STANDARD: 2000ms
- BURST: 2500ms

### VOICE_NOTE_DURATIONS
Voice recording constraints:
- MAX_DURATION: 120,000ms (2 minutes)

## Migration Guide

### Before (Hardcoded)
```typescript
setTimeout(() => setMounted(true), 100);
withTiming(1, { duration: 280 });
const timer = setTimeout(() => inputRef.current?.focus(), 100);
```

### After (Using Constants)
```typescript
import { DELAYS, ANIMATION_DURATIONS } from '@/lib/timing';

setTimeout(() => setMounted(true), DELAYS.SHORT);
withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD });
const timer = setTimeout(() => inputRef.current?.focus(), DELAYS.SHORT);
```

## Adding New Constants

When adding new timing values:

1. **Check if a similar value exists** - Consider reusing existing constants
2. **Group logically** - Place in the appropriate section
3. **Add documentation** - Include comments explaining the use case
4. **Consider variations** - Common variations (QUICK, MEDIUM, LONG) should follow patterns
5. **Update types** - TypeScript types are automatically derived from config

Example:
```typescript
export const ANIMATION_DURATIONS = {
  // ... existing values
  NEW_FEATURE_ENTRANCE: 350, // Documented purpose
} as const;
```

## Performance Considerations

- Total animation duration should typically not exceed 3000ms for standard flows
- Use shorter durations (150-300ms) for quick feedback animations
- Stagger delays should be 60-120ms for imperceptible sequencing
- Respect `prefers-reduced-motion` by using conditional timing when needed

## Testing with Timing Constants

When testing, you can mock or override timing:

```typescript
vi.mock('@/lib/timing', () => ({
  ANIMATION_DURATIONS: {
    STANDARD: 0, // Instant for tests
    // ... other values
  },
}));
```

Or use the actual values with appropriate test timeouts:

```typescript
it('shows animation', async () => {
  render(<Component />);
  await act(async () => {
    await new Promise(r => setTimeout(r, ANIMATION_DURATIONS.STANDARD));
  });
  expect(element).toBeVisible();
});
```
