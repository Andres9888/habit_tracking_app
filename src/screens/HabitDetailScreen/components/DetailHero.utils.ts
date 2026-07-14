/** DetailHero utilities — display name + OD header copy helpers */

const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Every day',
  weekly: 'Weekly',
};

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

/** Format "07:15" / "7:15 AM" → "7:15 AM" for the cue line. */
export function formatHeroTimeLabel(raw?: string): string | undefined {
  if (!raw?.trim()) return undefined;
  const t = raw.trim();
  if (/am|pm/i.test(t)) {
    return t
      .replaceAll(/\s+/g, ' ')
      .replaceAll(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
  }
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return t;
  let hour = Number.parseInt(m[1], 10);
  const minute = m[2];
  if (Number.isNaN(hour) || hour < 0 || hour > 23) return t;
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

/**
 * Hero subtitle: "Every day · after coffee" from frequency + implementation cue.
 */
export function buildHeroSubtitle(habit: {
  cueAfterBehavior?: string;
  frequency?: string;
}): string | undefined {
  const parts: string[] = [];
  if (habit.frequency) {
    parts.push(
      FREQUENCY_LABELS[habit.frequency] ??
        habit.frequency
          .split('_')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
    );
  }
  const cue = habit.cueAfterBehavior?.trim();
  if (cue) {
    const withAfter = /^after\b/i.test(cue) ? cue : `after ${cue}`;
    parts.push(withAfter.replace(/^After\b/, 'after'));
  }
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/** "Reminder 7:15 AM" from reminderTime or cueTime. */
export function buildHeroReminderLabel(habit: {
  cueTime?: string;
  reminderTime?: string;
}): string | undefined {
  const display = formatHeroTimeLabel(habit.reminderTime || habit.cueTime);
  return display ? `Reminder ${display}` : undefined;
}
