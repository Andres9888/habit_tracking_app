# Testing Patterns

**Analysis Date:** 2025-03-19

## Test Framework

**Runner:**

- Jest v29.7.0
- Preset: `jest-expo` (React Native + Expo support)
- Config: `jest.config.js` (root), `tests/e2e/jest.config.js` (end-to-end)

**Assertion Library:**

- Jest built-in matchers (included in v29+)
- `@testing-library/react-native` v13.3.3 for component testing
- Custom matchers built into `@testing-library/react-native` v12.4+ (deprecated `@testing-library/jest-native` removed Jul 2026)

**Run Commands:**

```bash
npm test                    # Run all tests (watches not specified in root package.json)
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:security      # Run security tests only (--testPathPattern=security)
npm run test:performance   # Run performance tests only (--testPathPattern=performance)
```

## Test File Organization

**Location:**

- Co-located with source code: `src/components/HabitCard/__tests__/HabitCard.test.tsx`
- Or in dedicated `tests/` directory: `tests/unit/convex/habits.toggle.test.ts`, `tests/unit/components/`
- End-to-end tests: `tests/e2e/` with separate Jest config

**Naming:**

- Unit tests: `*.test.ts` or `*.test.tsx` (file being tested + `.test`)
- Integration tests: `*.test.ts` (e.g., `habitStreakIntegration.test.ts`)
- E2E tests: `*.test.ts` in `tests/e2e/`
- Test utilities: `__tests__/` subfolder or `*.test.ts` alongside source

**Structure:**

```
tests/
├── unit/
│   ├── convex/              # Backend mutation/query tests
│   │   ├── habits.toggle.test.ts
│   │   ├── habits.mutations.test.ts
│   │   └── habitStrength.test.ts
│   ├── components/          # React/RN component tests
│   │   ├── PackConfirmSheet.test.tsx
│   │   └── PaywallSheet.test.tsx
│   └── theme/               # Design token tests
│       ├── animation-springs.test.ts
│       └── fontsize-standardization.test.ts
├── e2e/
│   └── jest.config.js       # Separate E2E config
└── ...
```

## Test Structure

**Suite Organization:**

```typescript
/**
 * PackConfirmSheet migration tests
 * Verifies the component uses the shared Modal with bottomSheet variant
 * and renders pack content correctly.
 */
describe('PackConfirmSheet', () => {
  const defaultProps = {
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    pack: TEST_PACK,
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    lastModalProps = {};
  });

  it('uses the shared Modal with bottomSheet variant', () => {
    render(<PackConfirmSheet {...defaultProps} />);
    expect(lastModalProps.variant).toBe('bottomSheet');
  });

  it('passes visible and onClose to Modal', () => {
    render(<PackConfirmSheet {...defaultProps} />);
    expect(lastModalProps.visible).toBe(true);
    expect(lastModalProps.onClose).toBe(defaultProps.onCancel);
  });
});
```

**Patterns:**

- One `describe()` block per component or module
- Group related tests in nested `describe()` blocks by feature
- `beforeEach()` to reset mocks and state (always call `jest.clearAllMocks()`)
- `afterEach()` for cleanup (fake timers, subscriptions)
- Test setup in variables declared above `describe()` for reuse

**Setup/Teardown:**

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllTimers();
});
```

## Mocking

**Framework:** Jest built-in `jest.mock()` and `jest.fn()`

**Patterns:**

```typescript
// Mock module entirely
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(async () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'WIFI',
  })),
  addNetworkStateListener: jest.fn((cb) => ({ remove: jest.fn() })),
}));

// Mock component
jest.mock('../../../src/components/Modal', () => {
  const { View } = require('react-native');
  function MockModal(props) {
    lastModalProps = props;
    return props.visible ? <View testID="shared-modal">{props.children}</View> : null;
  }
  MockModal.displayName = 'MockModal';
  return { __esModule: true, default: MockModal, Modal: MockModal };
});

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => []),
  useMutation: jest.fn(() => jest.fn()),
  ConvexProvider: ({ children }) => children,
}));

