/**
 * useTrialCountdown Hook
 * Calculates days remaining in trial and handles banner visibility
 */

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useTrialCountdown() {
  const subscription = useQuery(
    api.subscriptions.getCurrentUserSubscription,
    {}
  );
  const isLoading = subscription === undefined;
  const isTrialActive = subscription?.status === 'trialing';
  const expirationDate = subscription?.trialEndsAt ?? subscription?.expiresAt;

  // Calculate days remaining in trial
  const daysRemaining = useMemo(() => {
    if (!isTrialActive || !expirationDate) return null;

    const now = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Clamp to 0 minimum
    return Math.max(0, diffDays);
  }, [isTrialActive, expirationDate]);

  // Show banner if user is trialing and has days remaining
  const shouldShowBanner =
    !isLoading && isTrialActive && daysRemaining !== null && daysRemaining >= 0;

  return {
    daysRemaining,
    isLoading,
    shouldShowBanner,
  };
}
