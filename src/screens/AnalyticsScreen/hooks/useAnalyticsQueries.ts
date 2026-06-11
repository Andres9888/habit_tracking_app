/**
 * Analytics Queries Hook
 *
 * PERF: Subscribes to the single combined dashboard query instead of five
 * separate queries that each re-loaded habits + tracking server-side.
 */

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export const useAnalyticsQueries = () => {
  const dashboard = useQuery(api.analytics.getAnalyticsDashboard);

  const weeklyInsightsRaw = dashboard?.weeklyInsights;
  const weeklyInsights = (
    weeklyInsightsRaw && 'weekOverWeekChange' in weeklyInsightsRaw
      ? weeklyInsightsRaw
      : undefined
  ) as
    | import('../../../components/WeeklyInsightsCard').WeeklyInsights
    | undefined;

  const isLoading = !dashboard?.overviewStats;

  return {
    overviewStats: dashboard?.overviewStats,
    strengthDistribution: dashboard?.strengthDistribution,
    trendData: dashboard?.trendData,
    complianceData: dashboard?.complianceData,
    weeklyInsights: weeklyInsights ?? undefined,
    isLoading,
  };
};
