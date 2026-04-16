import { format } from 'date-fns';
import { colors } from '@/theme/colors';

export const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

type CompletionMap = Record<string, { completed: number; total: number }>;

/** Returns a dot color based on completion status, or undefined if no dot */
export function getDotColor(
  date: Date,
  completionByDay: CompletionMap
): string | undefined {
  const key = format(date, 'yyyy-MM-dd');
  const day = completionByDay[key];
  if (!day || day.total === 0) return;
  if (day.completed === day.total) return colors.primary[500];
  if (day.completed > 0) return colors.streak[300];
  return;
}

/** Returns theme-aware colors for the mini calendar */
export function getGridColors(isDark: boolean) {
  return {
    text: isDark ? '#E5E7EB' : colors.gray[500],
    today: isDark ? '#F9FAFB' : colors.gray[900],
    muted: isDark ? '#4B5563' : colors.gray[200],
    label: isDark ? '#9CA3AF' : colors.gray[300],
  };
}
