/**
 * Store Review — AsyncStorage helpers
 *
 * Low-level read/write primitives for storeReview.ts.
 * Kept separate to stay under the max-lines lint limit.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const KEY_LAST_PROMPT = '@store_review_last_prompt';
export const KEY_COMPLETION_COUNT = '@store_review_completion_count';
/** JSON array of UTC timestamps (ms) for each prompt shown within the last year */
export const KEY_PROMPT_HISTORY = '@store_review_prompt_history';
export const KEY_PERFECT_DAY_COUNT = '@store_review_perfect_day_count';
/** ISO date string of the last day a perfect day was recorded */
export const KEY_PERFECT_DAY_LAST_DATE = '@store_review_perfect_day_last_date';
/** Set to '1' once the 50-completion milestone has fired */
export const KEY_MILESTONE_50_FIRED = '@store_review_milestone_50_fired';

// ─── Primitive helpers ────────────────────────────────────────────────────────

/** Read a stored integer (returns 0 on miss/error) */
export async function readInt(key: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

/** Write an integer to storage */
export async function writeInt(key: string, value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch {
    // Silent fail — non-critical
  }
}

// ─── Prompt history (yearly cap) ─────────────────────────────────────────────

/**
 * Load prompt timestamps from the past 365 days.
 * Entries older than one year are pruned automatically.
 */
export async function getRecentPromptTimestamps(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PROMPT_HISTORY);
    const all: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    return all.filter((ts) => ts > yearAgo);
  } catch {
    return [];
  }
}

/** Save the pruned + appended timestamp list */
export async function savePromptTimestamps(timestamps: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_PROMPT_HISTORY, JSON.stringify(timestamps));
  } catch {
    // Silent fail
  }
}
