/**
 * Journal Entries Mutation API
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  validateLongText,
  requireValid,
  MAX_LONG_TEXT_LENGTH,
} from './lib/inputValidation';
import { hasPremiumAccess } from './subscriptions/premiumCheck';

/** Free tier: 3 journal entries per habit */
const FREE_JOURNAL_ENTRIES_PER_HABIT = 3;

/** Mood emoji validator */
const moodValidator = v.union(
  v.literal('frustrated'),
  v.literal('neutral'),
  v.literal('happy'),
  v.literal('fire')
);

/**
 * Create a new journal entry
 */
export const create = mutation({
  args: {
    habitId: v.id('habits'),
    mood: moodValidator,
    textContent: v.string(),
    whatWasHard: v.optional(v.string()),
    whatWentWell: v.optional(v.string()),
    whatWillChange: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create journal entries');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add journal entries to this habit');
    }

    // Premium gating: Free tier = 3 entries per habit
    const isPremium = await hasPremiumAccess(ctx, identity.subject);
    if (!isPremium) {
      const existing = await ctx.db
        .query('journalEntries')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
        .collect();

      if (existing.length >= FREE_JOURNAL_ENTRIES_PER_HABIT) {
        throw new Error(
          `Free tier limited to ${FREE_JOURNAL_ENTRIES_PER_HABIT} journal entries per habit. Upgrade to premium for unlimited entries.`
        );
      }
    }

    // Input validation
    const textResult = validateLongText(args.textContent, MAX_LONG_TEXT_LENGTH, 'Journal content');
    const textContent = requireValid(textResult, args.textContent);
    if (!textContent) throw new Error('Journal content is required');

    const whatWentWell = args.whatWentWell
      ? requireValid(validateLongText(args.whatWentWell, MAX_LONG_TEXT_LENGTH, 'What went well'), args.whatWentWell)
      : undefined;
    const whatWasHard = args.whatWasHard
      ? requireValid(validateLongText(args.whatWasHard, MAX_LONG_TEXT_LENGTH, 'What was hard'), args.whatWasHard)
      : undefined;
    const whatWillChange = args.whatWillChange
      ? requireValid(validateLongText(args.whatWillChange, MAX_LONG_TEXT_LENGTH, 'What will change'), args.whatWillChange)
      : undefined;

    const now = Date.now();

    return await ctx.db.insert('journalEntries', {
      createdAt: now,
      habitId: args.habitId,
      mood: args.mood,
      textContent,
      updatedAt: now,
      userId: identity.subject,
      whatWasHard,
      whatWentWell,
      whatWillChange,
    });
  },
  returns: v.id('journalEntries'),
});

/**
 * Update a journal entry
 */
export const update = mutation({
  args: {
    entryId: v.id('journalEntries'),
    mood: v.optional(moodValidator),
    textContent: v.optional(v.string()),
    whatWasHard: v.optional(v.string()),
    whatWentWell: v.optional(v.string()),
    whatWillChange: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error('Journal entry not found');
    if (entry.userId !== identity.subject) {
      throw new Error('Not authorized to update this journal entry');
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.textContent !== undefined) {
      const result = validateLongText(args.textContent, MAX_LONG_TEXT_LENGTH, 'Journal content');
      updates.textContent = requireValid(result, args.textContent);
    }
    if (args.mood !== undefined) updates.mood = args.mood;
    if (args.whatWentWell !== undefined) {
      updates.whatWentWell = requireValid(
        validateLongText(args.whatWentWell, MAX_LONG_TEXT_LENGTH, 'What went well'),
        args.whatWentWell
      );
    }
    if (args.whatWasHard !== undefined) {
      updates.whatWasHard = requireValid(
        validateLongText(args.whatWasHard, MAX_LONG_TEXT_LENGTH, 'What was hard'),
        args.whatWasHard
      );
    }
    if (args.whatWillChange !== undefined) {
      updates.whatWillChange = requireValid(
        validateLongText(args.whatWillChange, MAX_LONG_TEXT_LENGTH, 'What will change'),
        args.whatWillChange
      );
    }

    await ctx.db.patch(args.entryId, updates);
    return args.entryId;
  },
  returns: v.id('journalEntries'),
});

/**
 * Delete a journal entry
 */
export const remove = mutation({
  args: { entryId: v.id('journalEntries') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error('Journal entry not found');
    if (entry.userId !== identity.subject) {
      throw new Error('Not authorized to delete this journal entry');
    }

    await ctx.db.delete(args.entryId);
    return null;
  },
  returns: v.null(),
});
