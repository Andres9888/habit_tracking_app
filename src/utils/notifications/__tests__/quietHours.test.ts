import {
  isWithinQuietHours,
  clampToQuietHours,
  DEFAULT_QUIET_HOURS,
} from '../quietHours';
import type { QuietHoursConfig } from '../quietHours';

describe('quietHours', () => {
  const config: QuietHoursConfig = { ...DEFAULT_QUIET_HOURS }; // 22:00 – 07:00

  describe('isWithinQuietHours', () => {
    it('returns true for 23:00 (within overnight range)', () => {
      expect(isWithinQuietHours(23, 0, config)).toBe(true);
    });

    it('returns true for 03:00 (within overnight range)', () => {
      expect(isWithinQuietHours(3, 0, config)).toBe(true);
    });

    it('returns false for 12:00 (midday)', () => {
      expect(isWithinQuietHours(12, 0, config)).toBe(false);
    });

    it('returns true for 22:00 (start of quiet hours)', () => {
      expect(isWithinQuietHours(22, 0, config)).toBe(true);
    });

    it('returns false for 07:00 (end of quiet hours)', () => {
      expect(isWithinQuietHours(7, 0, config)).toBe(false);
    });

    it('returns false when quiet hours are disabled', () => {
      expect(isWithinQuietHours(23, 0, { ...config, enabled: false })).toBe(false);
    });

    it('returns false for 08:00', () => {
      expect(isWithinQuietHours(8, 0, config)).toBe(false);
    });

    it('returns false for 20:00', () => {
      expect(isWithinQuietHours(20, 0, config)).toBe(false);
    });
  });

  describe('clampToQuietHours', () => {
    it('returns original time when outside quiet hours', () => {
      expect(clampToQuietHours(15, 30, config)).toEqual({ hour: 15, minute: 30 });
    });

    it('clamps to end of quiet hours when inside', () => {
      expect(clampToQuietHours(23, 45, config)).toEqual({ hour: 7, minute: 0 });
    });

    it('clamps early morning to end of quiet hours', () => {
      expect(clampToQuietHours(3, 0, config)).toEqual({ hour: 7, minute: 0 });
    });
  });
});