// Partial mock with jest.requireActual()
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  isToday: jest.fn((date) => date.toDateString() === new Date().toDateString()),
}));
```

**What to Mock:**

- External APIs: Expo modules, Convex, Clerk, Sentry
- Network requests: Mock `fetch()` or use MSW (if installed)
- Third-party libraries with side effects: gesture handlers, animations
- File system: `expo-secure-store`, `expo-notifications`

**What NOT to Mock:**

- React/React Native components (unless specifically testing integration)
- Utility functions you wrote (test directly instead)
- Date/time in logic tests (use `jest.useFakeTimers()` instead of mocking `Date`)
- Context providers for their own tests (render with real provider)

## Fixtures and Factories

**Test Data:**

```typescript
const TEST_PACK: PremiumPack = {
  backgroundGradient: ['#7C3AED', '#4F46E5'],
  description: 'Test pack description',
  emojiGroup: ['🎯'],
  habits: [
    { emoji: '🌅', frequency: 'Daily', name: 'Morning Sunlight' },
    { emoji: '🧊', frequency: '3x/week', name: 'Cold Exposure' },
  ],
  id: 'test-pack',
  name: 'Test Pack',
};

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  pack: TEST_PACK,
  visible: true,
};
```

**Location:**

- Fixtures defined at top of test file if used by single test suite
- Shared fixtures in `tests/fixtures/` or `tests/unit/__fixtures__/`
- Factory functions for generating realistic test data:
  ```typescript
  function mockHabitId(suffix: string = ''): Id<'habits'> {
    return `habit_${Date.now()}_${suffix}` as Id<'habits'>;
  }
  ```

## Coverage

**Requirements:** No enforced minimum (tracked but not blocking)

**View Coverage:**

```bash
npm run test:coverage
# Generates `coverage/` directory with HTML report
open coverage/lcov-report/index.html
```

**Configuration (jest.config.js):**

```javascript
collectCoverageFrom: [
  '**/*.{ts,tsx}',
  '!**/node_modules/**',
  '!**/coverage/**',
  '!**/*.d.ts',
],
```

**Gaps Tracked:** Tests for offline queue operations, sync orchestration, and theme token validation have limited coverage — these are higher-risk areas for regression.

## Test Types

**Unit Tests:**

- Scope: Single function, hook, or component
- Approach: Mock all dependencies, test in isolation
- Example: `habits.toggle.test.ts` tests date validation functions independently
- Location: `tests/unit/`

**Integration Tests:**

- Scope: Multiple functions working together (e.g., habit strength calculation with streak recovery)
- Approach: Use real implementations of related modules, mock external dependencies only
- Example: `habitStreakIntegration.test.ts` tests habit toggle + streak recovery flow
- Location: `tests/unit/` (named with `Integration` suffix or in `integration/` folder)

**E2E Tests:**

- Scope: Full app flow (login → create habit → track → view stats)
- Approach: Run against live or stubbed backend, no mocks except external APIs
- Example: Would test complete user journeys
- Location: `tests/e2e/` (separate Jest config)
- Status: Not yet implemented in codebase

## Common Patterns

**Async Testing:**

```typescript
describe('Date Validation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows today date', () => {
    jest.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
    expect(isFutureDate('2025-01-15')).toBe(false);
  });

  it('allows dates within 24-hour grace period', () => {
    jest.setSystemTime(new Date('2025-01-15T00:00:00.000Z'));
    expect(isFutureDate('2025-01-16')).toBe(false); // +24h, within grace
  });
});
```

**Error Testing:**

```typescript
it('should reject toggle when user is not authenticated', () => {
  const identity = null;
  expect(identity).toBeNull();
  // Mutation should throw: "Unauthenticated: Must be logged in to toggle habits"
});

it('should reject toggle when habit belongs to different user', () => {
  const habit = { userId: 'user123' };
  const requestingUserId = 'user456';
  expect(habit.userId).not.toBe(requestingUserId);
  // Mutation should throw: "Not authorized to toggle this habit"
});
```

**Component Testing (React Testing Library):**

```typescript
it('renders pack name and habit count', () => {
  const { getByText } = render(<PackConfirmSheet {...defaultProps} />);
  expect(getByText('Test Pack')).toBeTruthy();
  expect(getByText('2 habits will be added')).toBeTruthy();
});

it('calls onCancel when Cancel button is pressed', () => {
  const { getByTestId } = render(<PackConfirmSheet {...defaultProps} />);
  fireEvent.press(getByTestId('templates-pack-confirm-cancel'));
  expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
});
```

**Snapshot Testing:**

- Not used in this codebase (explicit expectations preferred)
- If snapshots needed: store in `__snapshots__/` alongside test

## Mock Setup (jest.setup.js)

File: `jest.setup.js` (root)

**Comprehensive mocking for:**

- Expo modules: `expo-notifications`, `expo-haptics`, `expo-network`, `expo-secure-store`
- Gesture handler: `react-native-gesture-handler` (complex gesture API)
- Animations: `react-native-reanimated` (shared value mocking, animation functions)
- Convex: `convex/react` (hooks return empty or mocks)
- Clerk: `@clerk/clerk-expo` (auth providers)
- Icons: `lucide-react-native` (Proxy-based factory for icon mocks)
- NativeWind/styling: `nativewind`, `clsx`, CSS imports
- Layout/lifecycle: Fake timers auto-supported by Jest

**Critical mocks for RN animations:**

```javascript
useSharedValue: (initial) => ({ value: initial }),
useAnimatedStyle: (cb) => cb() || {},
withTiming: (value) => value,
runOnJS: (fn) => fn,
runOnUI: (fn) => fn,  // CRITICAL: Missing in some setups, causes failures
interpolate: (value, inputRange, outputRange) => { /* linear interpolation */ },
```

## Test Naming Conventions

- Descriptive test names describing what should happen: `it('should reject toggle when user is not authenticated')`
- NOT implementation details: `it('checks identity null')`
- Include business context: `it('allows dates within 24-hour grace period (timezone accommodation)')`

## Known Issues & Gaps

**Untested Areas:**

1. Offline queue persistence and recovery (no integration tests)
2. Sync orchestrator edge cases (network transitions)
3. Theme token application in edge device sizes
4. Gesture handler complex interactions (drag, multitouch)
5. Error recovery flows (network reconnect, retry logic)

**Test Maintenance:**

- Review mock setup when Expo/React Native versions bump
- `jest.setup.js` is the source of truth for mock implementations — updates there propagate to all tests
- Broken tests often indicate outdated module mocking

---

_Testing analysis: 2025-03-19_
