import { format } from 'date-fns';

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
  if (day.completed === day.total) return '#10b981';
  if (day.completed > 0) return '#f59e0b';
  return;
}

/** Returns theme-aware colors for the mini calendar */
export function getGridColors(isDark: boolean) {
  return {
    text: isDark ? '#E5E7EB' : '#57534e',
    today: isDark ? '#F9FAFB' : '#1c1917',
    muted: isDark ? '#4B5563' : '#d6d3d1',
    label: isDark ? '#9CA3AF' : '#a8a29e',
  };
}
