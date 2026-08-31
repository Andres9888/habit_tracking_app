/**
 * Shared harness for whole-app E2E UI scenarios.
 *
 * - renderScreen(): mounts a real screen inside the real provider stack
 *   (SafeAreaProvider + ThemeColorProvider + LazyProviders) so screens behave
 *   as they do in the running app.
 * - Convex is dispatched per-query by function name via getFunctionName(), so a
 *   single render can feed realistic, query-specific data to many useQuery calls
 *   and expose stable per-mutation spies for assertions.
 * - Data factories produce realistic habit / tracking / settings / analytics /
 *   character payloads matching the Convex return shapes.
 */
import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getFunctionName } from 'convex/server';
import { useMutation, useQuery } from 'convex/react';

import type { Habit, HabitId } from '../../src/features/habits/types';
import { ThemeColorProvider } from '../../src/theme/ThemeContext';
import { LazyProviders } from '../../src/providers/LazyProviders';
import { computeOverviewStats } from '../../convex/analyticsOverview';
import { computeStrengthDistribution } from '../../convex/analyticsDistribution';
import { computeTrend } from '../../convex/analyticsTrend';
import { computeCompliance } from '../../convex/analyticsCompliance';
import { computeWeeklyInsights } from '../../convex/analyticsWeekly';

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

// ---------------------------------------------------------------------------
// Convex per-query dispatch
// ---------------------------------------------------------------------------
const queryRegistry = new Map<string, unknown>();
const mutationRegistry = new Map<string, jest.Mock>();

