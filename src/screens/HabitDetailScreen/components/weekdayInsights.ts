/** weekdayInsights — day-of-week completion pattern (good day / harder day). */
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type WeekdayKind = 'good' | 'hard' | 'normal';

export interface WeekdayBar {
  label: string;
  pct: number; // 0-100, relative to the peak weekday
  kind: WeekdayKind;
}

export interface WeekdayInsights {
  bars: WeekdayBar[];
  total: number;
  goodLabels: string[];
  hardLabel: string | null;
}

/** Compare this Mon-week's completions to last week's. */
export function compareWeeks(
  completedDates: Set<string>,
  now = new Date()
): string {
  const day = (now.getDay() + 6) % 7; // Monday-first index
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  const count = (start: Date, days: number) => {
    let n = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (completedDates.has(iso)) n++;
    }
    return n;
  };
  const lastMonday = new Date(monday);
  lastMonday.setDate(monday.getDate() - 7);
  const thisWeek = count(monday, day + 1);
  const lastWeekSame = count(lastMonday, day + 1);
  if (thisWeek > lastWeekSame) return 'Ahead of last week';
  if (thisWeek < lastWeekSame) return 'Quieter than last week';
  return 'Same as previous week';
}

export function computeWeekdayInsights(
  completedDates: Set<string>
): WeekdayInsights {
  const counts = Array.from({ length: 7 }, () => 0);
  let total = 0;
  for (const dateString of completedDates) {
    const parsed = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) continue;
    const idx = (parsed.getDay() + 6) % 7; // Monday-first
    counts[idx] += 1;
    total += 1;
  }

  const max = Math.max(...counts);
  // Weakest weekday among those that have logged at least one, below the peak.
  let hardIdx = -1;
  let hardMin = Infinity;
  for (const [i, c] of counts.entries()) {
    if (c > 0 && c < max && c < hardMin) {
      hardMin = c;
      hardIdx = i;
    }
  }

  const goodLabels: string[] = [];
  const bars: WeekdayBar[] = counts.map((c, i) => {
    let kind: WeekdayKind = 'normal';
    if (max > 0 && c === max) {
      kind = 'good';
      goodLabels.push(LABELS[i]);
    } else if (i === hardIdx) {
      kind = 'hard';
    }
    return {
      label: LABELS[i],
      pct: max > 0 ? Math.round((c / max) * 100) : 0,
      kind,
    };
  });

  return {
    bars,
    total,
    goodLabels,
    hardLabel: hardIdx >= 0 ? LABELS[hardIdx] : null,
  };
}
