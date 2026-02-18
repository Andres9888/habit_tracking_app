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
 * Structured error response for AI affirmation generation
 */
interface AffirmationError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  retryable: boolean;
}

/**
 * Format and log errors with structured context
 */
function formatAffirmationError(
  code: string,
  message: string,
  context?: Record<string, unknown>,
  retryable: boolean = false
): AffirmationError {
  const error: AffirmationError = {
    code,
    message,
    retryable,
  };

  if (context) {
    error.context = context;
  }

  // Log structured error for monitoring
  console.error(
    `[AffirmationError:${code}] ${message}`,
    context ? JSON.stringify(context, null, 2) : ''
  );

  return error;
}

/**
 * Generate AI-powered affirmations based on habit context
 *
 * Comprehensive error handling covers:
 * - Habit not found (data error)
 * - Quota exceeded (user state)
 * - API misconfiguration (server error)
 * - API rate limits/failures (transient errors)
 * - Invalid AI response (data quality error)
 * - Parsing failures (data format error)
 */
export const generateAffirmations = action({
  args: {
    count: v.optional(v.number()),
    habitId: v.id('habits'), // 1-5, default 3
  },
  handler: async (ctx, args): Promise<GeneratedAffirmation[]> => {
    let validatedCount: number;
    try {
      const rawCount = args.count ?? 3;
      if (typeof rawCount !== 'number' || isNaN(rawCount)) {
        throw new Error('Count must be a valid number');
      }
      validatedCount = Math.min(Math.max(Math.floor(rawCount), 1), 5);
    } catch (err) {
      const error = formatAffirmationError(
        'INVALID_COUNT',
        'Invalid affirmation count parameter',
        {
          provided: args.count,
          min: 1,
          max: 5,
          error: err instanceof Error ? err.message : String(err),
        }
      );
      throw new Error(JSON.stringify(error));
    }

    // Fetch habit with error handling
    let habit;
    try {
      habit = await ctx.runQuery(api.habits.get, { habitId: args.habitId });
    } catch (err) {
      const error = formatAffirmationError(
        'HABIT_FETCH_ERROR',
        'Failed to fetch habit data',
        {
          habitId: args.habitId,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    if (!habit) {
      const error = formatAffirmationError(
        'HABIT_NOT_FOUND',
        `Habit with ID ${args.habitId} not found`,
        {
          habitId: args.habitId,
          suggestion: 'Verify the habit ID is correct and exists',
        }
      );
      throw new Error(JSON.stringify(error));
    }

    // Fetch existing affirmations with error handling
    let existingAffirmations;
    try {
      existingAffirmations = await ctx.runQuery(
        api.affirmations.listByHabit,
        { habitId: args.habitId }
      );
    } catch (err) {
      const error = formatAffirmationError(
        'AFFIRMATIONS_FETCH_ERROR',
        'Failed to fetch existing affirmations',
        {
          habitId: args.habitId,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    // Check quota
    const remainingSlots = MAX_AFFIRMATIONS_PER_HABIT - existingAffirmations.length;
    if (remainingSlots <= 0) {
      const error = formatAffirmationError(
        'QUOTA_EXCEEDED',
        'Cannot generate more affirmations: quota limit reached',
        {
          habitId: args.habitId,
          habitName: habit.name,
          current: existingAffirmations.length,
          maximum: MAX_AFFIRMATIONS_PER_HABIT,
          suggestion: `Remove ${existingAffirmations.length - MAX_AFFIRMATIONS_PER_HABIT + 1} affirmations to add more`,
        }
      );
      throw new Error(JSON.stringify(error));
    }

    const actualCount = Math.min(validatedCount, remainingSlots);

    // Build habit context with fallback values
    const habitContext: HabitContext = {
      identity: habit.identity || 'someone who pursues this habit',
      name: habit.name || 'unnamed habit',
      notes: habit.notes || '',
      vizSuccessBody: habit.vizSuccessBody || '',
      vizSuccessEmotion: habit.vizSuccessEmotion || '',
      vizSuccessMind: habit.vizSuccessMind || '',
      why: habit.why || '',
    };

    // Build prompt with error handling
    let prompt: string;
    try {
      const existingTexts = existingAffirmations.map((a) => a.text);
      prompt = buildAffirmationPrompt(habitContext, existingTexts, actualCount);
    } catch (err) {
      const error = formatAffirmationError(
        'PROMPT_BUILD_ERROR',
        'Failed to construct AI prompt',
        {
          habitId: args.habitId,
          count: actualCount,
          error: err instanceof Error ? err.message : String(err),
        }
      );
      throw new Error(JSON.stringify(error));
    }

    // Validate configuration
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      const error = formatAffirmationError(
        'MISSING_API_KEY',
        'OpenAI API key not configured in environment',
        {
          suggestion: 'Contact administrator: OPENAI_API_KEY environment variable not set',
        }
      );
      throw new Error(JSON.stringify(error));
    }

    // Call OpenAI with comprehensive error handling
    let completion;
    try {
      const openai = new OpenAI({ apiKey: openaiApiKey });
      completion = await openai.chat.completions.create({
        messages: [{ content: prompt, role: 'user' }],
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
    } catch (err) {
      // Distinguish between different OpenAI error types
      let errorCode = 'OPENAI_API_ERROR';
      let retryable = true;

      if (err instanceof OpenAI.APIError) {
        if (err.status === 401 || err.status === 403) {
          errorCode = 'OPENAI_AUTH_ERROR';
          retryable = false;
        } else if (err.status === 429) {
          errorCode = 'OPENAI_RATE_LIMIT';
          retryable = true;
        } else if (err.status >= 500) {
          errorCode = 'OPENAI_SERVER_ERROR';
          retryable = true;
        }
      }

      const error = formatAffirmationError(
        errorCode,
        `OpenAI API call failed: ${err instanceof OpenAI.APIError ? err.message : 'Unknown error'}`,
        {
          error: err instanceof Error ? err.message : String(err),
          suggestion: retryable
            ? 'Please try again in a moment'
            : 'Contact administrator: OpenAI API configuration issue',
        },
        retryable
      );
      throw new Error(JSON.stringify(error));
    }

    // Validate API response structure
    if (!completion) {
      const error = formatAffirmationError(
        'EMPTY_RESPONSE',
        'OpenAI returned empty completion object',
        {
          suggestion: 'This is likely a transient error, please retry',
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    const responseContent = completion.choices?.[0]?.message?.content;
    if (!responseContent) {
      const error = formatAffirmationError(
        'MISSING_RESPONSE_CONTENT',
        'OpenAI response missing content in message',
        {
          choicesLength: completion.choices?.length ?? 0,
          firstChoiceMessage: completion.choices?.[0]?.message ? 'present' : 'missing',
          suggestion: 'This is likely a transient error, please retry',
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    // Parse AI response with error handling
    let generatedAffirmations: GeneratedAffirmation[];
    try {
      generatedAffirmations = parseAffirmationsResponse(responseContent);
    } catch (err) {
      const error = formatAffirmationError(
        'PARSE_ERROR',
        'Failed to parse AI-generated affirmations',
        {
          responseLength: responseContent.length,
          responsePreview: responseContent.substring(0, 200),
          error: err instanceof Error ? err.message : String(err),
          suggestion: 'The AI response format was invalid, please try again',
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    // Validate generated affirmations
    if (!Array.isArray(generatedAffirmations)) {
      const error = formatAffirmationError(
        'INVALID_RESPONSE_TYPE',
        'Parsed affirmations is not an array',
        {
          type: typeof generatedAffirmations,
          suggestion: 'The AI response format was invalid, please try again',
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    if (generatedAffirmations.length === 0) {
      const error = formatAffirmationError(
        'EMPTY_RESULTS',
        'AI generated no valid affirmations',
        {
          requested: actualCount,
          responseLength: responseContent.length,
          suggestion: 'The AI was unable to generate affirmations for this habit, please try again',
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    return generatedAffirmations;
  },
  returns: v.array(generatedAffirmationReturn),
});

/**
 * Generate and save AI affirmations in one call
 *
 * Error handling covers:
 * - Generation failures (retried)
 * - Save failures (partial success tracking)
 * - Validation errors
 */
export const generateAndSaveAffirmations = action({
  args: {
    count: v.optional(v.number()),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args): Promise<string[]> => {
    // Step 1: Generate affirmations with error propagation
    let generated: GeneratedAffirmation[];
    try {
      generated = await ctx.runAction(
        api.affirmations.generateAffirmations,
        { count: args.count, habitId: args.habitId }
      );
    } catch (err) {
      // Re-format for consistency, the error from generateAffirmations
      // already has structured format
      if (err instanceof Error && err.message.startsWith('{')) {
        throw err; // Already formatted
      }
      const error = formatAffirmationError(
        'GENERATION_FAILED',
        'Failed to generate affirmations',
        {
          habitId: args.habitId,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
      throw new Error(JSON.stringify(error));
    }

    if (!Array.isArray(generated) || generated.length === 0) {
      const error = formatAffirmationError(
        'NO_AFFIRMATIONS_GENERATED',
        'Generation returned no affirmations to save',
        {
          habitId: args.habitId,
          count: args.count,
        }
      );
      throw new Error(JSON.stringify(error));
    }

    // Step 2: Save affirmations with partial success support
    const savedIds: string[] = [];
    const failedSaves: Array<{
      text: string;
      error: string;
    }> = [];

    for (let i = 0; i < generated.length; i++) {
      const aff = generated[i];

      try {
        const id = await ctx.runMutation(api.affirmations.create, {
          habitId: args.habitId,
          text: aff.text,
          type: aff.type,
        });
        savedIds.push(id);
      } catch (err) {
        // Log but continue saving others
        const errorMsg =
          err instanceof Error ? err.message : String(err);
        console.error(
          `[SaveAffirmation:${i}] Failed to save: "${aff.text.substring(0, 50)}..."`,
          errorMsg
        );
        failedSaves.push({
          text: aff.text.substring(0, 100),
          error: errorMsg,
        });
      }
    }

    // Step 3: Report results
    if (savedIds.length === 0) {
      const error = formatAffirmationError(
        'ALL_SAVES_FAILED',
        'Generated affirmations could not be saved',
        {
          habitId: args.habitId,
          generated: generated.length,
          saved: 0,
          failures: failedSaves.slice(0, 3), // First 3 failures for context
        }
      );
      throw new Error(JSON.stringify(error));
    }

    if (failedSaves.length > 0) {
      console.warn(
        `[SaveAffirmations] Partial success: ${savedIds.length}/${generated.length} saved`,
        {
          habitId: args.habitId,
          failures: failedSaves.length,
        }
      );
    }

    return savedIds;
  },
  returns: v.array(v.string()),
});
