import type { StreakRun } from '../../../insights';
import { goalRowMeta, runsFootnote, runsNote } from '../runsCopy';

const run = (length: number, isCurrent = false): StreakRun => ({
  end: '2026-08-10',
  isCurrent,
  length,
  start: '2026-08-01',
});

describe('runsNote', () => {
  it('names the axis when a goal is set', () => {
    expect(runsNote(37, 21)).toBe('37 runs · axis 21-day goal');
    expect(runsNote(1, 0)).toBe('1 run');
  });
});

describe('runsFootnote', () => {
  it('says nothing about a single run', () => {
    expect(runsFootnote(1, 1, null)).toBe('');
  });

  it('says how many runs are hidden', () => {
    expect(runsFootnote(4, 37, null)).toBe(
      'Your 4 longest runs, then 33 shorter ones.'
    );
  });

  it('adds the trend only when runs are lengthening', () => {
    const flat = { earlierAvg: 4, improving: false, recentAvg: 4 };
    expect(runsFootnote(2, 2, flat)).toBe('Every run since you started.');
    expect(
      runsFootnote(2, 2, { earlierAvg: 2.6, improving: true, recentAvg: 5.4 })
    ).toBe(
      'Every run since you started. Recent runs average 5.4 days, up from 2.6.'
    );
  });
});

describe('goalRowMeta', () => {
  it('counts down to the goal, then stops', () => {
    expect(goalRowMeta(run(9, true), 21)).toBe('12 days to go');
    expect(goalRowMeta(run(20, true), 21)).toBe('1 day to go');
    expect(goalRowMeta(run(21, true), 21)).toBe('Goal reached');
    expect(goalRowMeta(undefined, 21)).toBe('21 days to go');
  });
});
