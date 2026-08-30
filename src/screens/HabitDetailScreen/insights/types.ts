/** Types for the habit-detail insight layer ("What we're noticing"). */

/** A tracking row reduced to the fields the insight layer needs. */
export interface InsightEntry {
  /** Convex row creation time — proxy for "when it was ticked off". */
  createdAt: number;
  /** Local date string, YYYY-MM-DD. */
  date: string;
  completed: boolean;
}

/** Per-weekday completion tally over the analysed window. */
export interface WeekdayStat {
  /** 0 = Sunday … 6 = Saturday, matching `habit.daysOfWeek`. */
  weekday: number;
  /** Single-letter label for the bar chart. */
  short: string;
  /** Full name for prose ("Fridays"). */
  plural: string;
  done: number;
  scheduled: number;
  /** done / scheduled, 0 when never scheduled. */
  rate: number;
}

/** "One fix to try" — the weekday that reliably slips. */
export interface OneFixInsight {
  bars: WeekdayStat[];
  /** The weakest scheduled weekday. */
  weakest: WeekdayStat;
  /** Misses within the last `recentOf` occurrences of that weekday. */
  recentMissed: number;
  recentOf: number;
}

/** A named slice of the day used to describe completion timing. */
export type DaypartKey = 'early' | 'morning' | 'afternoon' | 'evening';

export interface Daypart {
  key: DaypartKey;
  /** Sentence-case label ("Early morning"). */
  label: string;
  /** Lower-case fragment for prose ("early morning"). */
  phrase: string;
  /** Inclusive start hour, exclusive end hour (local time). */
  startHour: number;
  endHour: number;
}

/** "What's working" — the daypart the habit reliably lands in. */
export interface WorkingInsight {
  daypart: Daypart;
  /** Share of timestamped completions inside the daypart, 0-100. */
  sharePct: number;
  /** Share outside it, 0-100. Always `100 - sharePct`. */
  otherPct: number;
  /** How many completions the split is based on. */
  sample: number;
  /** True when the habit's reminder already sits inside the daypart. */
  reminderInWindow: boolean;
  /** Reminder as stored on the habit, when set. */
  reminderTime?: string;
}

export interface HabitInsights {
  /** Days between the first known day and today, inclusive. */
  daysOfData: number;
  oneFix: OneFixInsight | null;
  working: WorkingInsight | null;
  /** Completions in the current calendar year. */
  yearCompletions: number;
  /**
   * Every date with a logged completion in the rolling long-history window.
   * The monthly-trend analysis reads this instead of the app-level tracking
   * buffer, which only reaches ~90 days back.
   */
  doneDates: Set<string>;
  /** Share of elapsed scheduled days completed this year, 0-100. */
  yearRatePct: number;
  /** Epoch ms of today's completion, when today is already logged. */
  todayCompletedAt?: number;
}
