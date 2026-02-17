/**
 * Tests for useHabitTimeGroups grouping logic.
 */

import { getTimeGroup } from '../useHabitTimeGroups';

// Minimal habit-like objects for testing
const makeHabit = (overrides: Record<string, unknown> = {}) =>
  ({
    _id: 'test-id',
    _creationTime: Date.now(),
    name: 'Test Habit',
    createdAt: Date.now(),
    ...overrides,
  }) as any;

describe('getTimeGroup', () => {
  it('returns morning for preferredTime "morning"', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'morning' }))).toBe('morning');
  });

  it('returns afternoon for preferredTime "afternoon"', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'afternoon' }))).toBe('afternoon');
  });

  it('returns evening for preferredTime "evening"', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'evening' }))).toBe('evening');
  });

  it('maps phase1_push to morning', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'phase1_push' }))).toBe('morning');
  });

  it('maps phase2_pivot to afternoon', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'phase2_pivot' }))).toBe('afternoon');
  });

  it('maps phase3_pull to evening', () => {
    expect(getTimeGroup(makeHabit({ preferredTime: 'phase3_pull' }))).toBe('evening');
  });

  it('infers morning from reminderTime "7:00 AM"', () => {
    expect(getTimeGroup(makeHabit({ reminderTime: '7:00 AM' }))).toBe('morning');
  });

  it('infers afternoon from reminderTime "2:00 PM"', () => {
    expect(getTimeGroup(makeHabit({ reminderTime: '2:00 PM' }))).toBe('afternoon');
  });

  it('infers evening from reminderTime "8:00 PM"', () => {
    expect(getTimeGroup(makeHabit({ reminderTime: '8:00 PM' }))).toBe('evening');
  });

  it('returns anytime when no time info is set', () => {
    expect(getTimeGroup(makeHabit({}))).toBe('anytime');
  });

  it('manual timeGroup overrides preferredTime', () => {
    expect(
      getTimeGroup(makeHabit({ preferredTime: 'morning', timeGroup: 'evening' }))
    ).toBe('evening');
  });
});
