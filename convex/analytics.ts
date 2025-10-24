import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Helper function to calculate habit strength (matching existing logic)
function calculateHabitStrength(habit: Doc<"habits">, completionRate: number = 0): number {
  // Use the habit's stored strength if available
  if (habit.strength !== undefined) {
    return habit.strength * 100;
  }

  // Otherwise calculate based on completion rate
  return completionRate * 100;
}

// Helper to get streak from completions
async function getStreaksForHabit(
  ctx: any,
  habitId: Id<"habits">,
  userId: string
): Promise<{ currentStreak: number; longestStreak: number }> {
  // Get last 90 days of completions
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const trackings = await ctx.db
    .query("tracking")
    .withIndex("by_habit_and_date", (q: any) =>
      q.eq("habitId", habitId)
    )
    .collect();

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  const sortedTrackings = trackings
    .filter((t: any) => t.completed)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const tracking of sortedTrackings) {
    const trackingDate = new Date(tracking.date);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor((trackingDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    lastDate = trackingDate;
  }

  // Check if streak is current (within last 2 days)
  const today = new Date();
  if (lastDate) {
    const daysSinceLastCompletion = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    currentStreak = daysSinceLastCompletion <= 1 ? tempStreak : 0;
  }

  return { currentStreak, longestStreak };
}

// Get overview statistics for the analytics dashboard
export const getOverviewStats = query({
  args: {},
  handler: async (ctx) => {
    // For development without auth, query all habits
    // TODO: Add userId filter when authentication is enabled
    const habits = await ctx.db
      .query("habits")
      .collect();

    // Filter active habits (not archived or paused)
    const activeHabits = habits.filter(h => !h.archived && !h.paused);

    if (activeHabits.length === 0) {
      return {
        totalHabits: 0,
        averageStrength: 0,
        strongestHabit: null,
        weakestHabit: null,
        rankedHabits: [],
      };
    }

    // Calculate strengths with streaks
    const habitsWithStrength = await Promise.all(
      activeHabits.map(async (habit) => {
        const streaks = await getStreaksForHabit(ctx, habit._id, "anonymous"); // Use placeholder for development
        const strength = calculateHabitStrength(habit, streaks.currentStreak / 66);
        return {
          ...habit,
          strength,
          currentStreak: streaks.currentStreak,
          longestStreak: streaks.longestStreak,
        };
      })
    );

    // Sort by strength
    habitsWithStrength.sort((a, b) => b.strength - a.strength);

    const totalStrength = habitsWithStrength.reduce((sum, h) => sum + h.strength, 0);
    const averageStrength = totalStrength / habitsWithStrength.length;

    // Prepare ranked habits for the rankings list
    const rankedHabits = habitsWithStrength.map(habit => ({
      id: habit._id,
      name: habit.name,
      emoji: habit.icon || "🎯",
      strength: habit.strength,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      isAtRisk: habit.currentStreak < 3,
    }));

    return {
      totalHabits: activeHabits.length,
      averageStrength,
      strongestHabit: habitsWithStrength[0] ? {
        id: habitsWithStrength[0]._id,
        name: habitsWithStrength[0].name,
        emoji: habitsWithStrength[0].icon || "🎯",
        strength: habitsWithStrength[0].strength,
      } : null,
      weakestHabit: habitsWithStrength[habitsWithStrength.length - 1] ? {
        id: habitsWithStrength[habitsWithStrength.length - 1]._id,
        name: habitsWithStrength[habitsWithStrength.length - 1].name,
        emoji: habitsWithStrength[habitsWithStrength.length - 1].icon || "🎯",
        strength: habitsWithStrength[habitsWithStrength.length - 1].strength,
      } : null,
      rankedHabits,
    };
  },
});

// Get strength distribution for donut chart
export const getStrengthDistribution = query({
  args: {},
  handler: async (ctx) => {
    // For development without auth, query all habits
    const habits = await ctx.db
      .query("habits")
      .collect();

    const activeHabits = habits.filter(h => !h.archived && !h.paused);

    // Categorize by strength level
    const distribution = {
      starting: 0,    // 🌱 0-20%
      building: 0,    // 🌿 20-40%
      developing: 0,  // 🌳 40-60%
      strong: 0,      // 💪 60-80%
      automatic: 0,   // ⚡ 80-100%
    };

    for (const habit of activeHabits) {
      const strength = habit.strength ? habit.strength * 100 : 0;
      if (strength >= 80) distribution.automatic++;
      else if (strength >= 60) distribution.strong++;
      else if (strength >= 40) distribution.developing++;
      else if (strength >= 20) distribution.building++;
      else distribution.starting++;
    }

    // Convert to percentages
    const total = activeHabits.length || 1;
    return {
      starting: { count: distribution.starting, percentage: (distribution.starting / total) * 100, emoji: "🌱" },
      building: { count: distribution.building, percentage: (distribution.building / total) * 100, emoji: "🌿" },
      developing: { count: distribution.developing, percentage: (distribution.developing / total) * 100, emoji: "🌳" },
      strong: { count: distribution.strong, percentage: (distribution.strong / total) * 100, emoji: "💪" },
      automatic: { count: distribution.automatic, percentage: (distribution.automatic / total) * 100, emoji: "⚡" },
      total: total,
    };
  },
});

// Get 30-day trend data for line chart
export const get30DayTrend = query({
  args: {},
  handler: async (ctx) => {
    // For development without auth, query all habits
    const habits = await ctx.db
      .query("habits")
      .collect();

    const activeHabits = habits.filter(h => !h.archived && !h.paused);

    // Get completions for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const habitIds = activeHabits.map(h => h._id);

    // Get all trackings for these habits
    const trackings: any[] = [];
    for (const habitId of habitIds) {
      const habitTrackings = await ctx.db
        .query("tracking")
        .withIndex("by_habit_and_date", (q) => q.eq("habitId", habitId))
        .collect();
      trackings.push(...habitTrackings); // No userId filter for development
    }

    // Group completions by day and calculate average strength
    const trendData: Array<{ date: string; averageStrength: number }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];

      // Calculate completion rate for this day
      const dayCompletions = trackings.filter(t =>
        t.date === dateStr && t.completed && habitIds.includes(t.habitId)
      );

      const completionRate = activeHabits.length > 0
        ? (dayCompletions.length / activeHabits.length) * 100
        : 0;

      trendData.push({
        date: dateStr,
        averageStrength: completionRate,
      });
    }

    return trendData;
  },
});

