/**
 * Store Review Utility
 *
 * Optimized review flow:
 * - Only asks after positive moments
 * - Uses a happiness gate before requesting native App Store review
 * - Routes unhappy users to feedback instead of store review
 * - Enforces strict limits (90-day cooldown, 3 lifetime prompts)
 * - Tracks funnel events for prompt → rating intent conversion
 */

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';
import { logInteraction } from '../lib/analytics/interactions';

const STORE_REVIEW_LAST_PROMPT_KEY = '@store_review_last_prompt';
const STORE_REVIEW_COMPLETION_COUNT_KEY = '@store_review_completion_count';
const STORE_REVIEW_PROMPT_COUNT_KEY = '@store_review_prompt_count';
const STORE_REVIEW_HAPPY_RESPONSES_KEY = '@store_review_happy_responses';

const SUPPORT_EMAIL = 'support@chainday.app';

/** Minimum days between rating prompts */
const COOLDOWN_DAYS = 90;

/** Minimum total completions before prompting */
const MIN_COMPLETIONS = 5;

/** Maximum lifetime app store prompt attempts */
const MAX_LIFETIME_PROMPTS = 3;

/** Streak milestones that should trigger review eligibility */
const REVIEW_ELIGIBLE_MILESTONES = new Set([7, 14, 30]);

type PositiveMomentReason = 'streak_milestone' | 'perfect_day' | 'seven_day_streak';

interface ReviewTriggerContext {
  milestoneDays?: number;
  currentStreak?: number;
  isPerfectDay?: boolean;
}

interface ConversionSnapshot {
  promptsShown: number;
  happyResponses: number;
  conversionRate: number;
}

/**
 * Increment the completion counter. Call on every habit completion.
 */
export async function incrementCompletionCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    const count = (raw ? Number.parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(STORE_REVIEW_COMPLETION_COUNT_KEY, String(count));
    return count;
  } catch {
    return 0;
  }
}

async function getCompletionCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function getPromptCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_PROMPT_COUNT_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function getHappyResponseCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_HAPPY_RESPONSES_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function isCooldownExpired(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_LAST_PROMPT_KEY);
    if (!raw) return true;

    const lastPrompt = Number.parseInt(raw, 10);
    const daysSince = (Date.now() - lastPrompt) / (1000 * 60 * 60 * 24);
    return daysSince >= COOLDOWN_DAYS;
  } catch {
    return true;
  }
}

async function incrementCounter(key: string): Promise<number> {
  const raw = await AsyncStorage.getItem(key);
  const nextCount = (raw ? Number.parseInt(raw, 10) : 0) + 1;
  await AsyncStorage.setItem(key, String(nextCount));
  return nextCount;
}

async function recordPromptShown(): Promise<number> {
  await AsyncStorage.setItem(STORE_REVIEW_LAST_PROMPT_KEY, String(Date.now()));
  return incrementCounter(STORE_REVIEW_PROMPT_COUNT_KEY);
}

async function recordHappyResponse(): Promise<number> {
  return incrementCounter(STORE_REVIEW_HAPPY_RESPONSES_KEY);
}

function getPositiveMomentReason(
  context: ReviewTriggerContext,
): PositiveMomentReason | null {
  if (context.milestoneDays && REVIEW_ELIGIBLE_MILESTONES.has(context.milestoneDays)) {
    return 'streak_milestone';
  }

  if (context.isPerfectDay) {
    return 'perfect_day';
  }

  if ((context.currentStreak ?? 0) >= 7) {
    return 'seven_day_streak';
  }

  return null;
}

function askEnjoyingChainDay(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert('Enjoying Chain Day?', 'Your feedback helps us grow 💚', [
      {
        text: 'Not really',
        style: 'cancel',
        onPress: () => resolve(false),
      },
      {
        text: 'Yes!',
        onPress: () => resolve(true),
      },
    ]);
  });
}

async function openFeedbackForm(): Promise<void> {
  const subject = encodeURIComponent('Chain Day Feedback');
  const body = encodeURIComponent(
    'Hi Chain Day team,\n\nI wanted to share some feedback:\n\n'
  );

  const feedbackUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  const canOpen = await Linking.canOpenURL(feedbackUrl);

  if (canOpen) {
    await Linking.openURL(feedbackUrl);
  }
}

export async function getReviewConversionSnapshot(): Promise<ConversionSnapshot> {
  const [promptsShown, happyResponses] = await Promise.all([
    getPromptCount(),
    getHappyResponseCount(),
  ]);

  return {
    promptsShown,
    happyResponses,
    conversionRate: promptsShown > 0 ? happyResponses / promptsShown : 0,
  };
}

/**
 * Attempt to show store review prompt after a positive moment.
 */
export async function maybeRequestReview(
  context: ReviewTriggerContext,
): Promise<void> {
  try {
    const positiveMoment = getPositiveMomentReason(context);
    if (!positiveMoment) {
      return;
    }

    if (Platform.OS === 'web') return;

    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return;

    const [completions, cooldownOk, promptCount] = await Promise.all([
      getCompletionCount(),
      isCooldownExpired(),
      getPromptCount(),
    ]);

    if (completions < MIN_COMPLETIONS || !cooldownOk || promptCount >= MAX_LIFETIME_PROMPTS) {
      return;
    }

    logInteraction('rating_happiness_gate_shown', {
      positiveMoment,
      currentStreak: context.currentStreak,
      milestoneDays: context.milestoneDays,
      isPerfectDay: context.isPerfectDay,
      promptCount,
    });

    const isHappy = await askEnjoyingChainDay();

    if (!isHappy) {
      logInteraction('rating_happiness_gate_declined', {
        positiveMoment,
      });
      await openFeedbackForm();
      logInteraction('rating_feedback_form_opened', {
        positiveMoment,
      });
      return;
    }

    const nextPromptCount = await recordPromptShown();
    const happyResponses = await recordHappyResponse();

    logInteraction('rating_prompt_requested', {
      positiveMoment,
      lifetimePromptCount: nextPromptCount,
      happyResponses,
      conversionRate: happyResponses / nextPromptCount,
    });

    await StoreReview.requestReview();
  } catch {
    // Silent fail — never break the app for a rating prompt
  }
}
