# Testing Guide

This guide covers testing practices for Chain Day, including how to run tests, what to test, and coverage goals.

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- HabitCard.test.tsx

# Run tests matching a pattern
npm run test -- --testNamePattern="habit"
```

### Specialized Test Suites

```bash
# Security tests
npm run test:security

# Performance tests
npm run test:performance
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Check TypeScript
npx tsc -p tsconfig.app.json --noEmit

# Check formatting
npm run format:check

# All checks
npm run check:all
```

## Test Structure

### File Organization

```
src/
├── components/
│   └── HabitCard/
│       ├── HabitCard.tsx
│       └── HabitCard.test.tsx
├── hooks/
│   └── useHabitStrength/
│       ├── useHabitStrength.ts
│       └── __tests__/
│           └── useHabitStrength.test.ts
├── contexts/
│   └── NetworkStatusContext/
│       ├── NetworkStatusProvider.tsx
│       └── __tests__/
│           └── NetworkStatusContext.test.tsx
└── features/
    └── habits/
        └── tests/
            └── HabitsApp.fab.test.tsx
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- Test utilities: `__tests__/`

## What to Test

### Priority 1: Business Logic

Critical algorithms and calculations:

- **Habit Strength**: `useHabitStrength.ts` - The core algorithm that calculates habit establishment level
- **Streak Calculation**: Streak counting logic
- **Offline Queue**: Queue management and sync logic

```typescript
// Example: Testing habit strength calculation
describe('useHabitStrength', () => {
  it('calculates automatic level for 80%+ completion rate', () => {
    const completions = generateCompletions(90, 100);
    const strength = calculateStrength(completions);
    expect(strength.level).toBe('automatic');
  });

  it('calculates building level for 60-79% completion', () => {
    const completions = generateCompletions(70, 100);
    const strength = calculateStrength(completions);
    expect(strength.level).toBe('building');
  });
});
```

### Priority 2: User Interactions

Core user flows:

- **Habit Completion**: Tapping checkbox, updating UI
- **Form Submission**: Creating/editing habits
- **Navigation**: Screen transitions

```typescript
// Example: Testing habit completion
describe('HabitCard', () => {
  it('toggles completion on checkbox press', async () => {
    const onToggle = jest.fn();
    render(<HabitCard habit={mockHabit} onToggle={onToggle} />);

    await fireEvent.press(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith(mockHabit.id);
  });
});
```

### Priority 3: Context Providers

State management:

- **NetworkStatusContext**: Online/offline detection
- **SyncStatusContext**: Sync state management
- **PerformanceContext**: Performance monitoring

### Priority 4: Utility Functions

Reusable helpers:

- **Date utilities**: Date formatting, comparisons
- **Color utilities**: Color transformations
- **Validation**: Input validation

## Testing Patterns

### Hook Testing

```typescript
// Test custom hook
import { renderHook, act } from '@testing-library/react';
import { useHabitStrength } from './useHabitStrength';

describe('useHabitStrength', () => {
  it('returns initial strength', () => {
    const { result } = renderHook(() => useHabitStrength(mockHabit));
    expect(result.current.level).toBe('starting');
  });
});
```

### Component Testing

```typescript
// Test component with user interactions
import { render, fireEvent, screen } from '@testing-library/react-native';
import { HabitCard } from './HabitCard';

describe('HabitCard', () => {
  it('renders habit name', () => {
    render(<HabitCard habit={mockHabit} />);
    expect(screen.getByText('Morning Run')).toBeTruthy();
  });
});
```

### Context Testing

```typescript
// Test context provider
import { render, act } from '@testing-library/react-native';
import { NetworkStatusProvider } from './NetworkStatusContext';

describe('NetworkStatusContext', () => {
  it('provides initial network status', async () => {
    const { result } = renderHook(() => useNetworkStatus(), {
      wrapper: NetworkStatusProvider,
    });

    expect(result.current.isOnline).toBe(true);
  });
});
```

### Async Testing

```typescript
// Testing async operations
describe('OfflineQueue', () => {
  it('processes queue when coming online', async () => {
    const { result } = renderHook(() => useOfflineQueue());

    // Add action to queue
    act(() => {
      result.current.addToQueue(mockAction);
    });

    // Simulate coming online
    mockOnlineStatus(true);

    // Wait for processing
    await waitFor(() => {
      expect(result.current.queue).toHaveLength(0);
    });
  });
});
```

## Mocking

### Convex Mocks

```typescript
// Mock Convex query
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(() => mockHabits),
  useMutation: jest.fn(() => mockMutation),
}));
```

### Module Mocks

```typescript
// Mock external module
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));
```

### Timer Mocks

```typescript
// Mock timers for animation testing
jest.useFakeTimers();

it('shows toast after delay', () => {
  render(<MyComponent />);

  jest.advanceTimersByTime(5000);

  expect(screen.getByText('Saved!')).toBeTruthy();
});
```

## Test Coverage Goals

### Current Coverage Targets

| Category | Target | Priority |
|----------|--------|----------|
| Hooks | 80% | High |
| Utilities | 90% | High |
| Business Logic | 100% | Critical |
| Components | 70% | Medium |
| Contexts | 80% | Medium |

### Areas Requiring 100% Coverage

- `src/hooks/useHabitStrength.ts`
- `src/utils/streakUtils.ts`
- `convex/habitStrength.ts`

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
it('calls setState with correct value', () => {
  expect(setState).toHaveBeenCalledWith(expected);
});

// ✅ Good: Testing user-visible behavior
it('displays updated count', () => {
  render(<Counter />);
  fireEvent.press(button);
  expect(screen.getByText('1')).toBeTruthy();
});
```

### 2. Use Meaningful Test Names

```typescript
// ❌ Bad: Too vague
it('test1', () => {});

// ✅ Good: Describes the scenario and expected outcome
it('shows error when habit name is empty', () => {});
```

### 3. Follow AAA Pattern

```typescript
it('calculates streak correctly', () => {
  // Arrange
  const completions = [date1, date2, date3];

  // Act
  const streak = calculateStreak(completions);

  // Assert
  expect(streak).toBe(3);
});
```

### 4. Keep Tests Isolated

```typescript
// Each test should be independent
beforeEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

### 5. Test Edge Cases

```typescript
it('handles empty completions array', () => {
  const strength = calculateStrength([]);
  expect(strength.level).toBe('starting');
});

it('handles null habit', () => {
  expect(() => render(<HabitCard habit={null} />)).not.toThrow();
});
```

## CI/CD Testing

### GitHub Actions

Tests run automatically on PRs:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run lint
```

### Pre-commit Hooks

Husky runs tests before commits:

```bash
# Runs on git commit
npm run prepare
```

## Debugging Tests

### Interactive Watch Mode

```bash
# Press 'p' to filter by filename
npm run test:watch

# Press 't' to filter by test name
npm run test:watch

# Press 'q' to quit
```

### Logging

```bash
# Show console.log in tests
npm run test -- --verbose

# Debug specific test
npm run test -- --inspect-brk
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-native-testing-library/cheatsheet/)
