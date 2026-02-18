# Timing Constants Module

Centralized timing configuration for animations, delays, and timeouts.

## Overview

This module provides a single source of truth for all timing values used throughout the application:
- **ANIMATION_DURATIONS**: UI animation lengths (ms)
- **STAGGER_DELAYS**: Sequential animation delays
- **DELAYS**: Fixed interaction delays
- **TIMEOUTS**: Async operation timeouts
- **CONFETTI_DURATIONS**: Celebration effect durations
- **VOICE_NOTE_DURATIONS**: Voice recording constraints

## Usage

```typescript
import { ANIMATION_DURATIONS, DELAYS, TIMEOUTS } from '@/lib/timing';

// In animations
withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD });

// In timeouts
setTimeout(() => doSomething(), DELAYS.SHORT);

// In async calls
await fetch(url, { signal: AbortSignal.timeout(TIMEOUTS.API_REQUEST) });
```

## Migration from Hardcoded Values

Replace hardcoded timing values with named constants:

**Before:**
```typescript
setTimeout(() => setMounted(true), 100);
withTiming(1, { duration: 280 });
```

**After:**
```typescript
import { DELAYS, ANIMATION_DURATIONS } from '@/lib/timing';
setTimeout(() => setMounted(true), DELAYS.SHORT);
withTiming(1, { duration: ANIMATION_DURATIONS.STANDARD });
```

## Benefits

- ✅ Single source of truth for timing
- ✅ Easy global timing adjustments
- ✅ Better code readability
- ✅ Consistent patterns across app
- ✅ Simpler testing and mocking
- ✅ Performance audit friendly
