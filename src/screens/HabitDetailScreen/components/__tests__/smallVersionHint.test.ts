/**
 * The recovery slot's action line. The old copy pasted the habit name into
 * "Try two minutes of {name}", which reads as nonsense for a rule or abstinence
 * habit ("Try two minutes of 24-Hour Purchase Rule"). The name never appears
 * again — that is the assertion this file exists for.
 */
import type { Habit } from '../../../../features/habits/types';
import { smallVersionHint } from '../DetailHeroBanner/DetailHeroBanner.utils';

const NEUTRAL_FALLBACK =
  'Do the smallest version you’d still call done. It counts.';

function habitWith(overrides: Partial<Habit>): Habit {
  return { name: '24-Hour Purchase Rule', ...overrides } as unknown as Habit;
}

describe('smallVersionHint', () => {
  it('prefers the authored small version and trims it', () => {
    expect(
      smallVersionHint(
        habitWith({ startSmallVersion: '  Put the item back on the shelf.  ' })
      )
    ).toBe('Put the item back on the shelf.');
  });

  it('falls back to the type-neutral line when none is authored', () => {
    expect(smallVersionHint(habitWith({}))).toBe(NEUTRAL_FALLBACK);
    expect(smallVersionHint(habitWith({ startSmallVersion: '   ' }))).toBe(
      NEUTRAL_FALLBACK
    );
  });

  it('never pastes the habit name into the hint', () => {
    for (const habit of [
      habitWith({}),
      habitWith({ startSmallVersion: 'Wait one hour before buying.' }),
    ]) {
      expect(smallVersionHint(habit)).not.toContain('24-Hour Purchase Rule');
    }
  });
});
