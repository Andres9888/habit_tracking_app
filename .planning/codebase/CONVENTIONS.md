# Coding Conventions

**Analysis Date:** 2025-03-19

## Naming Patterns

**Files:**
- React/React Native Components: `PascalCase.tsx` (e.g., `HabitCard.tsx`, `PackConfirmSheet.tsx`)
- Hooks: `camelCase.ts` (e.g., `useNetworkSync.ts`, `useHabitCard.ts`, `useOptimisticToggleMutation.ts`)
- Types/Interfaces: `*.types.ts` (e.g., `HabitCard.types.ts`, `useNetworkSync.types.ts`)
- Utilities/Helpers: `camelCase.ts` (e.g., `utils.ts`, `helpers.ts`)
- Constants: `*.constants.ts` (e.g., `HabitCard.constants.ts`)
- Styles: `*.styles.ts` (e.g., `HabitCard.styles.ts`, `HabitCard.statusStyles.ts`)
- API/Mutations: `*.mutations.ts`, `*.queries.ts` in `/convex` (backend)

**Functions:**
- camelCase for regular functions and hooks
- PascalCase for React components and constructors
- Prefix hooks with `use` (e.g., `useNetworkSync`, `useHabitCard`)
- Prefix utility functions with verb: `get`, `set`, `find`, `validate`, `calculate` (e.g., `getTodayForTimezone`, `findMaxOrder`, `isValidDateFormat`)

**Variables:**
- camelCase for regular variables and constants that may change
- UPPER_SNAKE_CASE for true constants (immutable configuration values)
- Prefix boolean variables with `is`, `has`, `can`, `should` (e.g., `isOnline`, `hasError`, `canSync`)
- Error variables follow unicorn rule: catch parameters named `error_` not `e` (e.g., `catch (error_) {...}`)
- Variables starting with `_` are intentionally unused and exempt from ESLint warnings

**Types:**
- PascalCase for interfaces and type aliases (e.g., `HabitCardProps`, `OptimisticToggleOptions`, `ToggleMutationResult`)
- Suffix option types with `Options` (e.g., `UseNetworkSyncOptions`, `OptimisticToggleOptions`)
- Suffix return types with `Return` (e.g., `UseNetworkSyncReturn`, `ToggleMutationResult`)
- Props types suffixed with `Props` (e.g., `HabitCardProps`, `ComponentNameProps`)

## Code Style

**Formatting:**
- Prettier v3.8.1 enforces format
- Print width: 80 characters
- Tab width: 2 spaces
- Single quotes for strings (both JS and JSX)
- Trailing commas: ES5 style (no comma on final item in multiline)
- Arrow function parentheses: always include parens `(arg) => ...`
- End of line: LF (Unix style)
- Bracket spacing: true (`{ x: 1 }` not `{x: 1}`)
- Bracket same line: false (closing bracket on new line)
- Prose wrap: preserve

Configuration file: `.prettierrc`

**Linting:**
- ESLint with flat config (`eslint.config.js`)
- TypeScript ESLint recommended type-checked rules
- Unicorn plugin for code quality
- React and React Hooks plugins
- Factory plugin for architectural rules (mostly disabled for flexibility)

**Key ESLint Rules:**
- `max-lines`: **error** at 100 lines (skip blank lines and comments) — see **File Size Limit** below
- `max-lines-per-function`: **warn** at 40 lines (skip blank lines and comments)
- `complexity`: **warn** at 10
- `no-console`: off (console logging allowed in production code)
- `@typescript-eslint/require-await`: off (async handlers without await permitted for Convex handlers)
- `@typescript-eslint/no-explicit-any`: off (explicit `any` allowed, implicit `any` discouraged)
- `unused-imports/no-unused-vars`: **warn** (args/vars starting with `_` ignored)
- `unicorn/filename-case`: off (PascalCase for React components allowed)
- `unicorn/no-null`: off (null is valid in React)
- `react-hooks/exhaustive-deps`: off (disabled for flexibility)

