/**
 * Trial Storage Utilities
 *
 * Manages the 7-day premium trial state in AsyncStorage.
 * Tracks trial start date and provides derived state (days remaining, expired).
 *
 * Storage key: '@premium_trial_start'
 */

import { safeGetString, safeSetString, safeRemoveItem } from '../utils/storage/safeStorage';

const TRIAL_START_KEY = '@premium_trial_start';
export const TRIAL_DURATION_DAYS = 7;

export interface TrialStatus {
  /** Whether a trial has been started */
  hasStartedTrial: boolean;
  /** ISO date string when trial was started, or null */
  trialStartDate: string | null;
  /** Days remaining in the trial (0 when expired or no trial) */
  daysRemaining: number;
  /** Whether the trial is currently active (started and not expired) */
  isTrialActive: boolean;
  /** Whether the trial was started but has now expired */
  isTrialExpired: boolean;
}

/**
 * Read the trial start date from AsyncStorage.
 * Returns null if no trial has been started.
 */
export async function getTrialStartDate(): Promise<string | null> {
  const value = await safeGetString(TRIAL_START_KEY, '');
  return value || null;
}

/**
 * Store the trial start date (ISO string) in AsyncStorage.
 * Call this once when the user first installs the app.
 */
export async function setTrialStartDate(isoDate: string): Promise<void> {
  await safeSetString(TRIAL_START_KEY, isoDate);
}

/**
 * Remove the trial start date (for testing / admin reset).
 */
export async function clearTrialStartDate(): Promise<void> {
  await safeRemoveItem(TRIAL_START_KEY);
}

/**
 * Compute the number of full days remaining in the trial from a given start date.
 * Returns 0 if the trial has expired or hasn't started.
 */
export function computeDaysRemaining(trialStartDateIso: string | null): number {
  if (!trialStartDateIso) return 0;

  const start = new Date(trialStartDateIso);
  if (Number.isNaN(start.getTime())) return 0;

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const elapsed = Math.floor((now.getTime() - start.getTime()) / msPerDay);
  const remaining = TRIAL_DURATION_DAYS - elapsed;
  return Math.max(0, remaining);
}

/**
 * Derive the full TrialStatus object from a stored ISO date string.
 */
export function computeTrialStatus(trialStartDateIso: string | null): TrialStatus {
  if (!trialStartDateIso) {
    return {
      hasStartedTrial: false,
      trialStartDate: null,
      daysRemaining: 0,
      isTrialActive: false,
      isTrialExpired: false,
    };
  }

  const daysRemaining = computeDaysRemaining(trialStartDateIso);
  const isTrialActive = daysRemaining > 0;
  const isTrialExpired = !isTrialActive; // started but now 0 days remaining

  return {
    hasStartedTrial: true,
    trialStartDate: trialStartDateIso,
    daysRemaining,
    isTrialActive,
    isTrialExpired,
  };
}

/**
 * Initialize the trial if it hasn't been started yet.
 * Call this on first app launch (e.g., inside an effect after auth loads).
 * Returns the trial status after initialization.
 */
export async function initTrialIfNeeded(): Promise<TrialStatus> {
  const existing = await getTrialStartDate();
  if (existing) {
    return computeTrialStatus(existing);
  }

  const now = new Date().toISOString();
  await setTrialStartDate(now);
  return computeTrialStatus(now);
}
