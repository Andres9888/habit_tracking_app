/**
 * Business logic for UsageBanner
 */

import { useMemo } from 'react';
import type { UsageBannerData } from './UsageBanner.types';

// Legacy free-tier limit retained only so this banner keeps rendering when
// it's still wired in. The trial-then-paywall gate at AuthGate means
// in-app users always have an entitlement, so `showBanner` is always false.
const LEGACY_FREE_HABIT_LIMIT = 3;

export function useUsageBanner(
  userHabitCount: number,
  isPremiumUser: boolean
): UsageBannerData {
  return useMemo(() => {
    const limit = LEGACY_FREE_HABIT_LIMIT;
    const used = Math.min(userHabitCount, limit);
    const dots = Array.from({ length: limit }, (_, i) => i < used);
    const showBanner = !isPremiumUser;
    const showUnlockCta = !isPremiumUser && used >= limit;

    return { dots, limit, showBanner, showUnlockCta, used };
  }, [userHabitCount, isPremiumUser]);
}
