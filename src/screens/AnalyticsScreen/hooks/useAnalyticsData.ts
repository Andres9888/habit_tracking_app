/**
 * Analytics Data Hook
 * Fetches and manages analytics data from Convex
 */

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export function useAnalyticsData() {
  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsightsRaw = useQuery(api.analytics.getWeeklyInsights);
  const weeklyInsights = (
    weeklyInsightsRaw && 'weekOverWeekChange' in weeklyInsightsRaw
      ? weeklyInsightsRaw
      : undefined
  ) as
    | import('../../../components/WeeklyInsightsCard').WeeklyInsights
    | undefined;

  const isLoading = !overviewStats;

  return {
    overviewStats,
    strengthDistribution,
    trendData,
    complianceData,
    weeklyInsights: weeklyInsights ?? undefined,
    isLoading,
  };
}
