# Test Organization

This directory contains all tests for the Habit Tracking App, organized by test type and feature.

## Directory Structure

```
tests/
├── unit/                      # Unit tests
│   ├── components/           # Component unit tests
│   ├── utils/               # Utility function tests
│   └── convex/              # Convex backend unit tests
├── integration/              # Integration tests
│   ├── features/            # Feature integration tests
│   └── workflows/           # User workflow tests
└── e2e/                     # Legacy Detox-shaped tests (not current runner)
```

Device-level E2E flows live in `.maestro/e2e/`.

```
.maestro/
└── e2e/                     # Maestro device E2E flows
```

## Test Types

### Unit Tests (`tests/unit/`)
Tests for individual components, functions, and modules in isolation.

- **Components**: Test individual React components
- **Utils**: Test utility functions and helpers
- **Convex**: Test Convex backend functions and queries

### Integration Tests (`tests/integration/`)
Tests for how different parts of the application work together.

- **Features**: Test complete features (e.g., habit creation, streak tracking)
- **Workflows**: Test multi-step user workflows

### Scenario Tests (`tests/e2e-scenarios/`)
Headless whole-screen scenarios that render real screens through the provider
stack with mocked backend/native modules.

### Device E2E Tests (`.maestro/e2e/`)
Maestro flows that simulate real user interactions on an installed iOS
simulator or Android emulator. Use these for launch, navigation, gestures,
offline/network state, native permissions, and release smoke checks.

### Legacy E2E Tests (`tests/e2e/`)
Older Detox-shaped tests retained for reference. Detox is not currently wired
to `npm run test:e2e`; use Maestro instead.

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- tests/unit

# Run integration tests only
npm test -- tests/integration

# Run headless scenario tests
npm run test:scenarios

# Run Maestro smoke tests on a prepared simulator/emulator
npm run test:e2e:maestro:smoke

# Run the default E2E gate
npm run test:e2e

# Run specific test file
npm test -- tests/unit/components/Button.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Writing Tests

### Unit Test Example
```typescript
// tests/unit/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react-native';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

### Integration Test Example
```typescript
// tests/integration/features/habit-creation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '@/App';

describe('Habit Creation Flow', () => {
  it('should create a new habit', async () => {
    render(<App />);
    fireEvent.press(screen.getByText('Add Habit'));
    // ... test the complete flow
  });
});
```

## Best Practices

1. **Organize by feature**: Keep related tests together
2. **Clear naming**: Use descriptive test names that explain what is being tested
3. **Isolation**: Unit tests should not depend on external services
4. **Mock smartly**: Mock only what's necessary
5. **Test behavior**: Focus on what the code does, not how it's implemented

## Test Coverage

Aim for:
- **Unit tests**: 80%+ coverage
- **Integration tests**: Cover critical user flows
- **E2E tests**: Cover main user journeys

## CI/CD

Tests run automatically on:
- Pull requests to `dev` and `main`
- Commits to `main`

All tests must pass before merging.
