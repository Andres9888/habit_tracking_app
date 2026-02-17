/**
 * Store Review — eligibility gates + trigger functions.
 * Triggers: 7-day streak, 3× perfect day, 50 total completions.
 * Guards: platform, min 5 completions, 90-day cooldown, max 3/year.
 * Storage helpers in storeReviewStorage.ts. Sentiment gate in useReviewPrompt.
 */
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  MIN_COMPLETIONS_FOR_RATING, RATING_COOLDOWN_DAYS,
  MAX_REVIEW_PROMPTS_PER_YEAR, REVIEW_MILESTONE_COMPLETIONS, REVIEW_PERFECT_DAY_COUNT,
} from '@/constants';
import {
  KEY_LAST_PROMPT, KEY_COMPLETION_COUNT, KEY_MILESTONE_50_FIRED,
  KEY_PERFECT_DAY_COUNT, KEY_PERFECT_DAY_LAST_DATE,
  readInt, writeInt, getRecentPromptTimestamps, savePromptTimestamps,
} from './storeReviewStorage';

export const MILESTONE_50_SENTINEL = -50;
const REVIEW_ELIGIBLE_STREAKS = new Set([7, 14, 30]);

/**
 * Increment total completion counter.
 * Returns MILESTONE_50_SENTINEL the first time the count crosses 50.
 */
export async function incrementCompletionCount(): Promise<number> {
  const prev = await readInt(KEY_COMPLETION_COUNT);
  const next = prev + 1;
  await writeInt(KEY_COMPLETION_COUNT, next);
  if (next >= REVIEW_MILESTONE_COMPLETIONS && prev < REVIEW_MILESTONE_COMPLETIONS) {
    const fired = await AsyncStorage.getItem(KEY_MILESTONE_50_FIRED);
    if (!fired) {
      await AsyncStorage.setItem(KEY_MILESTONE_50_FIRED, '1');
      return MILESTONE_50_SENTINEL;
    }
  }
  return next;
}

export async function getCompletionCount(): Promise<number> {
  return readInt(KEY_COMPLETION_COUNT);
}

/** Returns `true` the first time the 3rd unique perfect day is recorded. */
export async function recordPerfectDay(todayIso: string): Promise<boolean> {
  try {
    const lastDate = await AsyncStorage.getItem(KEY_PERFECT_DAY_LAST_DATE);
    if (lastDate === todayIso) return false;
    await AsyncStorage.setItem(KEY_PERFECT_DAY_LAST_DATE, todayIso);
    const prev = await readInt(KEY_PERFECT_DAY_COUNT);
    const next = prev + 1;
    await writeInt(KEY_PERFECT_DAY_COUNT, next);
    return next === REVIEW_PERFECT_DAY_COUNT;
  } catch {
    return false;
  }
}

export async function getPerfectDayCount(): Promise<number> {
  return readInt(KEY_PERFECT_DAY_COUNT);
}

/** Check whether all guards pass for showing a review prompt right now. */
export async function canRequestReview(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') return false;
    if (!(await StoreReview.isAvailableAsync())) return false;
    if ((await getCompletionCount()) < MIN_COMPLETIONS_FOR_RATING) return false;
    const lastRaw = await AsyncStorage.getItem(KEY_LAST_PROMPT);
    if (lastRaw) {
      const days = (Date.now() - Number.parseInt(lastRaw, 10)) / 86_400_000;
      if (days < RATING_COOLDOWN_DAYS) return false;
    }
    const recent = await getRecentPromptTimestamps();
    return recent.length < MAX_REVIEW_PROMPTS_PER_YEAR;
  } catch {
    return false;
  }
}

/** Record a prompt — updates 90-day cooldown + yearly history. */
export async function recordPromptShown(): Promise<void> {
  try {
    const now = Date.now();
    await AsyncStorage.setItem(KEY_LAST_PROMPT, String(now));
    await savePromptTimestamps([...(await getRecentPromptTimestamps()), now]);
  } catch { /* silent */ }
}

/** Legacy direct trigger after a streak milestone. Prefer useReviewPrompt for new code. */
export async function maybeRequestReview(milestoneDays: number): Promise<void> {
  try {
    if (!REVIEW_ELIGIBLE_STREAKS.has(milestoneDays)) return;
    if (!(await canRequestReview())) return;
    await recordPromptShown();
    await StoreReview.requestReview();
  } catch { /* silent */ }
}

/** Legacy direct trigger after positive analytics. Prefer useReviewPrompt for new code. */
export async function maybeRequestReviewFromAnalytics(
  avgCompletionRate: number, totalHabits: number,
): Promise<void> {
  try {
    if (avgCompletionRate < 70 || totalHabits < 3) return;
    if (!(await canRequestReview())) return;
    await recordPromptShown();
    await StoreReview.requestReview();
  } catch { /* silent */ }
}