// Get compliance data for heatmap (90 days)
export const getComplianceData = query({
  args: {},
  handler: async (ctx) => {
    // For development without auth, query all habits
    const habits = await ctx.db
      .query("habits")
      .collect();

    const activeHabits = habits.filter(h => !h.archived && !h.paused);

    // Get completions for last 90 days
    const habitIds = activeHabits.map(h => h._id);

    // Get all trackings for these habits
    const trackings: any[] = [];
    for (const habitId of habitIds) {
      const habitTrackings = await ctx.db
        .query("tracking")
        .withIndex("by_habit_and_date", (q) => q.eq("habitId", habitId))
        .collect();
      trackings.push(...habitTrackings); // No userId filter for development
    }

    // Build heatmap data
    const heatmapData: Array<{
      date: string;
      completionRate: number;
      level: 'none' | 'low' | 'medium' | 'high';
      completedHabits: number;
      totalHabits: number;
    }> = [];

    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];

      // Count completions for this day
      const dayCompletions = trackings.filter(t =>
        t.date === dateStr && t.completed && habitIds.includes(t.habitId)
      );

      const completionRate = activeHabits.length > 0
        ? (dayCompletions.length / activeHabits.length) * 100
        : 0;

      // Determine level for heatmap coloring
      let level: 'none' | 'low' | 'medium' | 'high' = 'none';
      if (completionRate >= 70) level = 'high';
      else if (completionRate >= 40) level = 'medium';
      else if (completionRate > 0) level = 'low';

      heatmapData.push({
        date: dateStr,
        completionRate,
        level,
        completedHabits: dayCompletions.length,
        totalHabits: activeHabits.length,
      });
    }

    return heatmapData;
  },
});

