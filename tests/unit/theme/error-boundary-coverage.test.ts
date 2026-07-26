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

describe('Root-level startup monitoring and boundary', () => {
  const appSource = readSource('App.tsx');
  const providersSource = readSource('app/AppProviders.tsx');
  const monitoringSource = readSource('app/initializeAppMonitoring.ts');

  it('imports the startup monitoring initializer into App', () => {
    expect(appSource).toContain(
      "import { initializeAppMonitoring } from './app/initializeAppMonitoring'"
    );
  });

  it('wraps the provider tree with StartupErrorBoundary', () => {
    expect(providersSource).toMatch(
      /<StartupErrorBoundary>[\s\S]*?<SafeAreaProvider>[\s\S]*?<\/StartupErrorBoundary>/
    );
  });

  it('keeps the same startup boundary for every runtime mode', () => {
    expect(providersSource).not.toContain('DevProviders');
    expect(providersSource.match(/<StartupErrorBoundary>/g)).toHaveLength(1);
  });

  it('schedules Sentry before the App component renders', () => {
    expect(monitoringSource).toContain('scheduleWhenIdle(initSentry');
    expect(appSource).toContain('initializeAppMonitoring()');
    const initIndex = appSource.indexOf('initializeAppMonitoring()');
    const providersIndex = appSource.indexOf('export default function App');
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

describe('AppProviders uses StartupErrorBoundary as the outer runtime wrapper', () => {
  const source = readSource('app/AppProviders.tsx');

  it('StartupErrorBoundary is first JSX element in the configured return', () => {
    const providersMatch = source.match(
      /return\s*\(\s*(<\w+)[\s\S]*?<SafeAreaProvider>/
    );
    expect(providersMatch?.[1]).toBe('<StartupErrorBoundary');
  });

  it('StartupErrorBoundary closes after all configured providers', () => {
    const boundaryStart = source.indexOf('<StartupErrorBoundary>');
    const lazyProviders = source.indexOf('<LazyProviders>');
    const boundaryEnd = source.indexOf('</StartupErrorBoundary>');
    expect(boundaryStart).toBeLessThan(lazyProviders);
    expect(boundaryEnd).toBeGreaterThan(lazyProviders);
  });
});
