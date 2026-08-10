/**
 * Pure assembly of the "What we're noticing" payload. Kept free of React so
 * the gating rules (enough history? real pattern?) are directly unit-testable.
 */
import { addDays, eachDayOfInterval } from 'date-fns';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { findWorkingWindow } from './dayparts';
import { earliestKnownDate } from './earliestKnownDate';
import { notesByDateFromEntries } from './notesByDateFromEntries';
import {
  inclusiveDaySpan,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';
import type { HabitInsights, InsightEntry } from './types';
import { buildWeekdayStats, findOneFix } from './weekdayStats';
import { yearStats } from './yearStats';

export const MIN_DAYS_OF_DATA = 14;
const PATTERN_WINDOW_DAYS = 90;

export interface BuildInsightsInput {
  entries: InsightEntry[];
  habitCreatedAt?: number;
  daysOfWeek?: number[];
  reminderTime?: string;
  today?: string;
}

function patternWindowDates(today: string, firstKnown: string): string[] {
  const windowStartDate = addDays(
    parseLocalDate(today),
    -(PATTERN_WINDOW_DAYS - 1)
  );
  const rolled = getLocalDateString(windowStartDate);
  const windowStart = firstKnown > rolled ? firstKnown : rolled;
  const windowEnd = getLocalDateString(addDays(parseLocalDate(today), -1));
  if (windowStart > windowEnd) return [];
  return eachDayOfInterval({
    end: parseLocalDate(windowEnd),
    start: parseLocalDate(windowStart),
  }).map((date) => getLocalDateString(date));
}

export function buildInsights(input: BuildInsightsInput): HabitInsights {
  const today = input.today ?? getLocalDateString();
  const firstKnown = earliestKnownDate(
    input.entries,
    input.habitCreatedAt,
    today
  );
  const daysOfData = inclusiveDaySpan(firstKnown, today);
  const doneSet = new Set(
    input.entries.filter((entry) => entry.completed).map((entry) => entry.date)
  );
  const year = yearStats(today, firstKnown, doneSet, input.daysOfWeek);
  const base = {
    daysOfData,
    doneDates: doneSet,
    notesByDate: notesByDateFromEntries(input.entries),
    todayCompletedAt: input.entries.find(
      (entry) => entry.date === today && entry.completed
    )?.createdAt,
    yearCompletions: year.completions,
    yearRatePct: year.ratePct,
  };

  if (daysOfData < MIN_DAYS_OF_DATA) {
    return { ...base, oneFix: null, working: null };
  }

  const dates = patternWindowDates(today, firstKnown);
  const scheduled = scheduledWeekdays({ daysOfWeek: input.daysOfWeek });
  const stats = buildWeekdayStats(dates, doneSet, scheduled);

  return {
    ...base,
    oneFix: findOneFix(stats, dates, doneSet),
    working: findWorkingWindow(input.entries, input.reminderTime),
  };
}
