/**
 * Pure assembly of the "What we're noticing" payload. Kept free of React so
 * the gating rules (enough history? real pattern?) are directly unit-testable.
 */

import { addDays, eachDayOfInterval } from 'date-fns';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { findWorkingWindow } from './dayparts';
import {
  inclusiveDaySpan,
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';
import type { HabitInsights, InsightEntry } from './types';
import { buildWeekdayStats, findOneFix } from './weekdayStats';

/**
 * Insight cards stay hidden below this much history — the design calls for no
 * generic fallback copy, just an absent card.
 */
export const MIN_DAYS_OF_DATA = 14;

/** Weekday patterns are read over a rolling quarter, not all of history. */
const PATTERN_WINDOW_DAYS = 90;

export interface BuildInsightsInput {
  /** Habit-scoped rows, ideally year-to-date. */
  entries: InsightEntry[];
  /** Habit creation timestamp, when known. */
  habitCreatedAt?: number;
  daysOfWeek?: number[];
  reminderTime?: string;
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

function earliestKnownDate(input: BuildInsightsInput, today: string): string {
  const candidates: string[] = [];
  if (input.habitCreatedAt) {
    candidates.push(getLocalDateString(new Date(input.habitCreatedAt)));
  }
  for (const entry of input.entries) candidates.push(entry.date);
  if (candidates.length === 0) return today;
  return candidates.reduce((min, date) => (date < min ? date : min));
}

/**
 * Year-to-date volume and rate. The denominator is scheduled days that have
 * already elapsed; today only counts once it's logged, so a pending day never
 * drags the rate down and then jumps back up.
 */
function yearStats(
  today: string,
  firstKnown: string,
  doneSet: Set<string>,
  daysOfWeek?: number[]
) {
  const yearPrefix = `${today.slice(0, 4)}-`;
  const completions = [...doneSet].filter((date) =>
    date.startsWith(yearPrefix)
  ).length;

  const yearStart = `${yearPrefix}01-01`;
  const start = firstKnown > yearStart ? firstKnown : yearStart;
  const end = doneSet.has(today)
    ? today
    : getLocalDateString(addDays(parseLocalDate(today), -1));
  if (start > end) return { completions, ratePct: 0 };

  const scheduled = scheduledWeekdays({ daysOfWeek });
  const elapsed = eachDayOfInterval({
    end: parseLocalDate(end),
    start: parseLocalDate(start),
  }).filter((date) => isScheduledWeekday(scheduled, date.getDay())).length;

  return {
    completions,
    ratePct: elapsed === 0 ? 0 : Math.round((completions / elapsed) * 100),
  };
}

export function buildInsights(input: BuildInsightsInput): HabitInsights {
  const today = input.today ?? getLocalDateString();
  const firstKnown = earliestKnownDate(input, today);
  const daysOfData = inclusiveDaySpan(firstKnown, today);

  const doneSet = new Set(
    input.entries.filter((entry) => entry.completed).map((entry) => entry.date)
  );
  const year = yearStats(today, firstKnown, doneSet, input.daysOfWeek);
  const todayCompletedAt = input.entries.find(
    (entry) => entry.date === today && entry.completed
  )?.createdAt;
  const base = {
    daysOfData,
    doneDates: doneSet,
    todayCompletedAt,
    yearCompletions: year.completions,
    yearRatePct: year.ratePct,
  };

  if (daysOfData < MIN_DAYS_OF_DATA) {
    return { ...base, oneFix: null, working: null };
  }

  const windowStartDate = addDays(
    parseLocalDate(today),
    -(PATTERN_WINDOW_DAYS - 1)
  );
  const windowStart =
    firstKnown > getLocalDateString(windowStartDate)
      ? firstKnown
      : getLocalDateString(windowStartDate);
  // Today is still in progress — judging it as a miss would slander the day.
  const windowEnd = getLocalDateString(addDays(parseLocalDate(today), -1));
  const dates =
    windowStart > windowEnd
      ? []
      : eachDayOfInterval({
          end: parseLocalDate(windowEnd),
          start: parseLocalDate(windowStart),
        }).map((date) => getLocalDateString(date));

  const scheduled = scheduledWeekdays({ daysOfWeek: input.daysOfWeek });
  const stats = buildWeekdayStats(dates, doneSet, scheduled);

  return {
    ...base,
    oneFix: findOneFix(stats, dates, doneSet),
    working: findWorkingWindow(input.entries, input.reminderTime),
  };
}
