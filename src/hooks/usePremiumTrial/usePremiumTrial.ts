/**
 * usePremiumTrial Hook
 *
 * Manages the 7-day premium trial lifecycle:
 *  - Initializes the trial on first install (via AsyncStorage)
 *  - Provides days remaining, active/expired flags
 *  - Manages the trial-expired conversion screen visibility
 *  - Respects paid premium status (hides trial UI for paying customers)
 *
 * @example
 * const { isTrialActive, daysRemaining, isTrialExpired, dismissExpiredScreen } = usePremiumTrial({ isPremium });
 */

import { useState, useEffect, useCallback } from 'react';
import {
  initTrialIfNeeded,
  computeTrialStatus,
  getTrialStartDate,
  type TrialStatus,
} from '../../lib/trialStorage';

interface UsePremiumTrialOptions {
  /** Whether the user has an active paid premium subscription */
  isPremium: boolean;
}

export interface UsePremiumTrialReturn extends TrialStatus {
  /** Whether the trial countdown banner should be visible */
  showTrialBanner: boolean;
  /** Whether to show the trial-expired conversion screen */
  showExpiredScreen: boolean;
  /** Whether the hook has finished loading from AsyncStorage */
  isLoaded: boolean;
  /** Call when the user dismisses the expired screen (e.g., taps "Maybe later") */
  dismissExpiredScreen: () => void;
  /** Call when the user taps "Upgrade" on the expired screen or banner */
  onUpgradePress: () => void;
  /** Callback setter — wire this to open your paywall */
  setOnUpgrade: (fn: () => void) => void;
}

export function usePremiumTrial({ isPremium }: UsePremiumTrialOptions): UsePremiumTrialReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    hasStartedTrial: false,
    trialStartDate: null,
    daysRemaining: 0,
    isTrialActive: false,
    isTrialExpired: false,
  });
  const [expiredScreenDismissed, setExpiredScreenDismissed] = useState(false);
  const [upgradeCallback, setUpgradeCallback] = useState<(() => void) | null>(null);

  // Initialize or load trial on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      // If a trial date already exists, just read it; otherwise start it now
      const existing = await getTrialStartDate();
      const status = existing
        ? computeTrialStatus(existing)
        : await initTrialIfNeeded();

      if (!cancelled) {
        setTrialStatus(status);
        setIsLoaded(true);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const dismissExpiredScreen = useCallback(() => {
    setExpiredScreenDismissed(true);
  }, []);

  const onUpgradePress = useCallback(() => {
    upgradeCallback?.();
  }, [upgradeCallback]);

  const setOnUpgrade = useCallback((fn: () => void) => {
    setUpgradeCallback(() => fn);
  }, []);

  // If user is already a paying premium subscriber, hide all trial UI
  if (isPremium) {
    return {
      ...trialStatus,
      showTrialBanner: false,
      showExpiredScreen: false,
      isLoaded,
      dismissExpiredScreen,
      onUpgradePress,
      setOnUpgrade,
    };
  }

  const showTrialBanner = isLoaded && trialStatus.isTrialActive;
  const showExpiredScreen =
    isLoaded && trialStatus.isTrialExpired && !expiredScreenDismissed;

  return {
    ...trialStatus,
    showTrialBanner,
    showExpiredScreen,
    isLoaded,
    dismissExpiredScreen,
    onUpgradePress,
    setOnUpgrade,
  };
}
