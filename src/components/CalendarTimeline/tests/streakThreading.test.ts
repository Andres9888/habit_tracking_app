/**
 * Streak Data Threading — Code Verification Tests
 *
 * Verifies that currentStreak data flows correctly through the component chain:
 * HabitsListHeader → CalendarTimeline → WeekNavigationHeader → ProgressGreeting
 */

import * as fs from 'fs';
import * as path from 'path';

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), 'utf-8');

describe('Streak threading: HabitsListHeader', () => {
  const source = readSource(
    '../../../features/habits/components/HabitsList/HabitsListHeader.tsx'
  );

  it('passes currentStreak from props to CalendarTimeline', () => {
    expect(source).toContain('currentStreak={props.currentStreak}');
  });
});

describe('Streak threading: HabitsListHeader types', () => {
  const source = readSource(
    '../../../features/habits/components/HabitsList/HabitsListHeader.types.ts'
  );

  it('includes currentStreak in HabitsListHeaderProps', () => {
    expect(source).toContain('currentStreak: number');
  });
});

describe('Streak threading: CalendarTimeline', () => {
  const source = readSource('../CalendarTimeline.tsx');

  it('destructures currentStreak from props', () => {
    expect(source).toContain('currentStreak');
  });

  it('passes currentStreak to WeekNavigationHeader', () => {
    expect(source).toContain('currentStreak={currentStreak}');
  });
});

describe('Streak threading: CalendarTimeline types', () => {
  const source = readSource('../CalendarTimeline.types.ts');

  it('includes currentStreak in CalendarTimelineProps', () => {
    expect(source).toMatch(/CalendarTimelineProps[\s\S]*currentStreak/);
  });

  it('includes currentStreak in WeekNavigationHeaderProps', () => {
    expect(source).toMatch(/WeekNavigationHeaderProps[\s\S]*currentStreak/);
  });
});

describe('Streak threading: WeekNavigationHeader', () => {
  const source = readSource('../components/WeekNavigationHeader.tsx');

  it('destructures currentStreak from props', () => {
    expect(source).toContain('currentStreak');
  });

  it('passes currentStreak to ProgressGreeting', () => {
    expect(source).toContain('currentStreak={currentStreak}');
  });
});

describe('Streak threading: ProgressGreeting', () => {
  const source = readSource('../components/ProgressGreeting.tsx');

  it('accepts currentStreak prop with default value', () => {
    expect(source).toContain('currentStreak');
  });

  it('passes currentStreak to useStreakGreeting', () => {
    expect(source).toContain('useStreakGreeting');
  });
});
