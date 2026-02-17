/**
 * trialStorage tests
 *
 * Verifies trial lifecycle logic:
 *  - computeDaysRemaining arithmetic
 *  - computeTrialStatus state machine
 *  - initTrialIfNeeded idempotency
 *  - AsyncStorage integration (via safeStorage wrappers)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  computeDaysRemaining,
  computeTrialStatus,
  getTrialStartDate,
  setTrialStartDate,
  clearTrialStartDate,
  initTrialIfNeeded,
  TRIAL_DURATION_DAYS,
} from '../trialStorage';

jest.mock('@react-native-async-storage/async-storage');

const TRIAL_KEY = '@premium_trial_start';

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── computeDaysRemaining ────────────────────────────────────────────

describe('computeDaysRemaining', () => {
  it('returns 0 when trialStartDate is null', () => {
    expect(computeDaysRemaining(null)).toBe(0);
  });

  it('returns 0 for an invalid date string', () => {
    expect(computeDaysRemaining('not-a-date')).toBe(0);
  });

  it('returns TRIAL_DURATION_DAYS when trial started right now', () => {
    const now = new Date().toISOString();
    expect(computeDaysRemaining(now)).toBe(TRIAL_DURATION_DAYS);
  });

  it('returns 6 after 1 day has elapsed', () => {
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    expect(computeDaysRemaining(oneDayAgo)).toBe(TRIAL_DURATION_DAYS - 1);
  });

  it('returns 1 on the last day of the trial (6 days elapsed)', () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    expect(computeDaysRemaining(sixDaysAgo)).toBe(1);
  });

  it('returns 0 when trial has fully expired (7 days elapsed)', () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(computeDaysRemaining(sevenDaysAgo)).toBe(0);
  });

  it('returns 0 (not negative) when far past expiry', () => {
    const wayPast = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(computeDaysRemaining(wayPast)).toBe(0);
  });
});

// ─── computeTrialStatus ─────────────────────────────────────────────

describe('computeTrialStatus', () => {
  it('returns hasStartedTrial=false when no date provided', () => {
    const status = computeTrialStatus(null);
    expect(status.hasStartedTrial).toBe(false);
    expect(status.isTrialActive).toBe(false);
    expect(status.isTrialExpired).toBe(false);
    expect(status.daysRemaining).toBe(0);
  });

  it('marks trial as active when freshly started', () => {
    const now = new Date().toISOString();
    const status = computeTrialStatus(now);
    expect(status.hasStartedTrial).toBe(true);
    expect(status.isTrialActive).toBe(true);
    expect(status.isTrialExpired).toBe(false);
    expect(status.daysRemaining).toBe(TRIAL_DURATION_DAYS);
    expect(status.trialStartDate).toBe(now);
  });

  it('marks trial as expired after TRIAL_DURATION_DAYS days', () => {
    const expired = new Date(
      Date.now() - TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    const status = computeTrialStatus(expired);
    expect(status.hasStartedTrial).toBe(true);
    expect(status.isTrialActive).toBe(false);
    expect(status.isTrialExpired).toBe(true);
    expect(status.daysRemaining).toBe(0);
  });

  it('returns daysRemaining=3 when 4 days have elapsed', () => {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const status = computeTrialStatus(fourDaysAgo);
    expect(status.daysRemaining).toBe(3);
    expect(status.isTrialActive).toBe(true);
  });
});

// ─── AsyncStorage integration ────────────────────────────────────────

describe('getTrialStartDate', () => {
  it('returns null when AsyncStorage has no value', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await getTrialStartDate();
    expect(result).toBeNull();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(TRIAL_KEY);
  });

  it('returns stored ISO string when present', async () => {
    const iso = '2026-01-01T00:00:00.000Z';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(iso);
    const result = await getTrialStartDate();
    expect(result).toBe(iso);
  });
});

describe('setTrialStartDate', () => {
  it('writes the ISO string to AsyncStorage', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    const iso = '2026-02-17T00:00:00.000Z';
    await setTrialStartDate(iso);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(TRIAL_KEY, iso);
  });
});

describe('clearTrialStartDate', () => {
  it('removes the trial key from AsyncStorage', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    await clearTrialStartDate();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TRIAL_KEY);
  });
});

// ─── initTrialIfNeeded ───────────────────────────────────────────────

describe('initTrialIfNeeded', () => {
  it('writes a new trial date if none exists and returns active status', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const status = await initTrialIfNeeded();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      TRIAL_KEY,
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    );
    expect(status.hasStartedTrial).toBe(true);
    expect(status.isTrialActive).toBe(true);
    expect(status.daysRemaining).toBe(TRIAL_DURATION_DAYS);
  });

  it('does NOT overwrite an existing trial date', async () => {
    const existingIso = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(existingIso);

    const status = await initTrialIfNeeded();

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(status.trialStartDate).toBe(existingIso);
    expect(status.daysRemaining).toBe(TRIAL_DURATION_DAYS - 2);
  });

  it('returns expired status if existing trial has passed', async () => {
    const expired = new Date(
      Date.now() - (TRIAL_DURATION_DAYS + 1) * 24 * 60 * 60 * 1000
    ).toISOString();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(expired);

    const status = await initTrialIfNeeded();

    expect(status.isTrialExpired).toBe(true);
    expect(status.isTrialActive).toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
