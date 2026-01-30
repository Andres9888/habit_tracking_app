/**
 * V11: Time-Aware Reminder Defaults Tests
 *
 * Tests the smart reminder default selection logic that adapts to current time of day.
 */

import { getSmartReminderDefault } from '../reminderDefaults';

describe('getSmartReminderDefault', () => {
  // Save original Date implementation
  const RealDate = Date;

  const mockDate = (hour: number, minute = 0) => {
    const mockNow = new Date(2024, 0, 1, hour, minute, 0);
    global.Date = class extends RealDate {
      constructor() {
        super();
        return mockNow;
      }
      static now() {
        return mockNow.getTime();
      }
    } as DateConstructor;
  };

  afterEach(() => {
    // Restore original Date after each test
    global.Date = RealDate;
  });

  describe('Midnight to Morning (12 AM - 7 AM)', () => {
    it('should return "morning" at midnight (12:00 AM)', () => {
      mockDate(0, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 1:00 AM', () => {
      mockDate(1, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 3:30 AM', () => {
      mockDate(3, 30);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 6:00 AM', () => {
      mockDate(6, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 6:59 AM (edge case)', () => {
      mockDate(6, 59);
      expect(getSmartReminderDefault()).toBe('morning');
    });
  });

  describe('Morning to Midday (7 AM - 12 PM)', () => {
    it('should return "midday" at 7:00 AM (boundary)', () => {
      mockDate(7, 0);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should return "midday" at 8:00 AM', () => {
      mockDate(8, 0);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should return "midday" at 9:30 AM', () => {
      mockDate(9, 30);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should return "midday" at 11:00 AM', () => {
      mockDate(11, 0);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should return "midday" at 11:59 AM (edge case)', () => {
      mockDate(11, 59);
      expect(getSmartReminderDefault()).toBe('midday');
    });
  });

  describe('Midday to Evening (12 PM - 8 PM)', () => {
    it('should return "evening" at 12:00 PM (noon boundary)', () => {
      mockDate(12, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should return "evening" at 1:00 PM', () => {
      mockDate(13, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should return "evening" at 3:00 PM', () => {
      mockDate(15, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should return "evening" at 5:00 PM', () => {
      mockDate(17, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should return "evening" at 7:30 PM', () => {
      mockDate(19, 30);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should return "evening" at 7:59 PM (edge case)', () => {
      mockDate(19, 59);
      expect(getSmartReminderDefault()).toBe('evening');
    });
  });

  describe('Evening to Midnight (8 PM - 12 AM)', () => {
    it('should return "morning" at 8:00 PM (boundary)', () => {
      mockDate(20, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 9:00 PM', () => {
      mockDate(21, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 10:30 PM', () => {
      mockDate(22, 30);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 11:00 PM', () => {
      mockDate(23, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should return "morning" at 11:59 PM (edge case)', () => {
      mockDate(23, 59);
      expect(getSmartReminderDefault()).toBe('morning');
    });
  });

  describe('Boundary transitions', () => {
    it('should transition from "morning" to "midday" at 7:00 AM', () => {
      mockDate(6, 59);
      expect(getSmartReminderDefault()).toBe('morning');

      mockDate(7, 0);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should transition from "midday" to "evening" at 12:00 PM', () => {
      mockDate(11, 59);
      expect(getSmartReminderDefault()).toBe('midday');

      mockDate(12, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should transition from "evening" to "morning" at 8:00 PM', () => {
      mockDate(19, 59);
      expect(getSmartReminderDefault()).toBe('evening');

      mockDate(20, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });
  });

  describe('Real-world scenarios', () => {
    it('should suggest midday when creating habit during morning commute (7:30 AM)', () => {
      mockDate(7, 30);
      expect(getSmartReminderDefault()).toBe('midday');
    });

    it('should suggest evening when creating habit during lunch break (12:30 PM)', () => {
      mockDate(12, 30);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should suggest evening when creating habit during afternoon (3:00 PM)', () => {
      mockDate(15, 0);
      expect(getSmartReminderDefault()).toBe('evening');
    });

    it('should suggest morning when creating habit before bed (10:00 PM)', () => {
      mockDate(22, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });

    it('should suggest morning when creating habit late night (2:00 AM)', () => {
      mockDate(2, 0);
      expect(getSmartReminderDefault()).toBe('morning');
    });
  });

  describe('Type safety', () => {
    it('should return a valid ReminderOption type', () => {
      mockDate(12, 0);
      const result = getSmartReminderDefault();
      expect(['none', 'morning', 'midday', 'evening']).toContain(result);
    });

    it('should never return "none" (always suggests a time)', () => {
      // Test multiple hours throughout the day
      for (let hour = 0; hour < 24; hour++) {
        mockDate(hour, 0);
        const result = getSmartReminderDefault();
        expect(result).not.toBe('none');
      }
    });
  });

  describe('Coverage across all 24 hours', () => {
    it('should return valid reminder for every hour of the day', () => {
      const validOptions = ['morning', 'midday', 'evening'];

      for (let hour = 0; hour < 24; hour++) {
        mockDate(hour, 0);
        const result = getSmartReminderDefault();
        expect(validOptions).toContain(result);
      }
    });

    it('should follow expected distribution pattern', () => {
      const results: Record<string, number> = {
        morning: 0,
        midday: 0,
        evening: 0,
      };

      for (let hour = 0; hour < 24; hour++) {
        mockDate(hour, 0);
        const result = getSmartReminderDefault();
        results[result] = (results[result] || 0) + 1;
      }

      // Expected distribution based on logic:
      // morning: 0-6 (7 hours) + 20-23 (4 hours) = 11 hours
      // midday: 7-11 (5 hours)
      // evening: 12-19 (8 hours)
      expect(results.morning).toBe(11);
      expect(results.midday).toBe(5);
      expect(results.evening).toBe(8);
    });
  });
});
