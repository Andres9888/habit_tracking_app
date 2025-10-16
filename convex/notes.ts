import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").order("desc").collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("notes"),
      body: v.string(),
      createdAt: v.number(),
      date: v.string(),
      habitId: v.optional(v.id("habits")),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

export const search = query({
  args: {
    habitId: v.optional(v.id("habits")),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let notes = await ctx.db.query("notes").order("desc").collect();

    if (args.habitId) {
      notes = notes.filter((note) => note.habitId === args.habitId);
    }

    if (args.searchText && args.searchText.trim()) {
      const searchLower = args.searchText.toLowerCase();
      notes = notes.filter((note) =>
        note.body.toLowerCase().includes(searchLower)
      );
    }

    return notes;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("notes"),
      body: v.string(),
      createdAt: v.number(),
      date: v.string(),
      habitId: v.optional(v.id("habits")),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

export const get = query({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.noteId);
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id("notes"),
      body: v.string(),
      createdAt: v.number(),
      date: v.string(),
      habitId: v.optional(v.id("habits")),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

export const create = mutation({
  args: {
    body: v.string(),
    date: v.string(),
    habitId: v.optional(v.id("habits")),
  },
  handler: async (ctx, args) => {
    // Validate body length (max 1000 chars as per AC4)
    if (args.body.length > 1000) {
      throw new Error("Note body cannot exceed 1000 characters");
    }

    // Validate date format as YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);
    if (!isValidDate) {
      throw new Error("Invalid date format; expected YYYY-MM-DD");
    }

    const now = Date.now();
    return await ctx.db.insert("notes", {
      body: args.body,
      createdAt: now,
      date: args.date,
      habitId: args.habitId,
      updatedAt: now,
    });
  },
  returns: v.id("notes"),
});

export const update = mutation({
  args: {
    body: v.string(),
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    // Validate body length (max 1000 chars as per AC4)
    if (args.body.length > 1000) {
      throw new Error("Note body cannot exceed 1000 characters");
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(args.noteId, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const remove = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    await ctx.db.delete(args.noteId);
    return null;
  },
  returns: v.null(),
});
