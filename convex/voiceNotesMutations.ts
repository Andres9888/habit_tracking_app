/**
 * Voice Notes Mutation API
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { voiceNoteObjectValidator } from './voiceNotes/index';
import {
  validateUrl,
  validateShortText,
  requireValid,
  ALLOWED_STORAGE_DOMAINS,
  MAX_LABEL_LENGTH,
} from './lib/inputValidation';

/**
 * Create a new voice note
 */
export const create = mutation({
  args: {
    audioUrl: v.string(),
    duration: v.number(),
    habitId: v.id('habits'),
    isDay1: v.optional(v.boolean()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create voice notes');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add voice notes to this habit');
    }

    if (args.duration <= 0) throw new Error('Duration must be positive');
    if (args.duration > 300)
      throw new Error('Voice note cannot exceed 5 minutes');

    // SEC-003: Input validation - label
    const labelResult = validateShortText(args.label, MAX_LABEL_LENGTH, 'Label');
    const label = requireValid(labelResult, args.label);

    // SEC-003: Input validation - audioUrl (critical security check)
    const urlResult = validateUrl(args.audioUrl, {
      requireHttps: true,
      allowedDomains: ALLOWED_STORAGE_DOMAINS,
      fieldName: 'Audio URL',
    });
    const audioUrl = requireValid(urlResult, args.audioUrl);
    if (!audioUrl) {
      throw new Error('Audio URL is required');
    }

    const now = Date.now();

    if (args.isDay1) {
      const existingNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
        .collect();

      for (const note of existingNotes) {
        if (note.isDay1) {
          await ctx.db.patch(note._id, { isDay1: false, updatedAt: now });
        }
      }
    }

    return await ctx.db.insert('voiceNotes', {
      audioUrl,
      createdAt: now,
      duration: args.duration,
      habitId: args.habitId,
      isDay1: args.isDay1 ?? false,
      label,
      userId: identity.subject,
    });
  },
  returns: v.id('voiceNotes'),
});

/**
 * Update a voice note's label or Day 1 flag
 */
export const update = mutation({
  args: {
    isDay1: v.optional(v.boolean()),
    label: v.optional(v.string()),
    voiceNoteId: v.id('voiceNotes'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update voice notes');
    }

    const voiceNote = await ctx.db.get(args.voiceNoteId);
    if (!voiceNote) throw new Error('Voice note not found');

    // SEC-001: Ownership validation
    if (voiceNote.userId !== identity.subject) {
      throw new Error('Not authorized to update this voice note');
    }

    // SEC-003: Input validation - label
    let label: string | undefined;
    if (args.label !== undefined) {
      const labelResult = validateShortText(args.label, MAX_LABEL_LENGTH, 'Label');
      label = requireValid(labelResult, args.label);
    }

    const now = Date.now();

    if (args.isDay1) {
      const existingNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', voiceNote.habitId))
        .collect();

      for (const note of existingNotes) {
        if (note.isDay1 && note._id !== args.voiceNoteId) {
          await ctx.db.patch(note._id, { isDay1: false, updatedAt: now });
        }
      }
    }

    await ctx.db.patch(args.voiceNoteId, {
      ...(args.label !== undefined && { label }),
      ...(args.isDay1 !== undefined && { isDay1: args.isDay1 }),
      updatedAt: now,
    });

    return args.voiceNoteId;
  },
  returns: v.id('voiceNotes'),
});

/**
 * Delete a voice note
 */
export const remove = mutation({
  args: { voiceNoteId: v.id('voiceNotes') },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete voice notes');
    }

    const voiceNote = await ctx.db.get(args.voiceNoteId);
    if (!voiceNote) throw new Error('Voice note not found');

    // SEC-001: Ownership validation
    if (voiceNote.userId !== identity.subject) {
      throw new Error('Not authorized to delete this voice note');
    }

    await ctx.db.delete(args.voiceNoteId);
    return null;
  },
  returns: v.null(),
});
