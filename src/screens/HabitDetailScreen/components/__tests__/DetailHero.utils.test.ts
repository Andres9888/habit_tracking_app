import {
  buildHeroReminderLabel,
  buildHeroSubtitle,
  formatHeroTimeLabel,
  getHabitDisplayName,
} from '../DetailHero.utils';

describe('DetailHero.utils', () => {
  describe('getHabitDisplayName', () => {
    it('strips leading emoji when icon is set', () => {
      expect(getHabitDisplayName({ icon: '🏃', name: '🏃 Morning Run' })).toBe(
        'Morning Run'
      );
    });

    it('falls back to Habit', () => {
      expect(getHabitDisplayName({})).toBe('Habit');
    });
  });

  describe('formatHeroTimeLabel', () => {
    it('formats 24h times', () => {
      expect(formatHeroTimeLabel('07:15')).toBe('7:15 AM');
      expect(formatHeroTimeLabel('19:00')).toBe('7:00 PM');
    });

    it('normalizes existing am/pm', () => {
      expect(formatHeroTimeLabel('7:15 am')).toBe('7:15 AM');
    });
  });

  describe('buildHeroSubtitle', () => {
    it('builds Every day · after coffee style copy', () => {
      expect(
        buildHeroSubtitle({
          frequency: 'daily',
          cueAfterBehavior: 'coffee',
        })
      ).toBe('Every day · after coffee');
    });

    it('does not double after prefix', () => {
      expect(
        buildHeroSubtitle({
          frequency: 'daily',
          cueAfterBehavior: 'after coffee',
        })
      ).toBe('Every day · after coffee');
    });

    it('returns undefined when empty', () => {
      expect(buildHeroSubtitle({})).toBeUndefined();
    });
  });

  describe('buildHeroReminderLabel', () => {
    it('prefers reminderTime', () => {
      expect(
        buildHeroReminderLabel({ reminderTime: '07:15', cueTime: '8:00 AM' })
      ).toBe('Reminder 7:15 AM');
    });

    it('falls back to cueTime', () => {
      expect(buildHeroReminderLabel({ cueTime: '8:00 AM' })).toBe(
        'Reminder 8:00 AM'
      );
    });
  });
});
