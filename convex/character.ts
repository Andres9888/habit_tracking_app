import { query } from './_generated/server';
import { v } from 'convex/values';

export const getCharacterStats = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Get all active habits
      const habits = await ctx.db
        .query('habits')
        .filter((q) => q.neq(q.field('archived'), true))
        .collect();

      // Get all tracking data
      const allTracking = await ctx.db.query('tracking').collect();

      // Calculate streaks for each habit
      const habitStreaks = new Map<string, number>();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const habit of habits) {
        const habitTracking = allTracking
          .filter((t) => t.habitId === habit._id && t.completed)
          .map((t) => new Date(t.date).getTime())
          .sort((a, b) => b - a);

        let streak = 0;
        for (let i = 0; i < habitTracking.length; i++) {
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          expectedDate.setHours(0, 0, 0, 0);
          const expectedTime = expectedDate.getTime();

          if (habitTracking[i] === expectedTime) {
            streak++;
          } else {
            break;
          }
        }
        habitStreaks.set(habit._id, streak);
      }

      // Calculate XP
      let totalXP = 0;
      const completedTracking = allTracking.filter((t) => t.completed);

      for (const tracking of completedTracking) {
        const habit = habits.find((h) => h._id === tracking.habitId);
        if (!habit) continue;

        // Base XP: 10 per completion
        let xp = 10;

        // Streak bonus: +2 XP per day in current streak
        const streak = habitStreaks.get(habit._id) || 0;
        xp += Math.min(streak * 2, 50); // Cap streak bonus at 50

        // Strength bonus: up to +10 XP based on habit strength
        const strength = habit.strength || 0;
        xp += Math.floor(strength * 10);

        totalXP += xp;
      }

      // Calculate level using square root progression
      const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
      const xpForCurrentLevel = (level - 1) ** 2 * 50;
      const xpForNextLevel = level ** 2 * 50;
      const xpInCurrentLevel = totalXP - xpForCurrentLevel;
      const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

      // Calculate attributes

      // Vitality: Overall consistency (average completion rate over last 30 days)
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const last30DaysTracking = allTracking.filter((t) => {
        const trackingDate = new Date(t.date);
        return trackingDate >= thirtyDaysAgo && trackingDate <= today;
      });
      const possibleCompletions = habits.length * 30;
      const actualCompletions = last30DaysTracking.filter(
        (t) => t.completed
      ).length;
      const vitality = Math.min(
        100,
        Math.round((actualCompletions / Math.max(possibleCompletions, 1)) * 100)
      );

      // Strength: Average streak strength across all habits
      const streakValues = Array.from(habitStreaks.values());
      const avgStreak =
        streakValues.length > 0
          ? streakValues.reduce((a, b) => a + b, 0) / streakValues.length
          : 0;
      const strength = Math.min(100, Math.round(avgStreak * 10)); // 10-day streak = 100 strength

      // Wisdom: Based on total unique days tracked (experience)
      const uniqueDates = new Set(
        allTracking.filter((t) => t.completed).map((t) => t.date)
      );
      const totalDaysTracked = uniqueDates.size;
      const wisdom = Math.min(100, Math.round((totalDaysTracked / 100) * 100)); // 100 days = 100 wisdom

      // Energy: Recent activity (last 7 days completion rate)
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const last7DaysTracking = allTracking.filter((t) => {
        const trackingDate = new Date(t.date);
        return trackingDate >= sevenDaysAgo && trackingDate <= today;
      });
      const possibleLast7Days = habits.length * 7;
      const actualLast7Days = last7DaysTracking.filter(
        (t) => t.completed
      ).length;
      const energy = Math.min(
        100,
        Math.round((actualLast7Days / Math.max(possibleLast7Days, 1)) * 100)
      );

      // Calculate stats
      const streakArray = Array.from(habitStreaks.values());
      const maxStreak = streakArray.length > 0 ? Math.max(...streakArray) : 0;
      const totalPower = vitality + strength + wisdom + energy;
      const activeHabits = habits.length;

      // Get title based on level
      const titles = [
        'Novice',
        'Habit Hero',
        'Routine Master',
        'Consistency Champion',
        'Discipline Legend',
        'Zen Master',
        'Unstoppable Force',
      ];
      const titleIndex = Math.min(Math.floor(level / 5), titles.length - 1);
      const title = titles[titleIndex];

      return {
        level,
        title,
        xp: xpInCurrentLevel,
        xpToNextLevel: xpNeededForNextLevel,
        totalXP,
        attributes: {
          vitality,
          strength,
          wisdom,
          energy,
        },
        stats: {
          dayStreak: maxStreak,
          totalPower,
          activeHabits,
        },
      };
    } catch (error) {
      console.error('Error calculating character stats:', error);
      // Return default stats on error
      return {
        level: 1,
        title: 'Novice',
        xp: 0,
        xpToNextLevel: 50,
        totalXP: 0,
        attributes: {
          vitality: 0,
          strength: 0,
          wisdom: 0,
          energy: 0,
        },
        stats: {
          dayStreak: 0,
          totalPower: 0,
          activeHabits: 0,
        },
      };
    }
  },
  returns: v.object({
    level: v.number(),
    title: v.string(),
    xp: v.number(),
    xpToNextLevel: v.number(),
    totalXP: v.number(),
    attributes: v.object({
      vitality: v.number(),
      strength: v.number(),
      wisdom: v.number(),
      energy: v.number(),
    }),
    stats: v.object({
      dayStreak: v.number(),
      totalPower: v.number(),
      activeHabits: v.number(),
    }),
  }),
});
