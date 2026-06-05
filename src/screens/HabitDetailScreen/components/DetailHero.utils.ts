/** DetailHero utilities - schedule formatting */

/**
 * Resolve the habit's display name. When a habit has a dedicated icon, a
 * leading emoji in the name is redundant, so strip it. Shared by the hero and
 * the pinned header title so both always show the same label.
 */
export function getHabitDisplayName(habit: {
  icon?: string;
  name?: string;
}): string {
  if (habit.icon)
    return (habit.name ?? '').replace(/^(?![0-9#*])\p{Emoji}\s*/u, '');
  return habit.name ?? 'Habit';
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const TIME_LABELS: Record<string, string> = {
  morning: 'Mornings',
  afternoon: 'Afternoons',
  evening: 'Evenings',
};

/** Format habit frequency + preferredTime into a human-readable string */
export function formatSchedule(habit: {
  daysOfWeek?: number[];
  frequency?: string;
  preferredTime?: string;
}): string | undefined {
  const parts: string[] = [];

  if (habit.frequency === 'daily') {
    parts.push('Daily');
  } else if (habit.frequency === 'weekly' && habit.daysOfWeek?.length) {
    parts.push(habit.daysOfWeek.map((d) => DAY_NAMES[d] ?? '').join(', '));
  } else if (habit.frequency) {
    parts.push(
      habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)
    );
  }

  if (habit.preferredTime && TIME_LABELS[habit.preferredTime]) {
    parts.push(TIME_LABELS[habit.preferredTime]);
  }

  return parts.length > 0 ? parts.join(' \u00B7 ') : undefined;
}
