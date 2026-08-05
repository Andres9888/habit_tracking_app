/**
 * Date Parsing Tests
 *
 * Tests timezone-safe date parsing to ensure dates don't shift
 * across timezones or DST transitions.
 */

describe('Date Parsing - Timezone Safety', () => {
  describe('Local timezone parsing', () => {
    it('should parse YYYY-MM-DD as local date, not UTC', () => {
      const dateString = '2025-10-05';

      // WRONG way (causes timezone shifts)
      const wrongDate = new Date(dateString);

      // CORRECT way (our implementation)
      const [year, month, day] = dateString.split('-').map(Number);
      const correctDate = new Date(year, month - 1, day);

      // The correct method should create a date at midnight local time
      correctDate.setHours(0, 0, 0, 0);

      expect(correctDate.getFullYear()).toBe(2025);
      expect(correctDate.getMonth()).toBe(9); // October (0-indexed)
      expect(correctDate.getDate()).toBe(5);
      expect(correctDate.getHours()).toBe(0);
    });

    it('should handle month boundaries correctly', () => {
      const dateString = '2025-03-31'; // Last day of March
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(2); // March
      expect(date.getDate()).toBe(31);
    });

    it('should handle year boundaries correctly', () => {
      const dateString = '2025-12-31'; // Last day of year
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(11); // December
      expect(date.getDate()).toBe(31);
    });

    it('should handle leap year dates correctly', () => {
      const dateString = '2024-02-29'; // Leap year
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(1); // February
      expect(date.getDate()).toBe(29);
    });
  });

  describe('Date comparison logic', () => {
    beforeEach(() => {
      // Mock current date to October 5, 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-10-05T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should correctly identify past dates', () => {
      const pastDateString = '2025-10-04';
      const [year, month, day] = pastDateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();

      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      expect(date < today).toBe(true);
    });

    it('should correctly identify today', () => {
      const todayString = '2025-10-05';
      const [year, month, day] = todayString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();

      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      expect(date.getTime()).toBe(today.getTime());
    });

    it('should correctly identify future dates', () => {
      const futureDateString = '2025-10-06';
      const [year, month, day] = futureDateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();

      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      expect(date > today).toBe(true);
    });
  });

  describe('getHabitStatus date parsing', () => {
    const mockTracking = [
      { habitId: 'habit1', date: '2025-10-01', completed: true },
      { habitId: 'habit1', date: '2025-10-03', completed: true },
    ];

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-10-05T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const getHabitStatus = (
      habitId: string,
      dateString: string
    ): 'done' | 'missed' | 'planned' => {
      const trackingEntry = mockTracking.find(
        (t) => t.habitId === habitId && t.date === dateString
      );

      // Parse date in local timezone to avoid timezone shifting
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (trackingEntry?.completed) return 'done';
      if (date < today) return 'missed';
      return 'planned';
    };

    it('should return "done" for completed habits', () => {
      expect(getHabitStatus('habit1', '2025-10-01')).toBe('done');
      expect(getHabitStatus('habit1', '2025-10-03')).toBe('done');
    });

    it('should return "missed" for past uncompleted habits', () => {
      expect(getHabitStatus('habit1', '2025-10-02')).toBe('missed');
      expect(getHabitStatus('habit1', '2025-10-04')).toBe('missed');
    });

    it('should return "planned" for today', () => {
      expect(getHabitStatus('habit1', '2025-10-05')).toBe('planned');
    });

    it('should return "planned" for future dates', () => {
      expect(getHabitStatus('habit1', '2025-10-06')).toBe('planned');
      expect(getHabitStatus('habit1', '2025-10-07')).toBe('planned');
    });
  });

  describe('Edge cases', () => {
    it('should handle midnight correctly', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-10-05T00:00:00')); // Exactly midnight

      const todayString = '2025-10-05';
      const [year, month, day] = todayString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();

      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      expect(date.getTime()).toBe(today.getTime());

      jest.useRealTimers();
    });

    it('should handle end of day correctly', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-10-05T23:59:59')); // End of day

      const todayString = '2025-10-05';
      const [year, month, day] = todayString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();

      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      expect(date.getTime()).toBe(today.getTime());

      jest.useRealTimers();
    });
  });
});
