import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("habits", {
      createdAt: Date.now(),
      name: args.name,
      notes: args.notes,
    });
  },
  returns: v.id("habits"),
});

export const updateNotes = mutation({
  args: {
    habitId: v.id("habits"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, {
      notes: args.notes,
    });
    return null;
  },
  returns: v.null(),
});

export const archive = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const unarchive = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
    });

    return null;
  },
  returns: v.null(),
});

export const remove = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    // Get the habit data before deleting
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    // Get all tracking data before deleting
    const trackingEntries = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) => q.eq("habitId", args.habitId))
      .collect();

    // Delete the habit permanently
    await ctx.db.delete(args.habitId);

    // Delete all tracking data for this habit
    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }

    // Return the deleted data for potential undo
    return {
      habit: {
        createdAt: habit.createdAt,
        name: habit.name,
        notes: habit.notes,
      },
      tracking: trackingEntries.map((entry) => ({
        completed: entry.completed,
        date: entry.date,
      })),
    };
  },
  returns: v.object({
    habit: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
    tracking: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  }),
});

export const restore = mutation({
  args: {
    habitData: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
    trackingData: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Recreate the habit
    const habitId = await ctx.db.insert("habits", args.habitData);

    // Recreate all tracking data
    for (const trackingEntry of args.trackingData) {
      await ctx.db.insert("tracking", {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
      });
    }

    return habitId;
  },
  returns: v.id("habits"),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("habits")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("habits"),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.optional(v.string()),
    })
  ),
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("archived"), true))
      .collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("habits"),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.optional(v.string()),
    })
  ),
});

export const toggleHabit = mutation({
  args: { date: v.string(), habitId: v.id("habits") },
  handler: async (ctx, args) => {
    // Validate date format as YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);
    if (!isValidDate)
      throw new Error("Invalid date format; expected YYYY-MM-DD");

    // Prevent future dates - only allow today or past dates
    const inputDate = new Date(args.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      throw new Error("Cannot track habits for future dates");
    }

    const existing = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    await (existing ? ctx.db.patch(existing._id, {
        completed: !existing.completed,
      }) : ctx.db.insert("tracking", {
        completed: true,
        date: args.date,
        habitId: args.habitId,
      }));
    return null;
  },
  returns: v.null(),
});

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.dates.length === 0) return [];

    // Optimize by querying a single date range then filtering to requested dates
    const sortedDates = [...args.dates].toSorted();
    const startDate = sortedDates[0];
    const endDate = sortedDates.at(-1);

    const range = await ctx.db
      .query("tracking")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();

    const dateSet = new Set(args.dates);
    return range.filter((t) => dateSet.has(t.date));
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("tracking"),
      completed: v.boolean(),
      date: v.string(),
      habitId: v.id("habits"),
      userId: v.optional(v.string()),
    })
  ),
});

export const getStats = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const tracking = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) => q.eq("habitId", args.habitId))
      .collect();

    const sortedDates = tracking
      .filter((t) => t.completed)
      .map((t) => new Date(t.date).getTime())
      .toSorted((a, b) => b - a);

    let streak = 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (const [i, sortedDate] of sortedDates.entries()) {
      const expectedDate = new Date(now);
      expectedDate.setDate(now.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      const expectedTime = expectedDate.getTime();

      if (sortedDate === expectedTime) {
        streak++;
      } else {
        break;
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const recentTracking = tracking.filter((t) => {
      const date = new Date(t.date);
      return date >= thirtyDaysAgo && t.completed;
    });

    const consistency = Math.max(
      0,
      Math.min(100, Math.round((recentTracking.length / 30) * 100))
    );

    return { consistency, streak };
  },
  returns: v.object({ consistency: v.number(), streak: v.number() }),
});
