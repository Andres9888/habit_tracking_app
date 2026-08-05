/**
 * Unit tests for withDecayedStrength — closed-form decay applied to stored
 * strength so reads reflect elapsed missed days since last recalculation.
 */
import { withDecayedStrength } from '../../../convex/habitStrength/decayAdjustment';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('withDecayedStrength', () => {
  it('returns habit unchanged when strengthUpdatedAt is missing', () => {
    const habit = { strength: 0.8, strengthLevel: 'strong' };
    expect(withDecayedStrength(habit)).toBe(habit);
  });

  it('returns habit unchanged when strength is undefined or zero', () => {
    const a = { strengthUpdatedAt: Date.now() - 30 * DAY_MS };
    const b = { strength: 0, strengthUpdatedAt: Date.now() - 30 * DAY_MS };
    expect(withDecayedStrength(a)).toBe(a);
    expect(withDecayedStrength(b)).toBe(b);
  });

  it('returns habit unchanged when updated today (no full day elapsed)', () => {
    const now = Date.now();
    const habit = {
      strength: 0.8,
      strengthLevel: 'strong',
      strengthUpdatedAt: now - 6 * 60 * 60 * 1000,
    };
    expect(withDecayedStrength(habit, now)).toBe(habit);
  });

  it('applies balanced 2%/day decay over 30 days', () => {
    const now = Date.now();
    const habit = {
      strength: 0.8,
      strengthAlgorithm: 'balanced' as const,
      strengthLevel: 'strong',
      strengthUpdatedAt: now - 30 * DAY_MS,
    };
    const result = withDecayedStrength(habit, now);
    expect(result.strength).toBeCloseTo(0.8 * 0.98 ** 30, 4);
    expect(result.strengthLevel).toBe('building');
  });

  it('uses strict 4%/day decay when habit set to strict', () => {
    const now = Date.now();
    const habit = {
      strength: 0.9,
      strengthAlgorithm: 'strict' as const,
      strengthLevel: 'automatic',
      strengthUpdatedAt: now - 10 * DAY_MS,
    };
    const result = withDecayedStrength(habit, now);
    expect(result.strength).toBeCloseTo(0.9 * 0.96 ** 10, 4);
  });

  it('falls back to balanced for unknown algorithm', () => {
    const now = Date.now();
    const habit = {
      strength: 0.5,
      strengthAlgorithm: 'nonsense',
      strengthUpdatedAt: now - 10 * DAY_MS,
    };
    const result = withDecayedStrength(habit, now);
    expect(result.strength).toBeCloseTo(0.5 * 0.98 ** 10, 4);
  });

  it('clamps decay window at 3650 days', () => {
    const now = Date.now();
    const habit = {
      strength: 0.5,
      strengthAlgorithm: 'balanced' as const,
      strengthUpdatedAt: now - 5000 * DAY_MS,
    };
    const result = withDecayedStrength(habit, now);
    expect(result.strength).toBeCloseTo(0.5 * 0.98 ** 3650, 6);
  });

  it('preserves non-strength fields on the habit', () => {
    const now = Date.now();
    const habit = {
      _id: 'habit_abc',
      name: 'Meditate',
      strength: 0.8,
      strengthAlgorithm: 'balanced' as const,
      strengthLevel: 'strong',
      strengthUpdatedAt: now - 30 * DAY_MS,
    };
    const result = withDecayedStrength(habit, now);
    expect(result._id).toBe('habit_abc');
    expect(result.name).toBe('Meditate');
  });
});
