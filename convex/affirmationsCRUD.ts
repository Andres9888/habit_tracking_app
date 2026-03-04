/**
 * Affirmations CRUD Mutations
 *
 * Create, update, and delete operations for affirmations.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  MAX_AFFIRMATIONS_PER_HABIT,
  MAX_TEXT_LENGTH,
  affirmationTypeValidator,
} from './affirmations/index';
import {
  validateShortText,
  requireValid,
} from './lib/inputValidation';

/**
 * Create a new affirmation for a habit
 */
export const create = mutation({
  args: {
    habitId: v.id('habits'),
    text: v.string(),
    type: v.optional(affirmationTypeValidator),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create affirmations');
    }

    // SEC-003: Input validation - text
    const textResult = validateShortText(args.text, MAX_TEXT_LENGTH, 'Affirmation');
    const validatedText = requireValid(textResult, args.text);
    const text = validatedText?.trim();
    if (!text) throw new Error('Affirmation text is required');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    // SEC-001: Ownership verification - verify user owns the habit
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to add affirmations to this habit');
    }

    const existing = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    if (existing.length >= MAX_AFFIRMATIONS_PER_HABIT) {
      throw new Error(
        `Maximum ${MAX_AFFIRMATIONS_PER_HABIT} affirmations per habit. Remove one to add another.`
      );
    }

    const now = Date.now();
    return await ctx.db.insert('affirmations', {
      createdAt: now,
      habitId: args.habitId,
      text,
      type: args.type,
      updatedAt: now,
      userId: identity.subject,
    });
  },
  returns: v.id('affirmations'),
});

/**
 * Update an existing affirmation
 */
export const update = mutation({
  args: {
    id: v.id('affirmations'),
    text: v.optional(v.string()),
    type: v.optional(affirmationTypeValidator),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update affirmations');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-001: Ownership verification via affirmation's userId or parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to update this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this affirmation');
    }

    const updates: {
      text?: string;
      type?: 'identity' | 'motivational' | 'instructional';
      updatedAt: number;
    } = { updatedAt: Date.now() };

    // SEC-003: Input validation - text
    if (args.text !== undefined) {
      const textResult = validateShortText(args.text, MAX_TEXT_LENGTH, 'Affirmation');
      const validatedText = requireValid(textResult, args.text);
      const text = validatedText?.trim();
      if (!text) throw new Error('Affirmation text is required');
      updates.text = text;
    }

    if (args.type !== undefined) updates.type = args.type;

    await ctx.db.patch(args.id, updates);
    return null;
  },
  returns: v.null(),
});

/**
 * Delete an affirmation
 */
export const remove = mutation({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete affirmations');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-001: Ownership verification via affirmation's userId or parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to delete this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this affirmation');
    }

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});
