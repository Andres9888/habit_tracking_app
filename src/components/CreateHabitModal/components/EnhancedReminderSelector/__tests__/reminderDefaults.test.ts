/**
 * reminderDefaults tests — snap-to-preset math for the reminder toggle.
 */

import { DEFAULT_PRESETS } from '../constants';
import {
  getNearestPresetTime,
  isUntouchedDefaultTime,
} from '../reminderDefaults';

const at = (hour: number, minute = 0) => {
  const d = new Date(2026, 5, 10);
  d.setHours(hour, minute, 0, 0);
  return d;
};

describe('isUntouchedDefaultTime', () => {
  it('matches the seeded 2:00 PM fallback', () => {
    expect(isUntouchedDefaultTime(at(14, 0))).toBe(true);
  });

  it('rejects any other time', () => {
    expect(isUntouchedDefaultTime(at(14, 1))).toBe(false);
    expect(isUntouchedDefaultTime(at(7, 0))).toBe(false);
    expect(isUntouchedDefaultTime(at(20, 0))).toBe(false);
  });
});

describe('getNearestPresetTime', () => {
  it('picks Morning (7:00) in the early morning', () => {
    const t = getNearestPresetTime(DEFAULT_PRESETS, at(8, 30));
    expect([t.getHours(), t.getMinutes()]).toEqual([7, 0]);
  });

  it('picks Midday (12:00) around lunch', () => {
    const t = getNearestPresetTime(DEFAULT_PRESETS, at(13, 0));
    expect([t.getHours(), t.getMinutes()]).toEqual([12, 0]);
  });

  it('picks Evening (20:00) at night', () => {
    const t = getNearestPresetTime(DEFAULT_PRESETS, at(21, 15));
    expect([t.getHours(), t.getMinutes()]).toEqual([20, 0]);
  });

  it('wraps around midnight (2:00 AM is closer to 7:00 than 20:00)', () => {
    const t = getNearestPresetTime(DEFAULT_PRESETS, at(2, 0));
    expect([t.getHours(), t.getMinutes()]).toEqual([7, 0]);
  });

  it('picks Evening just after midnight (0:30 wraps to 20:00)', () => {
    const t = getNearestPresetTime(DEFAULT_PRESETS, at(0, 30));
    expect([t.getHours(), t.getMinutes()]).toEqual([20, 0]);
  });
});