**File Size Limit (Code Readability Initiative):**
- Production files: **100-line maximum** (enforced as ESLint error)
- Exceptions (exempted from max-lines rule):
  - Data files: `emojiData/`, `templatesDataSeed.ts`, `SmartSuggestions/suggestions.data.ts`, `habitEmojis.data.ts`
  - Schema files: `convex/schema.ts` (data contract, not logic)
  - Example/debug files: `*Example.tsx`, `*Debug.tsx`, `examples/**/*`
  - Theme configuration: `theme/index.ts` (large style configurations)
  - Test setup: `jest.setup.js` (configuration)
  - A/B testing variants: `CalendarTimelineWithPulse.tsx`, `CalendarTimelineWithEdgeFade.tsx`
  - Deprecated components: scheduled for removal
- Rationale: See `docs/DECOMPOSITION_PATTERNS.md` for refactoring guidance

## Import Organization

**Order (enforced manually via code review):**
1. React/React Native imports: `import React from 'react'`, `import { View } from 'react-native'`
2. Third-party libraries: `import { useMutation } from 'convex/react'`, `import clsx from 'clsx'`
3. Convex imports: `import { useQuery, useMutation } from 'convex/react'`, `import { api } from '../convex/_generated/api'`
4. Local absolute imports (path aliases): `import { useNetworkSync } from '@/contexts/NetworkStatusContext'`
5. Local relative imports: `import { useComponentLogic } from './ComponentName.hooks'`, `import { ComponentHeader } from './components'`
6. Type imports (keep at top of their category): `import type { HabitCardProps } from './HabitCard.types'`

**Path Aliases:**
- `@/`: Root of `src/` directory (maps to `<rootDir>/src/` in jest/tsconfig)
- `~/`: Also maps to `src/` for backward compatibility

## Error Handling

**Patterns:**
- Catch parameter naming: `catch (error_) { ... }` (unicorn rule requirement, not `e` or `error`)
- Error propagation: catch errors that are recoverable (network issues, auth failures), log and show user feedback
- Non-recoverable errors: re-throw after logging to Sentry
- Network error detection: Use `isNetworkError()` utility to differentiate network errors from application errors

**Example Pattern (from `useOptimisticToggleMutation.ts`):**
```typescript
try {
  await serverMutation(args);
  optimisticStore.confirm(operationId);
  return { queued: false };
} catch (error) {
  if (isNetworkError(error)) {
    // Recoverable: queue for offline sync
    const queueResult = getOfflineQueueManager().enqueue('toggleCompletion', payload);
    return { offlineOperationId: queueResult.operationId, queued: queueResult.success };
  }
  // Non-network error: fail optimistic update and propagate
  optimisticStore.fail(operationId, error as Error);
  throw error;
}
```

**Error Classes:**
- No custom error classes — use `Error` or `TypeError` directly
- Add error context via Sentry breadcrumbs and tags: `{ tags: { error_source: 'mutation', component: 'HabitCard' } }`
- Tag all errors with `error_source`: 'query', 'mutation', 'component', etc.
- Tag errors with error classification: `error_category`: 'network', 'auth', 'validation', 'unknown'

## Logging

**Framework:** `console` (no logger library)

**Patterns:**
- `console.log()`: Info-level logs (feature activity, state changes)
- `console.warn()`: Warnings (deprecated usage, non-critical failures)
- `console.error()`: Error-level logs (critical failures, exceptions)
- All errors logged to Sentry via `trackError()` or `useComponentErrorHandler()`

**When to Log:**
- Network state changes: `console.log('Network status changed to:', isOnline)`
- Optimistic updates: `console.log('Applied optimistic toggle:', habitId, date, toCompleted)`
- Offline queue operations: `console.log('Queued operation:', operationId, payload)`
- Critical business logic: date validation, authorization failures
- Avoid: Verbose debugging logs in production code (use `console.log` sparingly)

**Sentry Integration:**
- All try-catch blocks should report to Sentry via `useComponentErrorHandler()` or `trackError()`
- Errors include tags: `error_source` (component/query/mutation), `error_category` (network/auth/validation)
- File: `src/lib/sentry/errorTracking/`

