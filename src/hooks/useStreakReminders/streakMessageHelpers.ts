export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h || 20, minute: m || 0 };
}

/**
 * Pick a random item from an array using the current day as a seed
 * so the message stays consistent within a day but varies across days.
 */
function dailyRandom<T>(items: T[]): T {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return items[dayOfYear % items.length];
}

export function getMessageForStreak(
  habitName: string,
  streak: number,
  emoji: string
): { title: string; body: string } {
  if (streak >= 30) {
    return dailyRandom([
      {
        body: `${emoji} Your ${streak}-day streak on ${habitName} is incredible. Don't let it end today!`,
        title: `🏆 Protect your legacy!`,
      },
      {
        body: `${emoji} ${streak} days of ${habitName} — you're in rare company. Keep going!`,
        title: `💎 Elite streak!`,
      },
    ]);
  }
  if (streak >= 14) {
    return dailyRandom([
      {
        body: `${emoji} Don't break your ${streak}-day streak on ${habitName}! Tap to complete.`,
        title: `🔥 Streak at risk!`,
      },
      {
        body: `${emoji} ${streak} days strong! ${habitName} is becoming part of who you are.`,
        title: `💪 Keep the chain!`,
      },
    ]);
  }
  if (streak >= 7) {
    return dailyRandom([
      {
        body: `⚡ You're on a roll! ${habitName} streak: ${streak} days. Keep it going!`,
        title: `${emoji} ${habitName}`,
      },
      {
        body: `🔥 ${streak} days of ${habitName}! You're building something real.`,
        title: `${emoji} Don't break the chain!`,
      },
    ]);
  }
  if (streak >= 3) {
    return dailyRandom([
      {
        body: `${emoji} ${streak}-day streak on ${habitName} — don't stop now!`,
        title: `Keep going!`,
      },
      {
        body: `${emoji} ${streak} days in a row! ${habitName} is becoming a habit.`,
        title: `You're on fire!`,
      },
    ]);
  }
  return dailyRandom([
    {
      body: `Time to build momentum! Complete ${habitName} today.`,
      title: `${emoji} ${habitName}`,
    },
    {
      body: `Every streak starts with Day 1. Complete ${habitName} now!`,
      title: `${emoji} Start today!`,
    },
  ]);
}
