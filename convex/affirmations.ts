/**
 * Affirmations API
 *
 * Positive self-talk cards tied to specific habits.
 * Based on:
 * - Self-affirmation theory (Steele, 1988)
 * - Sports psychology self-talk research (Hatzigeorgiadis et al., 2011)
 *
 * Three types:
 * - identity: "I am someone who..." (most powerful)
 * - motivational: "I can do hard things"
 * - instructional: "Progress, not perfection"
 */

import { v } from 'convex/values';
import { action, mutation, query } from './_generated/server';
import { api } from './_generated/api';
import OpenAI from 'openai';
import { Id } from './_generated/dataModel';
import {
  requireAuthenticatedUser,
  requireOwnedDocumentById,
  requireOwnedHabit,
} from './security';

const MAX_AFFIRMATIONS_PER_HABIT = 10;
const MAX_TEXT_LENGTH = 200;

/**
 * List all affirmations for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Sort by creation date (newest first)
    return affirmations.sort((a, b) => b.createdAt - a.createdAt);
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      habitId: v.id('habits'),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Create a new affirmation for a habit
 */
export const create = mutation({
  args: {
    habitId: v.id('habits'),
    text: v.string(),
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim();
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    // Validation
    if (!text) {
      throw new Error('Affirmation text is required');
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new Error(
        `Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`
      );
    }

    // Check habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check limit per habit
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
      userId,
      text,
      type: args.type,
      updatedAt: now,
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
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    const updates: {
      text?: string;
      type?: 'identity' | 'motivational' | 'instructional';
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.text !== undefined) {
      const text = args.text.trim();
      if (!text) {
        throw new Error('Affirmation text is required');
      }
      if (text.length > MAX_TEXT_LENGTH) {
        throw new Error(
          `Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`
        );
      }
      updates.text = text;
    }

    if (args.type !== undefined) {
      updates.type = args.type;
    }

    await ctx.db.patch(args.id, updates);
    return null;
  },
  returns: v.null(),
});

/**
 * Delete an affirmation
 */
export const remove = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});

// ============================================================================
// SCHEDULED DELIVERY (Premium Feature)
// ============================================================================

/**
 * Validate time string format (HH:MM 24-hour)
 */
function isValidTimeFormat(time: string): boolean {
  const match = time.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  return match !== null;
}

/**
 * Validate days of week array
 */
function isValidDaysOfWeek(days: number[]): boolean {
  if (days.length === 0 || days.length > 7) return false;
  return days.every((day) => day >= 0 && day <= 6 && Number.isInteger(day));
}

/**
 * Schedule delivery for an affirmation (Premium feature)
 *
 * Sets up recurring push notifications at specified times.
 * Supports daily (every day) or weekly (specific days) frequency.
 */
