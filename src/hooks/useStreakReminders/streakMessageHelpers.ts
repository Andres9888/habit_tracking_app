export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h || 20, minute: m || 0 };
}

export function getMessageForStreak(
  habitName: string,
  streak: number,
  emoji: string
): { title: string; body: string } {
  if (streak >= 14) {
    return {
      body: `${emoji} Don't break your ${streak}-day streak on ${habitName}! Tap to complete.`,
      title: `🔥 Streak at risk!`,
    };
  }
  if (streak >= 7) {
    return {
      body: `⚡ You're on a roll! ${habitName} streak: ${streak} days. Keep it going!`,
      title: `${emoji} ${habitName}`,
    };
  }
  if (streak >= 3) {
    return {
      body: `${emoji} ${streak}-day streak on ${habitName} — don't stop now!`,
      title: `Keep going!`,
    };
  }
  return {
    body: `Time to build momentum! Complete ${habitName} today.`,
    title: `${emoji} ${habitName}`,
  };
}
