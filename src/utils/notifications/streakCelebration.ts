/**
 * Streak Celebration Notifications
 *
 * Fires when a user hits a milestone streak (7, 14, 21, 30, 50, 100, 365 days).
 * Celebrates the achievement and reinforces the habit loop.
 *
 * Scientific Basis:
 * - Variable ratio reinforcement: Milestone celebrations at increasing intervals
 * - Self-efficacy (Bandura): Acknowledging progress increases confidence
 */

import * as Notifications from 'expo-notifications';

const STREAK_CELEBRATION_PREFIX = 'streak-celebration-';

/** Milestone thresholds that trigger celebrations */
export const STREAK_MILESTONES = [7, 14, 21, 30, 50, 100, 200, 365] as const;

export interface ScheduleStreakCelebrationParams {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  milestone: number;
}

const MILESTONE_MESSAGES: Record<number, { title: string; body: string }> = {
  7: {
    title: '🎉 One week strong!',
    body: 'You just hit 7 days of {habit}. The first week is the hardest — you crushed it!',
  },
  14: {
    title: '⚡ Two weeks!',
    body: '{habit} is becoming second nature. 14 days in a row — keep the momentum!',
  },
  21: {
    title: '🧠 Habit forming!',
    body: 'Research says 21 days builds a habit. {habit} is now part of who you are!',
  },
  30: {
    title: '🏆 30-day champion!',
    body: 'A full month of {habit}! Only 8% of people make it this far. You\'re exceptional.',
  },
  50: {
    title: '🔥 50 days!',
    body: '{habit} is on autopilot. 50 days of consistency is truly remarkable!',
  },
  100: {
    title: '💯 Triple digits!',
    body: '100 days of {habit}! This is elite-level dedication. You should be incredibly proud.',
  },
  200: {
    title: '🌟 200 days!',
    body: '{habit} for 200 days straight. You\'ve transformed this from a goal into a lifestyle.',
  },
  365: {
    title: '👑 One full year!',
    body: '365 days of {habit}! An entire year of consistency. This is legendary.',
  },
};

/**
 * Check if a streak count is a celebration milestone
 */
export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak as (typeof STREAK_MILESTONES)[number]);
}

/**
 * Send an immediate streak celebration notification
 */
export async function sendStreakCelebrationNotification({
  habitId,
  habitName,
  habitEmoji = '🔗',
  milestone,
}: ScheduleStreakCelebrationParams): Promise<boolean> {
  try {
    const message = MILESTONE_MESSAGES[milestone];
    if (!message) return false;

    const title = message.title;
    const body = message.body.replace('{habit}', `${habitEmoji} ${habitName}`);

    await Notifications.scheduleNotificationAsync({
      content: {
        body,
        data: {
          habitId,
          milestone,
          type: 'streakCelebration',
        },
        sound: 'default',
        title,
      },
      identifier: `${STREAK_CELEBRATION_PREFIX}${habitId}-${milestone}`,
      trigger: null, // Immediate
    });

    return true;
  } catch (error) {
    if (__DEV__)
      console.warn('sendStreakCelebrationNotification failed', { error, habitId });
    return false;
  }
}
