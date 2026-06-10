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

const TIME_LABELS = {
  afternoon: 'Afternoons',
  evening: 'Evenings',
  morning: 'Mornings',
} as const;

export type PreferredTimeKey = keyof typeof TIME_LABELS;

export interface ScheduleParts {
  frequencyLabel?: string;
  time?: { key: PreferredTimeKey; label: string };
}

function isPreferredTimeKey(value: string): value is PreferredTimeKey {
  return value in TIME_LABELS;
}

/**
 * Split habit frequency + preferredTime into chip-ready parts. Habits without
 * an explicit frequency are daily — same default the edit form applies.
 */
export function getScheduleParts(habit: {
  daysOfWeek?: number[];
  frequency?: string;
  preferredTime?: string;
}): ScheduleParts {
  const parts: ScheduleParts = {};

  if (!habit.frequency || habit.frequency === 'daily') {
    parts.frequencyLabel = 'Daily';
  } else if (habit.frequency === 'weekly' && habit.daysOfWeek?.length) {
    parts.frequencyLabel = habit.daysOfWeek
      .map((d) => DAY_NAMES[d] ?? '')
      .join(', ');
  } else if (habit.frequency) {
    parts.frequencyLabel =
      habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
  }

  if (habit.preferredTime && isPreferredTimeKey(habit.preferredTime)) {
    parts.time = {
      key: habit.preferredTime,
      label: TIME_LABELS[habit.preferredTime],
    };
  }

  return parts;
}
