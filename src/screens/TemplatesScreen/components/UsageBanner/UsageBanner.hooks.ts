/**
 * Business logic for UsageBanner
 */

import { useMemo } from 'react';
import { FREE_HABIT_LIMIT } from '../../../../constants';
import type { UsageBannerData } from './UsageBanner.types';

export function useUsageBanner(
  userHabitCount: number,
  isPremiumUser: boolean
): UsageBannerData {
  return useMemo(() => {
    const limit = FREE_HABIT_LIMIT;
    const used = Math.min(userHabitCount, limit);
    const dots = Array.from({ length: limit }, (_, i) => i < used);
    const showBanner = !isPremiumUser;
    const showUnlockCta = !isPremiumUser && used >= limit;

    return { dots, limit, showBanner, showUnlockCta, used };
  }, [userHabitCount, isPremiumUser]);
}
