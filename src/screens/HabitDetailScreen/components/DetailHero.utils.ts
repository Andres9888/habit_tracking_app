/** DetailHero utilities */

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
