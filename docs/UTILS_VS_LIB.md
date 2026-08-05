# Utils vs Lib: Code Organization Guide

This document explains the distinction between the `src/utils/` and `src/lib/` directories to help maintain consistent code organization.

## Overview

| Aspect | `src/utils/` | `src/lib/` |
|--------|-------------|------------|
| Purpose | Business logic helpers | Infrastructure services |
| Dependencies | Minimal, pure functions | External services, SDKs |
| Reusability | App-specific | Platform/infrastructure |
| State | Stateless | May manage state/connections |

## `src/utils/` - Business Logic Helpers

**Purpose:** Pure and near-pure functions that provide specific business logic functionality. These are the "building blocks" of the application's domain logic.

**Characteristics:**
- No side effects (or minimal, well-documented ones)
- Highly reusable within the app
- Focus on specific tasks (date formatting, validation, calculations)
- Generally small, focused functions
- No external service dependencies

**Examples:**
- `dateUtils.ts` - Date formatting and calculations
- `streak.ts` - Streak computation logic
- `validation.ts` - Input validation helpers
- `habitCalculations.ts` - Habit statistics calculations
- `errorAlerts.ts` - User-facing error messages

**When to add to utils:**
- The function performs a specific, well-defined task
- It can be tested in isolation
- It's used in multiple places across the app
- It doesn't require external service connections

## `src/lib/` - Infrastructure Services

**Purpose:** Integration layer with external services, SDKs, and platform-specific functionality. These are the "connectors" that tie the app to external systems.

**Characteristics:**
- May manage connections/state to external services
- Handle platform-specific code (React Native, Expo)
- Configure and initialize SDKs
- Abstract complex external interactions
- May have side effects

**Examples:**
- `appConfig.ts` - Convex client, Clerk auth, secure storage
- `purchases.ts` - RevenueCat integration
- `sentry/` - Error tracking and monitoring
- `offline/` - Offline support and sync
- `analytics/` - Analytics integration
- `utils.ts` - Shared utilities (className merging)

**When to add to lib:**
- The code initializes or configures an external service
- It requires platform-specific APIs
- It manages connection state
- It's infrastructure rather than business logic

## Key Distinctions

### Example: Date Handling

**In utils (`dateUtils.ts`):**
```typescript
// Pure function for date calculations
export function differenceInDays(date1: Date, date2: Date): number {
  // Just math, no side effects
}
```

**Not in lib:**
- The function doesn't connect to any service
- It's pure business logic

### Example: Offline Support

**In lib (`offline/`):**
```typescript
// Manages connection state and sync
export function executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  // Manages retry logic, circuit breaker state
}
```

**Why in lib:**
- Needs to track connection state
- Manages external service interactions
- Contains infrastructure logic

## Common Patterns

### Re-exports for Backward Compatibility

Utils often decompose into subdirectories while maintaining backward-compatible re-exports:

```typescript
// src/utils/validation.ts - Re-exports from subdirectory
export { validateEmail } from './validation/emailValidation';
export { validateHabitName } from './validation/textValidation';
```

### Module Documentation

Each major module should include JSDoc at the top explaining:
- What the module provides
- Key use cases
- Related modules
- Category for documentation generation

```typescript
/**
 * Date Utilities for Client-Side Calculations
 *
 * Provides consistent date handling that matches backend.
 * All functions use UTC to avoid timezone issues.
 *
 * @module dateUtils
 * @category Date Handling
 */
```

## Guidelines for Adding New Code

1. **Ask:** Does this require external service connections?
   - Yes → Consider `lib/`
   - No → Consider `utils/`

2. **Ask:** Is this pure business logic?
   - Yes → `utils/`
   - No → `lib/`

3. **Ask:** Is this used in many places as a building block?
   - Yes → `utils/`

4. **Ask:** Does this configure or initialize an SDK?
   - Yes → `lib/`

## Migration Notes

If you find code in the wrong location:

- **Utils that should be in lib:** If it manages connections or external service state
- **Lib that should be in utils:** If it's become purely functional and stateless

When migrating:
1. Update imports across the codebase
2. Add deprecation notice to old location
3. Update this documentation
