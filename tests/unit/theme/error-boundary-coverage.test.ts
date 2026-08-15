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

describe('Root-level startup monitoring (App.tsx)', () => {
  const source = readSource('App.tsx');

  it('initializes app monitoring before render', () => {
    expect(source).toContain('initializeAppMonitoring()');
    expect(source.indexOf('initializeAppMonitoring()')).toBeLessThan(
      source.indexOf('export default function App')
    );
  });

  it('renders the app inside AppProviders', () => {
    expect(source).toMatch(/<AppProviders>[\s\S]*<AuthGate \/>[\s\S]*<\/AppProviders>/);
  });
});

describe('AppProviders wraps the tree in StartupErrorBoundary', () => {
  const source = readSource('app/AppProviders.tsx');

  it('imports StartupErrorBoundary', () => {
    expect(source).toMatch(/import.*StartupErrorBoundary/);
  });

  it('uses StartupErrorBoundary as the outermost wrapper', () => {
    expect(source).toMatch(
      /<StartupErrorBoundary>[\s\S]*<ReducedMotionConfig[\s\S]*<\/StartupErrorBoundary>/
    );
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

describe('Secondary ErrorBoundary in habit detail flow screens', () => {
  it('wraps HabitStrengthSection on Analytics', () => {
    const source = readSource(
      'screens/HabitDetailScreen/components/HabitAnalyticsScreen/HabitAnalyticsScreen.tsx'
    );
    expect(source).toMatch(/import.*ErrorBoundary/);
    expect(source).toMatch(
      /<ErrorBoundary>[\s\S]*?<HabitStrengthSection[\s\S]*?<\/ErrorBoundary>/
    );
  });

  it('hosts the calendar on History', () => {
    const source = readSource(
      'screens/HabitDetailScreen/components/HabitHistoryScreen/HabitHistoryScreen.tsx'
    );
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

describe('initializeAppMonitoring schedules Sentry', () => {
  const source = readSource('app/initializeAppMonitoring.ts');

  it('imports initSentry from the sentry lib', () => {
    expect(source).toMatch(/import.*initSentry.*from.*sentry/);
  });

  it('schedules initSentry on idle', () => {
    expect(source).toContain('scheduleWhenIdle(initSentry');
  });
});
