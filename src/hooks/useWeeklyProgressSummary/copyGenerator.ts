/**
 * Weekly Progress Summary Copy Generator
 *
 * Generates notification titles, bodies, and short summaries
 * based on weekly completion data.
 */

interface SummaryData {
  completionRate: number;
  totalCompleted: number;
  totalPossible: number;
  perfectDays: number;
  longestStreak: number;
  habitsImproved: number;
  bestDay: { dayName: string; completionRate: number } | null;
}

export function generateNotificationTitle(
  completionRate: number,
  perfectDays: number
): string {
  if (completionRate === 100) return '🏆 Perfect Week! You crushed it!';
  if (completionRate >= 90) return '🔥 Incredible week! Almost perfect!';
  if (completionRate >= 75) return '💪 Strong week! Keep it up!';
  if (perfectDays >= 3) return `⭐ ${perfectDays} perfect days this week!`;
  if (completionRate >= 50) return '📈 Solid progress this week!';
  if (completionRate >= 25) return '🌱 Every step counts — here\'s your week';
  return '📊 Your weekly progress is ready';
}

export function generateNotificationBody(data: SummaryData): string {
  const lines: string[] = [];

  lines.push(
    `You completed ${data.totalCompleted} of ${data.totalPossible} habits (${data.completionRate}%).`
  );

  if (data.perfectDays > 0) {
    lines.push(
      `${data.perfectDays} perfect day${data.perfectDays > 1 ? 's' : ''} — nice work! 🎯`
    );
  }

  if (data.longestStreak >= 7) {
    lines.push(`Your longest streak is ${data.longestStreak} days! 🔥`);
  }

  if (data.habitsImproved > 0) {
    lines.push(
      `${data.habitsImproved} habit${data.habitsImproved > 1 ? 's' : ''} improved from last week! 📈`
    );
  }

  if (data.bestDay) {
    lines.push(
      `${data.bestDay.dayName} was your best day (${data.bestDay.completionRate}%).`
    );
  }

  // Motivational closer
  if (data.completionRate >= 75) {
    lines.push("Keep this momentum going! 🚀");
  } else if (data.completionRate >= 40) {
    lines.push("You're building great habits. Aim a little higher next week! 💫");
  } else {
    lines.push("Every day is a new chance. Let's make next week count! 🌟");
  }

  return lines.join('\n');
}

export function generateShortSummary(
  completionRate: number,
  totalCompleted: number
): string {
  return `${completionRate}% · ${totalCompleted} habits completed`;
}