## Comments

**When to Comment:**
- Complex business logic: timezone handling, date arithmetic, streak calculation
- Non-obvious workarounds: why a particular implementation was chosen over alternatives
- Regulatory/compliance: accessibility considerations (WCAG levels), data retention
- Avoid: Comments on obvious code (`const x = 1; // set x to 1`)

**JSDoc/TSDoc:**
- Used for public APIs and exported functions
- Required for hooks: describe parameters, return type, and example usage
- Required for utility functions with non-obvious side effects
- Optional for internal helper functions
- Format: `/** Description. @param x Description. @returns Description. */`

**Example (from `useNetworkSync.ts`):**
```typescript
/**
 * useNetworkSync - Wires network status changes to sync orchestrator
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isOnline, isSyncing, pendingCount, triggerSync } = useNetworkSync({
 *     onSyncComplete: (result) => { Toast.show(`Synced ${result.succeeded} habits`); },
 *   });
 *   return <View>{!isOnline && <OfflineBanner />}</View>;
 * }
 * ```
 */
export function useNetworkSync(options: UseNetworkSyncOptions = {}): UseNetworkSyncReturn {
  // Implementation
}
```

## Function Design

**Size:**
- Target: ≤40 lines (ESLint warns at 40+)
- Guideline: Single responsibility, fits in viewport without scrolling
- Exceptions: Some mutations/complex business logic may exceed with justification

**Parameters:**
- Prefer object parameters over positional: `function toggle({ habitId, date })` not `function toggle(habitId, date)`
- Object parameters allow future extension without breaking callers
- Maximum 3 positional parameters before switching to object

**Return Values:**
- Descriptive return types: `{ queued: boolean, offlineOperationId?: string }` not `boolean | string`
- Return objects with named properties to clarify intent
- Async functions return `Promise<T>` with explicit type

**Example (from `useOptimisticToggleMutation.ts`):**
```typescript
export function useOptimisticToggleMutation(
  serverMutation: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown>,
  getCurrentStatus: (habitId: Id<'habits'>, date: string) => boolean,
  options?: OptimisticToggleOptions
) {
  return useCallback(
    async (args: { habitId: Id<'habits'>; date: string }): Promise<ToggleMutationResult> => {
      // Single responsibility: handle optimistic + offline queue logic
      // ≤40 lines including error handling
    },
    [serverMutation, getCurrentStatus, isOnline]
  );
}
```

## Module Design

**Exports:**
- Use barrel exports (`index.ts`) for public APIs
- Example: `src/contexts/NetworkStatusContext/index.ts` exports hooks and provider
- Internal files prefix with `./` relative imports to indicate not re-exported
- Type exports use `export type { T }` not `export { type T }` (separate type imports at top)

**Barrel Files:**
- Minimal: typically 2-5 lines (re-exports only)
- Example:
  ```typescript
  export { default as NetworkStatusProvider } from './NetworkStatusProvider';
  export { useNetworkStatus } from './hooks';
  export type { NetworkStatusContextType } from './types';
  ```

**File Organization (Component Example):**
```
HabitCard/
├── index.ts                      # Barrel export
├── HabitCard.tsx                 # Main component (orchestration)
├── HabitCard.hooks.ts            # Custom hooks for business logic
├── HabitCard.types.ts            # TypeScript types/interfaces
├── HabitCard.styles.ts           # Main styles
├── HabitCard.statusStyles.ts     # Status-specific styles
├── HabitCard.constants.ts        # Magic values
├── components/                   # Sub-components
│   ├── SwipeActions.tsx
│   └── StrengthFillBackground.tsx
├── hooks/                        # Module-specific hooks
│   ├── useHabitCardAnimations.ts
│   └── useHabitCardGestures.ts
└── __tests__/                    # Tests (co-located)
    └── HabitCard.test.tsx
```

---

*Convention analysis: 2025-03-19*
