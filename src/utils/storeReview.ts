/**
 * Store Review Utility
 *
 * Manages App Store rating prompt timing.
 * Triggers a happiness gate after milestone celebrations,
 * with guards for cooldown (90 days), minimum usage (5 completions),
 * and minimum install age (7 days).
 */

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';

const STORE_REVIEW_LAST_PROMPT_KEY = '@store_review_last_prompt';
const STORE_REVIEW_COMPLETION_COUNT_KEY = '@store_review_completion_count';
const STORE_REVIEW_INSTALL_TS_KEY = '@store_review_install_timestamp';

/** Minimum days between rating prompts */
const COOLDOWN_DAYS = 90;

/** Minimum total completions before prompting */
const MIN_COMPLETIONS = 5;

/** Minimum install age before prompting */
const MIN_INSTALL_AGE_DAYS = 7;

/** Streak milestones that should trigger a review prompt */
const REVIEW_ELIGIBLE_MILESTONES = new Set([7, 14, 30]);

const SUPPORT_EMAIL = 'support@chainday.app';

/**
 * Ensure install timestamp exists (first run for review system).
 */
async function ensureInstallTimestamp(): Promise<number> {
  try {
    const existing = await AsyncStorage.getItem(STORE_REVIEW_INSTALL_TS_KEY);
    if (existing) return Number.parseInt(existing, 10);

    // Migration path: if this is an existing user with completions already
    // tracked but no install timestamp yet, backdate to avoid over-delaying.
    const completionRaw = await AsyncStorage.getItem(
      STORE_REVIEW_COMPLETION_COUNT_KEY,
    );
    const hasHistoricalCompletions =
      !!completionRaw && Number.parseInt(completionRaw, 10) > 0;

    const now = Date.now();
    const installTs = hasHistoricalCompletions
      ? now - MIN_INSTALL_AGE_DAYS * 24 * 60 * 60 * 1000
      : now;

    await AsyncStorage.setItem(STORE_REVIEW_INSTALL_TS_KEY, String(installTs));
    return installTs;
  } catch {
    return Date.now();
  }
}

/**
 * Increment the completion counter. Call on every habit completion.
 */
export async function incrementCompletionCount(): Promise<number> {
  try {
    await ensureInstallTimestamp();

    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    const count = (raw ? Number.parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(
      STORE_REVIEW_COMPLETION_COUNT_KEY,
      String(count),
    );
    return count;
  } catch {
    return 0;
  }
}

/**
 * Get the current completion count.
 */
async function getCompletionCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORE_REVIEW_COMPLETION_COUNT_KEY);
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Check if enough time has passed since the last prompt.
 */
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

/**
 * Check if app has been installed long enough.
 */
async function isInstallAgeEligible(): Promise<boolean> {
  try {
    const installTs = await ensureInstallTimestamp();
    const daysInstalled = (Date.now() - installTs) / (1000 * 60 * 60 * 24);
    return daysInstalled >= MIN_INSTALL_AGE_DAYS;
  } catch {
    return false;
  }
}

/**
 * Record that a prompt was shown.
 */
async function recordPromptShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORE_REVIEW_LAST_PROMPT_KEY,
      String(Date.now()),
    );
  } catch {
    // Silent fail — non-critical
  }
}

async function openFeedbackChannel(): Promise<void> {
  const subject = encodeURIComponent('Chain Day Feedback');
  const body = encodeURIComponent(
    "I'd love to share feedback about Chain Day:\n\n",
  );
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  try {
    const canOpen = await Linking.canOpenURL(mailtoUrl);
    if (canOpen) {
      await Linking.openURL(mailtoUrl);
    }
  } catch {
    // Silent fail — feedback channel is non-critical
  }
}

function showHappinessGate(): void {
  Alert.alert('Enjoying Chain Day?', 'Your feedback helps us improve.', [
    {
      style: 'cancel',
      text: 'Not now',
    },
    {
      text: 'No',
      onPress: () => {
        void openFeedbackChannel();
      },
    },
    {
      text: 'Yes',
      onPress: () => {
        void StoreReview.requestReview();
      },
    },
  ]);
}

/**
 * Attempt to show the rating happiness gate after a milestone celebration.
 *
 * Guards:
 * - Only on eligible milestones (7, 14, 30 days)
 * - At least 5 total completions
 * - At least 7 days installed
 * - At least 90 days since last prompt
 * - Store review must be available on the platform
 *
 * @param milestoneDays - The streak milestone that was just celebrated
 */
export async function maybeRequestReview(
  milestoneDays: number,
): Promise<void> {
  try {
    // Only prompt on specific milestones
    if (!REVIEW_ELIGIBLE_MILESTONES.has(milestoneDays)) {
      return;
    }

    // Check platform support
    if (Platform.OS === 'web') return;
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return;

    // Check minimum completions
    const completions = await getCompletionCount();
    if (completions < MIN_COMPLETIONS) return;

    // Check install age
    const installAgeOk = await isInstallAgeEligible();
    if (!installAgeOk) return;

    // Check cooldown
    const cooldownOk = await isCooldownExpired();
    if (!cooldownOk) return;

    // All checks passed — show happiness gate and record prompt timestamp
    await recordPromptShown();
    showHappinessGate();
  } catch {
    // Silent fail — never break the app for a rating prompt
  }
}
