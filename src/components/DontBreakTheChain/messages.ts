/**
 * Gentle nudge copy for "Don't break the chain" messages.
 *
 * Tone: encouraging, never guilt-tripping.
 * Varies by streak length to stay fresh.
 */

interface NudgeMessage {
  title: string;
  subtitle: string;
  emoji: string;
}

const NUDGE_MESSAGES: NudgeMessage[] = [
  // Short streaks (3-6 days)
  {
    title: "You're building momentum!",
    subtitle: 'Keep the chain going — every day counts.',
    emoji: '🔗',
  },
  {
    title: 'Nice streak forming!',
    subtitle: "Don't let today be the gap. You've got this.",
    emoji: '⛓️',
  },
  // Medium streaks (7-13 days)
  {
    title: 'A full week and counting!',
    subtitle: "That's real dedication. Keep the chain alive!",
    emoji: '🔥',
  },
  {
    title: "You're on a roll!",
    subtitle: 'Future you will thank present you. Keep going.',
    emoji: '💫',
  },
  // Strong streaks (14-29 days)
  {
    title: 'Two weeks strong!',
    subtitle: 'This is becoming who you are. One more day.',
    emoji: '⚡',
  },
  {
    title: "Consistency is your superpower",
    subtitle: "You've proven you can do this. Don't stop now.",
    emoji: '🦸',
  },
  // Long streaks (30+ days)
  {
    title: 'Unstoppable!',
    subtitle: "A streak this good deserves to keep going.",
    emoji: '🏆',
  },
  {
    title: 'Legend in the making',
    subtitle: 'Every champion was once someone who refused to quit.',
    emoji: '👑',
  },
];

function getStreakTier(streak: number): number {
  if (streak >= 30) return 3;
  if (streak >= 14) return 2;
  if (streak >= 7) return 1;
  return 0;
}

export function getNudgeMessage(streak: number): NudgeMessage {
  const tier = getStreakTier(streak);
  const tierMessages = NUDGE_MESSAGES.slice(tier * 2, tier * 2 + 2);
  // Alternate based on streak to avoid repetition
  const idx = streak % 2;
  return tierMessages[idx] ?? NUDGE_MESSAGES[0];
}

/**
 * Get a short streak-aware nudge for notifications
 */
export function getNotificationNudge(streak: number, habitName?: string): string {
  const name = habitName ? ` for ${habitName}` : '';
  if (streak >= 30) return `🔥 ${streak}-day streak${name}! Don't let it end today.`;
  if (streak >= 14) return `⚡ ${streak} days strong${name}! Keep the chain alive.`;
  if (streak >= 7) return `💪 ${streak}-day streak${name}! You're on a roll.`;
  return `🔗 ${streak} days in a row${name}! Keep it going.`;
}