// Get weekly insights
export const getWeeklyInsights = query({
  args: {},
  handler: async (ctx) => {
    // For development without auth, query all habits
    const habits = await ctx.db
      .query("habits")
      .collect();

    const activeHabits = habits.filter(h => !h.archived && !h.paused);

    // Get completions for this week and last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Get all trackings for these habits
    const trackings: any[] = [];
    for (const habit of activeHabits) {
      const habitTrackings = await ctx.db
        .query("tracking")
        .withIndex("by_habit_and_date", (q) => q.eq("habitId", habit._id))
        .collect();
      trackings.push(...habitTrackings); // No userId filter for development
    }

    // Calculate strength changes for each habit
    const habitChanges = await Promise.all(
      activeHabits.map(async (habit) => {
        const thisWeekCompletions = trackings.filter(t => {
          const date = new Date(t.date);
          return t.habitId === habit._id &&
                 t.completed &&
                 date >= oneWeekAgo;
        }).length;

        const lastWeekCompletions = trackings.filter(t => {
          const date = new Date(t.date);
          return t.habitId === habit._id &&
                 t.completed &&
                 date < oneWeekAgo &&
                 date >= twoWeeksAgo;
        }).length;

        const change = thisWeekCompletions - lastWeekCompletions;
        const percentageChange = lastWeekCompletions > 0
          ? ((change / lastWeekCompletions) * 100)
          : thisWeekCompletions > 0 ? 100 : 0;

        const streaks = await getStreaksForHabit(ctx, habit._id, "anonymous");

        return {
          habitId: habit._id,
          name: habit.name,
          emoji: habit.icon || "🎯",
          thisWeek: thisWeekCompletions,
          lastWeek: lastWeekCompletions,
          change,
          percentageChange,
          currentStreak: streaks.currentStreak,
        };
      })
    );

    // Sort and categorize
    const gainedStrength = habitChanges
      .filter(h => h.change > 0)
      .sort((a, b) => b.percentageChange - a.percentageChange)
      .slice(0, 3);

    const lostStrength = habitChanges
      .filter(h => h.change < 0)
      .sort((a, b) => a.percentageChange - b.percentageChange)
      .slice(0, 3);

    // Habits at risk (low completion this week or declining streak)
    const atRisk = habitChanges
      .filter(h => h.thisWeek < 3 || (h.change < 0 && h.currentStreak < 7))
      .slice(0, 3);

    // Calculate overall stats
    const totalCompletionsThisWeek = habitChanges.reduce((sum, h) => sum + h.thisWeek, 0);
    const totalCompletionsLastWeek = habitChanges.reduce((sum, h) => sum + h.lastWeek, 0);
    const weekOverWeekChange = totalCompletionsLastWeek > 0
      ? ((totalCompletionsThisWeek - totalCompletionsLastWeek) / totalCompletionsLastWeek) * 100
      : 0;

    return {
      weekOverWeekChange,
      totalCompletionsThisWeek,
      totalCompletionsLastWeek,
      gainedStrength,
      lostStrength,
      atRisk,
      generatedAt: new Date().toISOString(),
    };
  },
});

// Scheduled function to generate weekly insights (to be called via cron)
export const generateWeeklyInsights = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // This would be called by a scheduled function to generate and store weekly insights
    // For now, the insights are calculated on-demand in getWeeklyInsights
    // This mutation could be used to store historical insights for the archive feature

    const insightData = {
      userId,
      generatedAt: new Date().toISOString(),
      // ... calculate and store insights
    };

    // await ctx.db.insert("weeklyInsights", insightData);

    return { success: true };
  },
});