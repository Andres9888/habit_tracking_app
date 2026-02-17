/**
 * Analytics Insights Engine - Personalized habit insights
 *
 * Generates smart, data-driven insights from user habit data:
 * - Best day analysis ("You complete Exercise most on Mondays")
 * - Pattern detection ("Your streaks tend to break on weekends")
 * - Trend analysis ("You're 23% more consistent this month")
 * - Habit stacking suggestions ("Try pairing Meditation with Coffee")
 */

import { query } from './_generated/server';

/** Day names for display */
const DAY_NAMES = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
] as const;

interface Insight {
  id: string;
  type: 'best-day' | 'pattern' | 'trend' | 'habit-stack';
  icon: string;
  title: string;
  description: string;
  priority: number; // higher = more important
}

/**
 * Get personalized insights for the current user.
 * Returns 2-3 top insights based on available data.
 */
export const getPersonalizedInsights = query({
  args: {},
  handler: async (ctx): Promise<Insight[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    if (activeHabits.length === 0) return [];

    // Fetch all tracking records for the user
    const trackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q: any) =>
        q.eq('userId', identity.subject)
      )
      .collect();

    const completedTrackings = trackings.filter((t) => t.completed);
    if (completedTrackings.length < 3) return [];

    const insights: Insight[] = [];

    // --- 1. Best Day Analysis ---
    // Find which day of the week each habit is completed most
    const habitCompletionsByDay = new Map<
      string,
      { name: string; icon: string; days: number[] }
    >();

    for (const habit of activeHabits) {
      const days = [0, 0, 0, 0, 0, 0, 0];
      const habitTrackings = completedTrackings.filter(
        (t) => t.habitId === habit._id
      );
      for (const t of habitTrackings) {
        const dayOfWeek = new Date(t.date + 'T12:00:00').getDay();
        days[dayOfWeek]++;
      }
      if (habitTrackings.length >= 3) {
        habitCompletionsByDay.set(habit._id, {
          name: habit.name,
          icon: habit.icon ?? '📊',
          days,
        });
      }
    }

    // Pick the habit with the strongest day preference
    let bestDayInsight: {
      habitName: string;
      icon: string;
      dayName: string;
      ratio: number;
    } | null = null;

    for (const [, data] of habitCompletionsByDay) {
      const total = data.days.reduce((a, b) => a + b, 0);
      if (total < 3) continue;
      const maxIdx = data.days.indexOf(Math.max(...data.days));
      const ratio = data.days[maxIdx] / total;
      if (ratio > 0.25 && (!bestDayInsight || ratio > bestDayInsight.ratio)) {
        bestDayInsight = {
          habitName: data.name,
          icon: data.icon,
          dayName: DAY_NAMES[maxIdx],
          ratio,
        };
      }
    }

    if (bestDayInsight) {
      insights.push({
        id: 'best-day',
        type: 'best-day',
        icon: '📅',
        title: 'Your Best Day',
        description: `You complete ${bestDayInsight.habitName} most on ${bestDayInsight.dayName}`,
        priority: 3,
      });
    }

    // --- 2. Streak Break Pattern Detection ---
    // Analyze when streaks tend to break (weekends vs weekdays)
    const breakDays = [0, 0, 0, 0, 0, 0, 0]; // count of "missed after completed" per day
    for (const habit of activeHabits) {
      const habitTrackings = trackings
        .filter((t) => t.habitId === habit._id)
        .sort((a, b) => a.date.localeCompare(b.date));

      for (let i = 1; i < habitTrackings.length; i++) {
        if (habitTrackings[i - 1].completed && !habitTrackings[i].completed) {
          const breakDay = new Date(
            habitTrackings[i].date + 'T12:00:00'
          ).getDay();
          breakDays[breakDay]++;
        }
      }
    }

    const totalBreaks = breakDays.reduce((a, b) => a + b, 0);
    if (totalBreaks >= 3) {
      const weekendBreaks = breakDays[0] + breakDays[6];
      const weekdayBreaks = totalBreaks - weekendBreaks;
      // Weekend has 2 days vs 5 weekdays, so normalize
      const weekendRate = weekendBreaks / 2;
      const weekdayRate = weekdayBreaks / 5;

      if (weekendRate > weekdayRate * 1.3) {
        insights.push({
          id: 'pattern-weekends',
          type: 'pattern',
          icon: '🔍',
          title: 'Weekend Pattern',
          description:
            'Your streaks tend to break on weekends — try setting weekend reminders',
          priority: 4,
        });
      } else if (weekdayRate > weekendRate * 1.3) {
        // Find the weakest weekday
        const weekdayOnly = breakDays.slice(1, 6);
        const worstIdx = weekdayOnly.indexOf(Math.max(...weekdayOnly)) + 1;
        const worstDay = DAY_NAMES[worstIdx];
        insights.push({
          id: 'pattern-weekday',
          type: 'pattern',
          icon: '🔍',
          title: 'Midweek Dip',
          description: `Your streaks tend to break on ${worstDay} — plan ahead for that day`,
          priority: 4,
        });
      }
    }

    // --- 3. Trend Analysis (month over month) ---
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split('T')[0];

    const thisMonthCompletions = completedTrackings.filter(
      (t) => t.date >= thisMonthStart
    ).length;

    const lastMonthCompletions = completedTrackings.filter(
      (t) => t.date >= lastMonthStart && t.date < thisMonthStart
    ).length;

    // Normalize by days elapsed
    const daysThisMonth = Math.max(now.getDate(), 1);
    const daysLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();

    const thisMonthRate = thisMonthCompletions / daysThisMonth;
    const lastMonthRate = lastMonthCompletions / daysLastMonth;

    if (lastMonthRate > 0) {
      const changePercent = Math.round(
        ((thisMonthRate - lastMonthRate) / lastMonthRate) * 100
      );
      if (Math.abs(changePercent) >= 5) {
        const isPositive = changePercent > 0;
        insights.push({
          id: 'trend-monthly',
          type: 'trend',
          icon: isPositive ? '📈' : '📉',
          title: isPositive ? 'Trending Up!' : 'Room to Grow',
          description: isPositive
            ? `You're ${changePercent}% more consistent this month — keep it up!`
            : `You're ${Math.abs(changePercent)}% less consistent this month — you've got this!`,
          priority: isPositive ? 5 : 2,
        });
      }
    }

    // --- 4. Habit Stacking Suggestions ---
    // Find habits often completed on the same day and suggest pairing
    if (activeHabits.length >= 2) {
      // Find habits with morning cues for stacking suggestions
      const morningHabits = activeHabits.filter(
        (h) =>
          h.cueTime &&
          (h.cueTime.toLowerCase().includes('morning') ||
            h.cueTime.includes('7:') ||
            h.cueTime.includes('8:') ||
            h.cueTime.includes('6:'))
      );

      // Find co-occurring habits (completed on same dates)
      let bestPair: {
        h1Name: string;
        h2Name: string;
        h1Icon: string;
        h2Icon: string;
        coOccurrence: number;
      } | null = null;

      for (let i = 0; i < activeHabits.length; i++) {
        for (let j = i + 1; j < activeHabits.length; j++) {
          const h1Dates = new Set(
            completedTrackings
              .filter((t) => t.habitId === activeHabits[i]._id)
              .map((t) => t.date)
          );
          const h2Dates = completedTrackings
            .filter((t) => t.habitId === activeHabits[j]._id)
            .map((t) => t.date);

          const coOccurrence = h2Dates.filter((d) => h1Dates.has(d)).length;
          const minCompletions = Math.min(h1Dates.size, h2Dates.length);

          if (
            minCompletions >= 3 &&
            coOccurrence / minCompletions < 0.7 &&
            coOccurrence >= 2 &&
            (!bestPair || coOccurrence > bestPair.coOccurrence)
          ) {
            bestPair = {
              h1Name: activeHabits[i].name,
              h2Name: activeHabits[j].name,
              h1Icon: activeHabits[i].icon ?? '✨',
              h2Icon: activeHabits[j].icon ?? '✨',
              coOccurrence,
            };
          }
        }
      }

      if (bestPair) {
        insights.push({
          id: 'habit-stack',
          type: 'habit-stack',
          icon: '🔗',
          title: 'Habit Stacking',
          description: `Try pairing ${bestPair.h1Name} with ${bestPair.h2Name} — they complement each other`,
          priority: 1,
        });
      } else if (morningHabits.length >= 2) {
        insights.push({
          id: 'habit-stack-morning',
          type: 'habit-stack',
          icon: '🔗',
          title: 'Morning Stack',
          description: `Try pairing ${morningHabits[0].name} with ${morningHabits[1].name} for a powerful morning routine`,
          priority: 1,
        });
      }
    }

    // Sort by priority (highest first) and return top 3
    return insights.sort((a, b) => b.priority - a.priority).slice(0, 3);
  },
});
