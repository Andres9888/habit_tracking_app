/**
 * Morning Motivation Notifications
 *
 * Schedules a daily morning notification with an inspirational quote
 * to kick off the day. Respects quiet hours by default (fires at 7:30 AM).
 *
 * Built by Opus.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';
import { isWithinQuietHours } from './quietHours';

const MORNING_MOTIVATION_ID = 'morning-motivation';

const MOTIVATIONAL_QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Robin Sharma' },
  { text: "You don't have to be extreme, just consistent.", author: 'Unknown' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'We are what we repeatedly do. Excellence is not an act, but a habit.', author: 'Aristotle' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Rohn' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Your habits shape your identity, and your identity shapes your habits.', author: 'James Clear' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'Every morning brings new potential, but if you dwell on the misfortunes of the day before, you tend to overlook tremendous opportunities.', author: 'Harvey Mackay' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  { text: 'What you do every day matters more than what you do once in a while.', author: 'Gretchen Rubin' },
  { text: 'Progress, not perfection, is what we should be asking of ourselves.', author: 'Julia Cameron' },
  { text: 'You will never change your life until you change something you do daily.', author: 'John C. Maxwell' },
  { text: 'First forget inspiration. Habit is more dependable.', author: 'Octavia Butler' },
  { text: 'Be patient with yourself. Self-growth is tender; it is holy ground.', author: 'Stephen Covey' },
  { text: 'Champions keep playing until they get it right.', author: 'Billie Jean King' },
  { text: 'The chains of habit are too weak to be felt until they are too strong to be broken.', author: 'Samuel Johnson' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Each day provides its own gifts.', author: 'Marcus Aurelius' },
  { text: 'Consistency is the true foundation of trust.', author: 'Roy T. Bennett' },
  { text: 'One small positive thought in the morning can change your whole day.', author: 'Dalai Lama' },
  { text: 'The power of imagination makes us infinite.', author: 'John Muir' },
  { text: 'Habits are the compound interest of self-improvement.', author: 'James Clear' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { text: 'Rise up, start fresh, see the bright opportunity in each new day.', author: 'Unknown' },
];

/**
 * Get today's quote — deterministic based on day of year so every user
 * sees a different quote each day but the same quote on the same day.
 */
export function getTodaysQuote(): { text: string; author: string } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

export interface ScheduleMorningMotivationParams {
  /** Hour to fire (default 7) */
  hour?: number;
  /** Minute to fire (default 30) */
  minute?: number;
  /** Active habit count to personalise the message */
  activeHabitCount?: number;
}

/**
 * Schedule a daily morning motivation notification.
 */
export async function scheduleMorningMotivation({
  hour = 7,
  minute = 30,
  activeHabitCount,
}: ScheduleMorningMotivationParams = {}): Promise<boolean> {
  try {
    // Validate the time isn't in quiet hours
    if (isWithinQuietHours(hour, minute)) {
      // Push to first non-quiet hour (7:00 AM)
      hour = 7;
      minute = 0;
    }

    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    await cancelMorningMotivation();

    const quote = getTodaysQuote();
    const habitSuffix =
      activeHabitCount && activeHabitCount > 0
        ? ` You have ${activeHabitCount} habit${activeHabitCount > 1 ? 's' : ''} to conquer today!`
        : '';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good morning!',
        body: `"${quote.text}" — ${quote.author}${habitSuffix}`,
        data: { type: 'morningMotivation' },
        sound: 'default',
      },
      identifier: MORNING_MOTIVATION_ID,
      trigger: {
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : {}),
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__) console.warn('scheduleMorningMotivation failed', error);
    return false;
  }
}

/**
 * Cancel the morning motivation notification.
 */
export async function cancelMorningMotivation(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(MORNING_MOTIVATION_ID);
  } catch {
    // May not exist
  }
}
