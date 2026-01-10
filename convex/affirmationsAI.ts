/**
 * AI-Generated Affirmations API
 *
 * Premium feature that uses OpenAI to create personalized affirmations
 * based on the user's habit data, motivation, and identity.
 *
 * Scientific Basis:
 * - Personalized affirmations are more effective (Sherman & Cohen, 2006)
 * - Context-specific self-talk improves outcomes (Hatzigeorgiadis et al., 2011)
 * - Identity-based affirmations align with Atomic Habits methodology
 */

import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';
import OpenAI from 'openai';
import {
  MAX_AFFIRMATIONS_PER_HABIT,
  buildAffirmationPrompt,
  parseAffirmationsResponse,
  generatedAffirmationReturn,
} from './affirmations/index';
import type { HabitContext, GeneratedAffirmation } from './affirmations/index';

/**
 * Generate AI-powered affirmations based on habit context
 */
export const generateAffirmations = action({
  args: {
    count: v.optional(v.number()),
    habitId: v.id('habits'), // 1-5, default 3
  },
  handler: async (ctx, args): Promise<GeneratedAffirmation[]> => {
    const count = Math.min(Math.max(args.count ?? 3, 1), 5);

    const habit = await ctx.runQuery(api.habits.get, { habitId: args.habitId });
    if (!habit) throw new Error('Habit not found');

    const existingAffirmations = await ctx.runQuery(
      api.affirmations.listByHabit,
      { habitId: args.habitId }
    );

    const remainingSlots =
      MAX_AFFIRMATIONS_PER_HABIT - existingAffirmations.length;
    if (remainingSlots <= 0) {
      throw new Error(
        `Maximum ${MAX_AFFIRMATIONS_PER_HABIT} affirmations per habit. Remove some to generate new ones.`
      );
    }

    const actualCount = Math.min(count, remainingSlots);

    const habitContext: HabitContext = {
      identity: habit.identity,
      name: habit.name,
      notes: habit.notes,
      vizSuccessBody: habit.vizSuccessBody,
      vizSuccessEmotion: habit.vizSuccessEmotion,
      vizSuccessMind: habit.vizSuccessMind,
      why: habit.why,
    };

    const existingTexts = existingAffirmations.map((a) => a.text);
    const prompt = buildAffirmationPrompt(
      habitContext,
      existingTexts,
      actualCount
    );

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) throw new Error('OpenAI API key not configured');

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const completion = await openai.chat.completions.create({
      messages: [{ content: prompt, role: 'user' }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error('No response from AI');

    const generatedAffirmations = parseAffirmationsResponse(responseContent);
    if (generatedAffirmations.length === 0) {
      throw new Error('Failed to generate valid affirmations');
    }

    return generatedAffirmations;
  },
  returns: v.array(generatedAffirmationReturn),
});

/**
 * Generate and save AI affirmations in one call
 */
export const generateAndSaveAffirmations = action({
  args: {
    count: v.optional(v.number()),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args): Promise<string[]> => {
    const generated = await ctx.runAction(
      api.affirmations.generateAffirmations,
      { count: args.count, habitId: args.habitId }
    );

    const savedIds: string[] = [];

    for (const aff of generated) {
      const id = await ctx.runMutation(api.affirmations.create, {
        habitId: args.habitId,
        text: aff.text,
        type: aff.type,
      });
      savedIds.push(id);
    }

    return savedIds;
  },
  returns: v.array(v.string()),
});
