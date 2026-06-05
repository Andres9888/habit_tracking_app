/**
 * ErrorBoundary Coverage Verification Tests (Phase 7 Task 4)
 * Verifies that SentryErrorBoundary wraps the root app and that
 * critical screen paths have additional local error boundaries.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('Root-level SentryErrorBoundary (App.tsx)', () => {
  const source = readSource('App.tsx');

  it('imports SentryErrorBoundary from sentry lib', () => {
    expect(source).toMatch(/import.*SentryErrorBoundary.*from.*sentry/);
  });

  it('wraps Providers function with SentryErrorBoundary', () => {
    // Production path
    expect(source).toMatch(
      /function Providers[\s\S]*?<SentryErrorBoundary>[\s\S]*?<\/SentryErrorBoundary>/
    );
  });

  it('wraps DevProviders function with SentryErrorBoundary', () => {
    // Development path
    expect(source).toMatch(
      /function DevProviders[\s\S]*?<SentryErrorBoundary>[\s\S]*?<\/SentryErrorBoundary>/
    );
  });

  it('initializes Sentry before rendering', () => {
    expect(source).toContain('initSentry()');
    // initSentry should appear before the Providers function
    const initIndex = source.indexOf('initSentry()');
    const providersIndex = source.indexOf('function Providers');
    expect(initIndex).toBeLessThan(providersIndex);
  });
});

describe('Secondary ErrorBoundary in CalendarAndDetailModals', () => {
  const source = readSource(
    'features/habits/components/HabitsModals/CalendarAndDetailModals.tsx'
  );

  it('imports ErrorBoundary component', () => {
    expect(source).toMatch(/import.*ErrorBoundary/);
  });

  it('wraps HabitCalendarModal with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<HabitCalendarModal[\s\S]*?<\/ErrorBoundary>/
    );
  });

  it('wraps HabitDetailScreen with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<HabitDetailScreen[\s\S]*?<\/ErrorBoundary>/
    );
  });

  it('wraps HabitEditScreen with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<HabitEditScreen[\s\S]*?<\/ErrorBoundary>/
    );
  });
});

describe('Secondary ErrorBoundary in HabitDetailContent', () => {
  const source = readSource(
    'screens/HabitDetailScreen/components/HabitDetailContent.tsx'
  );

  it('imports ErrorBoundary component', () => {
    expect(source).toMatch(/import.*ErrorBoundary/);
  });

  it('wraps HabitStrengthSection with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<HabitStrengthSection[\s\S]*?<\/ErrorBoundary>/
    );
  });

  it('wraps calendar section via CalendarTabContent', () => {
    expect(source).toMatch(/<CalendarTabContent[\s\S]*?\/>/);
  });
});

describe('Secondary ErrorBoundary in CalendarTabContent', () => {
  const source = readSource(
    'screens/HabitDetailScreen/components/CalendarTabContent.tsx'
  );

  it('imports ErrorBoundary component', () => {
    expect(source).toMatch(/import.*ErrorBoundary/);
  });

  it('wraps MonthlyCalendarGrid with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<MonthlyCalendarGrid[\s\S]*?<\/ErrorBoundary>/
    );
  });
});

describe('Secondary ErrorBoundary in TemplatesModalSection', () => {
  const source = readSource(
    'features/habits/components/HabitsModals/TemplatesModalSection.tsx'
  );

  it('imports ErrorBoundary component', () => {
    expect(source).toMatch(/import.*ErrorBoundary/);
  });

  it('wraps TemplatesScreen with ErrorBoundary', () => {
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<TemplatesScreen[\s\S]*?<\/ErrorBoundary>/
    );
  });
});

describe('Both provider paths use SentryErrorBoundary as outermost wrapper', () => {
  const source = readSource('App.tsx');

  it('SentryErrorBoundary is first JSX element in Providers return', () => {
    // Extract the Providers function body
    const providersMatch = source.match(
      /function Providers[^{]*\{[\s\S]*?return\s*\(\s*(<\w+)/
    );
    expect(providersMatch?.[1]).toBe('<SentryErrorBoundary');
  });

  it('SentryErrorBoundary is first JSX element in DevProviders return', () => {
    const devProvidersMatch = source.match(
      /function DevProviders[^{]*\{[\s\S]*?return\s*\(\s*(<\w+)/
    );
    expect(devProvidersMatch?.[1]).toBe('<SentryErrorBoundary');
  });
});
