/**
 * Notification Copy Generator
 *
 * Generates motivating notification messages that leverage:
 * - Chain psychology (don't break the chain!)
 * - Streak awareness
 * - Loss aversion
 * - Implementation intentions
 */

export type NotificationStyle = 'motivating' | 'neutral' | 'urgent';

interface GenerateNotificationCopyParams {
  habitName: string;
  currentStreak?: number;
  style?: NotificationStyle;
  customMessage?: string;
}

interface NotificationCopy {
  title: string;
  body: string;
}

/**
 * Generate notification copy based on habit context and user preferences
 */
export function generateNotificationCopy({
  habitName,
  currentStreak = 0,
  style = 'motivating',
  customMessage,
}: GenerateNotificationCopyParams): NotificationCopy {
  // Use custom message if provided
  if (customMessage && customMessage.trim()) {
    return {
      title: habitName,
      body: customMessage.trim(),
    };
  }

  switch (style) {
    case 'urgent':
      return generateUrgenCopy(habitName, currentStreak);
    case 'neutral':
      return generateNeutralCopy(habitName);
    case 'motivating':
    default:
      return generateMotivatingCopy(habitName, currentStreak);
  }
}

function generateNeutralCopy(habitName: string): NotificationCopy {
  return {
    title: habitName,
    body: 'Time to check in on your habit progress!',
  };
}

function generateMotivatingCopy(
  habitName: string,
  currentStreak: number
): NotificationCopy {
  // No streak yet - focus on starting
  if (currentStreak === 0) {
    const bodies = [
      'Ready to build your chain? 🔗',
      'Every chain starts with the first link!',
      "Let's start building something great!",
      'Time to take action! 💪',
    ];
    return {
      title: habitName,
      body: bodies[Math.floor(Math.random() * bodies.length)],
    };
  }

  // Short streak (1-6 days) - encourage continuation
  if (currentStreak <= 6) {
    const bodies = [
      `Keep the momentum going! ${currentStreak} day streak 🔥`,
      `You're on a roll! ${currentStreak} days strong 💪`,
      `${currentStreak} days and counting! Let's keep it up!`,
      `Day ${currentStreak} - you're building something great!`,
    ];
    return {
      title: habitName,
      body: bodies[Math.floor(Math.random() * bodies.length)],
    };
  }

  // Significant streak (7+ days) - emphasize not breaking it
  const bodies = [
    `${currentStreak} day streak! Don't break the chain! 🔗`,
    `${currentStreak} days strong - keep your streak alive! 🔥`,
    `You've done ${currentStreak} days - keep it going!`,
    `${currentStreak} day chain - one more link! 💪`,
  ];

  return {
    title: habitName,
    body: bodies[Math.floor(Math.random() * bodies.length)],
  };
}

function generateUrgenCopy(
  habitName: string,
  currentStreak: number
): NotificationCopy {
  if (currentStreak === 0) {
    return {
      title: habitName,
      body: "Time's running out - check in now!",
    };
  }

  if (currentStreak <= 6) {
    return {
      title: habitName,
      body: `${currentStreak} day streak at risk - check in now! ⏰`,
    };
  }

  return {
    title: habitName,
    body: `Don't lose your ${currentStreak} day streak! Check in now! 🚨`,
  };
}

/**
 * Validate custom notification message
 * Returns error message if invalid, null if valid
 */
export function validateCustomMessage(message: string): string | null {
  if (!message || !message.trim()) {
    return null; // Empty is OK, will use default
  }

  const trimmed = message.trim();

  if (trimmed.length < 3) {
    return 'Message must be at least 3 characters';
  }

  if (trimmed.length > 100) {
    return 'Message must be 100 characters or less';
  }

  return null;
}
