/**
 * Tests for notification copy generator
 */
import { generateNotificationCopy, validateCustomMessage } from '../copy';

describe('generateNotificationCopy', () => {
  describe('neutral style', () => {
    it('returns simple reminder for all streak levels', () => {
      const result = generateNotificationCopy({
        habitName: 'Exercise',
        currentStreak: 0,
        style: 'neutral',
      });

      expect(result.title).toBe('Exercise');
      expect(result.body).toBe('Time to check in on your habit progress!');
    });
  });

  describe('motivating style', () => {
    it('encourages starting for zero streak', () => {
      const result = generateNotificationCopy({
        habitName: 'Meditation',
        currentStreak: 0,
        style: 'motivating',
      });

      expect(result.title).toBe('Meditation');
      expect(result.body).toMatch(/chain|action|build/i);
    });

    it('encourages continuation for short streaks (1-6 days)', () => {
      const result = generateNotificationCopy({
        habitName: 'Reading',
        currentStreak: 3,
        style: 'motivating',
      });

      expect(result.title).toBe('Reading');
      expect(result.body).toContain('3');
    });

    it('emphasizes not breaking chain for long streaks (7+ days)', () => {
      const result = generateNotificationCopy({
        habitName: 'Journaling',
        currentStreak: 14,
        style: 'motivating',
      });

      expect(result.title).toBe('Journaling');
      expect(result.body).toContain('14');
      expect(result.body.toLowerCase()).toMatch(/chain|streak/);
    });
  });

  describe('urgent style', () => {
    it('uses urgent language', () => {
      const result = generateNotificationCopy({
        habitName: 'Workout',
        currentStreak: 10,
        style: 'urgent',
      });

      expect(result.title).toBe('Workout');
      expect(result.body.toLowerCase()).toMatch(/don't lose|check in now/);
    });
  });

  describe('custom message', () => {
    it('uses custom message when provided', () => {
      const customMessage = 'Your future self will thank you!';
      const result = generateNotificationCopy({
        habitName: 'Study',
        currentStreak: 5,
        style: 'motivating',
        customMessage,
      });

      expect(result.title).toBe('Study');
      expect(result.body).toBe(customMessage);
    });

    it('trims custom message', () => {
      const result = generateNotificationCopy({
        habitName: 'Running',
        currentStreak: 0,
        customMessage: '  Go run!  ',
      });

      expect(result.body).toBe('Go run!');
    });
  });
});

describe('validateCustomMessage', () => {
  it('accepts null/empty as valid', () => {
    expect(validateCustomMessage('')).toBeNull();
    expect(validateCustomMessage('   ')).toBeNull();
  });

  it('rejects messages under 3 characters', () => {
    expect(validateCustomMessage('Hi')).toMatch(/at least 3 characters/);
  });

  it('rejects messages over 100 characters', () => {
    const longMessage = 'a'.repeat(101);
    expect(validateCustomMessage(longMessage)).toMatch(/100 characters or less/);
  });

  it('accepts valid messages', () => {
    expect(validateCustomMessage('Time to shine!')).toBeNull();
    expect(validateCustomMessage('Keep going, you got this!')).toBeNull();
  });
});