export const scheduleDelivery = mutation({
  args: {
    daysOfWeek: v.optional(v.array(v.number())),

    // "HH:MM" format
    frequency: v.union(v.literal('daily'), v.literal('weekly')),
    id: v.id('affirmations'),
    scheduledTime: v.string(), // Required for weekly
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    // Validate time format
    if (!isValidTimeFormat(args.scheduledTime)) {
      throw new Error(
        'Invalid time format. Use HH:MM 24-hour format (e.g., "08:30")'
      );
    }

    // Validate weekly frequency requires daysOfWeek
    if (args.frequency === 'weekly') {
      if (!args.daysOfWeek || args.daysOfWeek.length === 0) {
        throw new Error(
          'Weekly frequency requires at least one day of the week'
        );
      }
      if (!isValidDaysOfWeek(args.daysOfWeek)) {
        throw new Error(
          'Invalid days of week. Use numbers 0-6 (Sunday-Saturday)'
        );
      }
    }

    // Update affirmation with schedule settings
    await ctx.db.patch(args.id, {
      daysOfWeek: args.frequency === 'weekly' ? args.daysOfWeek : undefined,
      frequency: args.frequency,
      isScheduleEnabled: true,
      scheduledTime: args.scheduledTime,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Update the notification ID for an affirmation
 *
 * Called from the client after scheduling the local notification.
 * Stores the notification identifier for future cancellation.
 */
export const updateNotificationId = mutation({
  args: {
    id: v.id('affirmations'),
    notificationId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    await ctx.db.patch(args.id, {
      notificationId: args.notificationId,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Toggle scheduled delivery on/off
 *
 * Preserves schedule settings when disabled so they can be re-enabled easily.
 */
export const toggleSchedule = mutation({
  args: {
    enabled: v.boolean(),
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    // Can only enable if schedule is configured
    if (args.enabled && !affirmation.scheduledTime) {
      throw new Error(
        'Cannot enable schedule: no scheduled time configured. Use scheduleDelivery first.'
      );
    }

    await ctx.db.patch(args.id, {
      isScheduleEnabled: args.enabled,
      // Clear notification ID when disabling (client will cancel notification)
      notificationId: args.enabled ? affirmation.notificationId : undefined,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Cancel scheduled delivery for an affirmation
 *
 * Removes all schedule settings from the affirmation.
 */
export const cancelSchedule = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    await ctx.db.patch(args.id, {
      daysOfWeek: undefined,
      frequency: undefined,
      isScheduleEnabled: undefined,
      lastDeliveredAt: undefined,
      notificationId: undefined,
      scheduledTime: undefined,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Record a successful delivery
 *
 * Called when a notification is delivered and opened.
 * Used for analytics and tracking delivery patterns.
 */
export const recordDelivery = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const affirmation = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );

    await ctx.db.patch(args.id, {
      lastDeliveredAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Get all scheduled affirmations for a user
 *
 * Returns affirmations with active schedules, useful for
 * re-scheduling notifications after app restart.
 */
export const listScheduled = query({
  args: {
    habitId: v.optional(v.id('habits')),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);

    // Get scheduled affirmations for specific habit or all scheduled
    const affirmations = args.habitId
      ? await ctx.db
          .query('affirmations')
          .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
          .filter((q) => q.eq(q.field('userId'), userId))
          .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
          .collect()
      : await ctx.db
          .query('affirmations')
          .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
          .filter((q) => q.eq(q.field('userId'), userId))
          .collect();

    return affirmations;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Get a single affirmation with full schedule details
 */
export const get = query({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    return await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'affirmations'>),
      args.id,
      userId,
      'affirmation'
    );
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

// ============================================================================
// AI-GENERATED AFFIRMATIONS (Premium Feature)
// ============================================================================

/**
 * Type definitions for habit context used in AI generation
 */
interface HabitContext {
  name: string;
  why?: string;
  identity?: string;
  notes?: string;
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
}

/**
 * Type for generated affirmation before saving
 */
interface GeneratedAffirmation {
  text: string;
  type: 'identity' | 'motivational' | 'instructional';
}

function buildAffirmationPrompt(
  habitContext: HabitContext,
  existingAffirmations: string[],
  count: number
): string {
  const contextParts: string[] = [`Habit: ${habitContext.name}`];

  if (habitContext.why) {
    contextParts.push(`Why (user's motivation): "${habitContext.why}"`);
  }
  if (habitContext.identity) {
    contextParts.push(`Identity (who they're becoming): "${habitContext.identity}"`);
  }
  if (habitContext.notes) {
    contextParts.push(`Notes: "${habitContext.notes}"`);
  }
  if (habitContext.vizSuccessBody) {
    contextParts.push(`Success visualization (Body): "${habitContext.vizSuccessBody}"`);
  }
  if (habitContext.vizSuccessMind) {
    contextParts.push(`Success visualization (Mind): "${habitContext.vizSuccessMind}"`);
  }
  if (habitContext.vizSuccessEmotion) {
    contextParts.push(`Success visualization (Emotion): "${habitContext.vizSuccessEmotion}"`);
  }

  const existingPart =
    existingAffirmations.length > 0
      ? `\\n\\nExisting affirmations (avoid similar ones):\\n${existingAffirmations.map((a) => `- "${a}"`).join('\\n')}`
      : '';

  return `You are an expert in positive psychology, self-affirmation theory (Steele, 1988), and habit formation science.

Generate exactly ${count} personalized affirmations for a user building this habit:

${contextParts.join('\\n')}${existingPart}

REQUIREMENTS:
1. Each affirmation MUST be under 200 characters
2. Create a mix of three types:
   - identity: "I am..." statements about who they're becoming (most powerful)
   - motivational: Encouraging statements about capability and progress
   - instructional: Guiding statements about approach and mindset

3. Make them:
   - Personal and specific to THIS habit (not generic)
   - Present tense (not future)
   - Positive framing (not negative)
   - Emotionally resonant based on their "why" and visualization
   - Actionable and believable

4. If user provided identity/why statements, incorporate their language

RESPOND WITH EXACTLY THIS JSON FORMAT (no other text):
{
  \"affirmations\": [
    {\"text\": \"...\", \"type\": \"identity\"},
    {\"text\": \"...\", \"type\": \"motivational\"},
    {\"text\": \"...\", \"type\": \"instructional\"}
  ]
}`;
          .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
          .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
          .collect()
      : await ctx.db
          .query('affirmations')
          .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
          .collect();

    return affirmations;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Get a single affirmation with full schedule details
 */
export const get = query({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

// ============================================================================
// AI-GENERATED AFFIRMATIONS (Premium Feature)
// ============================================================================

/**
 * Type definitions for habit context used in AI generation
 */
interface HabitContext {
  name: string;
  why?: string;
  identity?: string;
  notes?: string;
  vizSuccessBody?: string;
  vizSuccessMind?: string;
  vizSuccessEmotion?: string;
}

/**
 * Type for generated affirmation before saving
 */
interface GeneratedAffirmation {
  text: string;
  type: 'identity' | 'motivational' | 'instructional';
}

/**
 * Build the prompt for AI affirmation generation
 */
function buildAffirmationPrompt(
  habitContext: HabitContext,
  existingAffirmations: string[],
  count: number
): string {
  const contextParts: string[] = [`Habit: ${habitContext.name}`];

  if (habitContext.why) {
    contextParts.push(`Why (user's motivation): "${habitContext.why}"`);
  }
  if (habitContext.identity) {
    contextParts.push(
      `Identity (who they're becoming): "${habitContext.identity}"`
    );
  }
  if (habitContext.notes) {
    contextParts.push(`Notes: "${habitContext.notes}"`);
  }
  if (habitContext.vizSuccessBody) {
    contextParts.push(
      `Success visualization (Body): "${habitContext.vizSuccessBody}"`
    );
  }
  if (habitContext.vizSuccessMind) {
    contextParts.push(
      `Success visualization (Mind): "${habitContext.vizSuccessMind}"`
    );
  }
  if (habitContext.vizSuccessEmotion) {
    contextParts.push(
      `Success visualization (Emotion): "${habitContext.vizSuccessEmotion}"`
    );
  }

  const existingPart =
    existingAffirmations.length > 0
      ? `\n\nExisting affirmations (avoid similar ones):\n${existingAffirmations.map((a) => `- "${a}"`).join('\n')}`
      : '';

  return `You are an expert in positive psychology, self-affirmation theory (Steele, 1988), and habit formation science.

Generate exactly ${count} personalized affirmations for a user building this habit:

${contextParts.join('\n')}${existingPart}

REQUIREMENTS:
1. Each affirmation MUST be under 200 characters
2. Create a mix of three types:
   - identity: "I am..." statements about who they're becoming (most powerful)
   - motivational: Encouraging statements about capability and progress
   - instructional: Guiding statements about approach and mindset

3. Make them:
   - Personal and specific to THIS habit (not generic)
   - Present tense (not future)
   - Positive framing (not negative)
   - Emotionally resonant based on their "why" and visualization
   - Actionable and believable

4. If user provided identity/why statements, incorporate their language

RESPOND WITH EXACTLY THIS JSON FORMAT (no other text):
{
  "affirmations": [
    {"text": "...", "type": "identity"},
    {"text": "...", "type": "motivational"},
    {"text": "...", "type": "instructional"}
  ]
}`;
}

/**
 * Parse and validate the AI response
 */
function parseAffirmationsResponse(response: string): GeneratedAffirmation[] {
  // Extract JSON from potential markdown code blocks
  let jsonStr = response.trim();

  // Handle ```json ... ``` format
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  if (!parsed.affirmations || !Array.isArray(parsed.affirmations)) {
    throw new Error('Invalid response format: missing affirmations array');
  }

  const validTypes = new Set(['identity', 'motivational', 'instructional']);
  const validated: GeneratedAffirmation[] = [];

  for (const aff of parsed.affirmations) {
    if (!aff.text || typeof aff.text !== 'string') {
      continue; // Skip invalid entries
    }

    const text = aff.text.trim();
    if (text.length < 3 || text.length > MAX_TEXT_LENGTH) {
      continue; // Skip entries that don't meet length requirements
    }

    const type = validTypes.has(aff.type) ? aff.type : 'motivational';

    validated.push({ text, type });
  }

  return validated;
}

/**
 * Generate AI-powered affirmations based on habit context
 *
 * Premium feature that uses OpenAI to create personalized affirmations
 * based on the user's habit data, motivation, and identity.
 *
 * Scientific Basis:
 * - Personalized affirmations are more effective (Sherman & Cohen, 2006)
 * - Context-specific self-talk improves outcomes (Hatzigeorgiadis et al., 2011)
 * - Identity-based affirmations align with Atomic Habits methodology
 */
export const generateAffirmations = action({
  args: {
    /** Number of affirmations to generate (1-5, default 3) */
    count: v.optional(v.number()),

    habitId: v.id('habits'),
  },
  handler: async (ctx, args): Promise<GeneratedAffirmation[]> => {
    const count = Math.min(Math.max(args.count ?? 3, 1), 5);

    // Fetch habit data for context
    const habit = await ctx.runQuery(api.habits.get, { habitId: args.habitId });

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check remaining slots (MAX_AFFIRMATIONS_PER_HABIT = 10)
    const existingAffirmations = await ctx.runQuery(
      api.affirmations.listByHabit,
      {
        habitId: args.habitId,
      }
    );

    const remainingSlots =
      MAX_AFFIRMATIONS_PER_HABIT - existingAffirmations.length;
    if (remainingSlots <= 0) {
      throw new Error(
        `Maximum ${MAX_AFFIRMATIONS_PER_HABIT} affirmations per habit. Remove some to generate new ones.`
      );
    }

    // Adjust count if we'd exceed the limit
    const actualCount = Math.min(count, remainingSlots);

    // Build context for AI
    const habitContext: HabitContext = {
      identity: habit.identity,
      name: habit.name,
      notes: habit.notes,
      vizSuccessBody: habit.vizSuccessBody,
      vizSuccessEmotion: habit.vizSuccessEmotion,
      vizSuccessMind: habit.vizSuccessMind,
      why: habit.why,
    };

    // Get existing affirmation texts to avoid duplicates
    const existingTexts = existingAffirmations.map((a) => a.text);

    // Build prompt
    const prompt = buildAffirmationPrompt(
      habitContext,
      existingTexts,
      actualCount
    );

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const completion = await openai.chat.completions.create({
      messages: [{ content: prompt, role: 'user' }],
      model: 'gpt-4o-mini', // Cost-effective for this use case
      response_format: { type: 'json_object' },
      temperature: 0.7, // Balance creativity and consistency
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    // Parse and validate response
    const generatedAffirmations = parseAffirmationsResponse(responseContent);

    if (generatedAffirmations.length === 0) {
      throw new Error('Failed to generate valid affirmations');
    }

    return generatedAffirmations;
  },
  returns: v.array(
    v.object({
      text: v.string(),
      type: v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      ),
    })
  ),
});

/**
 * Generate and save AI affirmations in one call
 *
 * Convenience wrapper that generates affirmations and saves them directly.
 * Returns the IDs of created affirmations.
 */
export const generateAndSaveAffirmations = action({
  args: {
    /** Number of affirmations to generate (1-5, default 3) */
    count: v.optional(v.number()),

    habitId: v.id('habits'),
  },
  handler: async (ctx, args): Promise<string[]> => {
    // Generate affirmations
    const generated = await ctx.runAction(
      api.affirmations.generateAffirmations,
      {
        count: args.count,
        habitId: args.habitId,
      }
    );

    // Save each affirmation
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