function nameOf(ref: unknown): string {
  try {
    return ref ? getFunctionName(ref as never) : 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Reset + wire the global convex mocks. Call in beforeEach. */
export function resetConvex(): void {
  queryRegistry.clear();
  mutationRegistry.clear();
  (useQuery as jest.Mock).mockImplementation((ref: unknown) => {
    const name = nameOf(ref);
    return queryRegistry.has(name) ? queryRegistry.get(name) : undefined;
  });
  (useMutation as jest.Mock).mockImplementation((ref: unknown) => {
    const name = nameOf(ref);
    if (!mutationRegistry.has(name)) {
      mutationRegistry.set(
        name,
        jest.fn(async () => undefined)
      );
    }
    return mutationRegistry.get(name) as jest.Mock;
  });
}

/** Set the value a useQuery(<fnName>) call should return. e.g. 'habits:list'. */
export function setQuery(fnName: string, value: unknown): void {
  queryRegistry.set(fnName, value);
}

/** Get (creating if needed) the stable mock for a mutation, e.g. 'habits:create'. */
export function getMutation(fnName: string): jest.Mock {
  if (!mutationRegistry.has(fnName)) {
    mutationRegistry.set(
      fnName,
      jest.fn(async () => undefined)
    );
  }
  return mutationRegistry.get(fnName) as jest.Mock;
}

// ---------------------------------------------------------------------------
// Provider wrapper + render
// ---------------------------------------------------------------------------
function AllProviders({ children }: { children: ReactNode }): ReactElement {
  return (
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <ThemeColorProvider>
        <LazyProviders>{children}</LazyProviders>
      </ThemeColorProvider>
    </SafeAreaProvider>
  );
}

export function renderScreen(ui: ReactElement) {
  return render(<AllProviders>{ui}</AllProviders>);
}

// ---------------------------------------------------------------------------
// Data factories (match Convex return shapes)
// ---------------------------------------------------------------------------
const DAY_MS = 24 * 60 * 60 * 1000;

export function isoDay(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * DAY_MS);
  return d.toISOString().slice(0, 10);
}

export type HabitOverrides = Partial<Habit> & {
  id?: HabitId | string;
};

export function makeHabit(overrides: HabitOverrides = {}): Habit {
  const { id: idAlias, ...habitOverrides } = overrides;
  const id = (idAlias ?? habitOverrides._id ?? 'habit_1') as HabitId;
  return {
    _creationTime: Date.now() - 30 * DAY_MS,
    name: 'Morning Run',
    icon: '🏃',
    color: '#34d399',
    iconColor: '#d1fae5',
    strength: 0.62,
    strengthLevel: 'growing',
    currentStreak: 5,
    bestStreak: 12,
    consecutiveDays: 5,
    lastCompletedDate: isoDay(-1),
    paused: false,
    pausedAt: undefined,
    archived: false,
    archivedAt: undefined,
    order: 0,
    createdAt: Date.now() - 30 * DAY_MS,
    totalCompletions: 22,
    totalMisses: 6,
    notes: '',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    frequency: 'daily',
    remindersEnabled: false,
    reminderTime: '08:00',
    preferredTime: 'morning',
    why: 'Feel energized',
    progressEmojis: { easy: '😀', hard: '😤' },
    strengthAlgorithm: 'balanced',
    userId: 'test-user',
    ownerId: 'test-user',
    ...habitOverrides,
    _id: id,
  } as Habit;
}

export function makeTracking(habitId: string, completedDays: number[] = []) {
  return completedDays.map((offset, i) => ({
    _id: `track_${habitId}_${i}`,
    _creationTime: Date.now() + offset * DAY_MS,
    completed: true,
    date: isoDay(offset),
    habitId,
    userId: 'test-user',
  }));
}

export function makeSettings(overrides: Record<string, unknown> = {}) {
  return {
    userId: 'test-user',
    darkMode: 'light',
    theme: 'light',
    showMotivationalMessages: true,
    celebrationsEnabled: true,
    reduceMotionPreference: false,
    stickyCalendarHeader: false,
    hasPremium: true,
    streakReminderTime: '20:00',
    appIcon: 'default',
    locale: 'en',
    ...overrides,
  };
}

export function makeTemplate(
  id: string,
  name: string,
  category = 'health',
  overrides: Record<string, unknown> = {}
) {
  return {
    _id: id,
    _creationTime: Date.now(),
    name,
    description: `${name} description`,
    category,
    icon: '💧',
    color: '#60a5fa',
    iconColor: '#dbeafe',
    difficulty: 'easy',
    science: ['evidence-based'],
    frequency: 'daily',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    ...overrides,
  };
}

/** Seed the queries shared by most screens so they render real content. */
export function seedCommonQueries(
  habits = [makeHabit({ name: 'Morning Run' })]
) {
  setQuery('settings:get', makeSettings());
  setQuery('habits:list', habits);
  setQuery('habits:getTracking', makeTracking('habit_1', [0, -1, -2, -3]));
  setQuery('users:currentUser', {
    _id: 'u1',
    email: 'test@example.com',
    name: 'Test',
  });
}

/** Flush pending promises/microtasks so provider effects settle after render. */
export async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

// Build the analytics dashboard payload from the real Convex compute functions
// so the five sub-report shapes always match what the screen reads.
export function makeAnalyticsDashboard(
  habits = [
    makeHabit({
      id: 'habit_1',
      name: 'Morning Run',
      strength: 0.7,
      currentStreak: 5,
    }),
    makeHabit({ id: 'habit_2', name: 'Read', strength: 0.3, currentStreak: 9 }),
  ],
  trackings = [-3, -2, -1, 0].flatMap((d) => [
    {
      _id: `t1${d}`,
      date: isoDay(d),
      completed: true,
      habitId: 'habit_1',
      userId: 'test-user',
    },
    {
      _id: `t2${d}`,
      date: isoDay(d),
      completed: true,
      habitId: 'habit_2',
      userId: 'test-user',
    },
  ])
) {
  return {
    overviewStats: computeOverviewStats(habits as never),
    strengthDistribution: computeStrengthDistribution(habits as never),
    trendData: computeTrend(habits as never, trackings as never),
    complianceData: computeCompliance(habits as never, trackings as never),
    weeklyInsights: computeWeeklyInsights(habits as never, trackings as never),
  };
}
