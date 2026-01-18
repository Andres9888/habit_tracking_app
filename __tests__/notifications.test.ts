import { createDateFromTimeString } from '../src/utils/notifications';

describe('notifications utils', () => {
  describe('createDateFromTimeString', () => {
    it('parses AM/PM times', () => {
      const date = createDateFromTimeString('2:05 PM');
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(5);
    });

    it('parses midnight correctly', () => {
      const date = createDateFromTimeString('12:00 AM');
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
    });

    it('parses 24h times', () => {
      const date = createDateFromTimeString('14:30');
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(30);
    });

    it('falls back when input is invalid', () => {
      const fallback = new Date('2025-01-01T00:00:00');
      fallback.setHours(9, 15, 0, 0);
      const date = createDateFromTimeString('not-a-time', fallback);
      expect(date.getHours()).toBe(9);
      expect(date.getMinutes()).toBe(15);
    });
  });
});


