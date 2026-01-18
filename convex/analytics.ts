/**
 * Analytics API
 *
 * Dashboard statistics, strength distribution, trends, and insights.
 *
 * Decomposed structure:
 * - analytics/ - Types and helpers
 * - analyticsOverview.ts - Overview and rankings
 * - analyticsDistribution.ts - Strength distribution
 * - analyticsTrend.ts - 30-day trend data
 * - analyticsCompliance.ts - 90-day compliance heatmap
 * - analyticsWeekly.ts - Weekly insights
 */

// Re-export types and helpers
export * from './analytics/index';

// Overview and rankings
export { getOverviewStats } from './analyticsOverview';

// Distribution chart
export { getStrengthDistribution } from './analyticsDistribution';

// Trend data
export { get30DayTrend } from './analyticsTrend';

// Compliance heatmap
export { getComplianceData } from './analyticsCompliance';

// Weekly insights
export { getWeeklyInsights, generateWeeklyInsights } from './analyticsWeekly';
