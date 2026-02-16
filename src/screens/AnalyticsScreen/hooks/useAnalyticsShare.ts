/**
 * useAnalyticsShare Hook
 * Generates share card data from analytics overview stats
 */

import { useState, useCallback, useMemo } from 'react';
import type { ShareCardData } from '../../../components/ShareCardGenerator/ShareCardGenerator.types';
import type { MilestoneLevel } from '../../../components/ShareCardGenerator/ShareCardGenerator.types';
import type { OverviewStats } from '../AnalyticsScreen.types';

export function useAnalyticsShare(
  overviewStats: OverviewStats | null,
  userName: string = ''
) {
  const [showShareCard, setShowShareCard] = useState(false);

  const shareData = useMemo<ShareCardData | null>(() => {
    if (!overviewStats || overviewStats.totalHabits === 0) {
      return null;
    }

    // Find the strongest habit to showcase
    const strongestHabit = overviewStats.rankedHabits?.[0];
    if (!strongestHabit) {
      return null;
    }

    // Determine milestone level based on overall completion rate
    let milestoneLevel: MilestoneLevel;
    const rate = overviewStats.overallCompletionRate;

    if (rate >= 80) {
      milestoneLevel = 'automatic';
    } else if (rate >= 60) {
      milestoneLevel = 'strong';
    } else if (rate >= 40) {
      milestoneLevel = 'developing';
    } else if (rate >= 20) {
      milestoneLevel = 'building';
    } else {
      milestoneLevel = 'starting';
    }

    return {
      habitName: strongestHabit.name,
      milestoneLevel,
      strengthPercentage: Math.round(rate),
      userName,
    };
  }, [overviewStats, userName]);

  const handleSharePress = useCallback(() => {
    if (shareData) {
      setShowShareCard(true);
    }
  }, [shareData]);

  const handleShareClose = useCallback(() => {
    setShowShareCard(false);
  }, []);

  return {
    shareData,
    showShareCard,
    handleSharePress,
    handleShareClose,
    canShare: shareData !== null,
  };
}
