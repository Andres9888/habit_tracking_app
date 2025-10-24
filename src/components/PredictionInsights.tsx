/**
 * PredictionInsights Component
 * Phase 3: Habit Strength Prediction & Risk Assessment
 * Based on UX Specification Section 2.1 (Prediction Insights - Premium)
 *
 * Features:
 * - 7-day habit strength forecast
 * - Risk assessment: "At risk of decline" warnings
 * - Confidence levels displayed
 * - Suggested actions to improve strength
 * - Premium gated feature
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
} from 'lucide-react-native';

export type RiskLevel = 'low' | 'medium' | 'high';
export type TrendDirection = 'improving' | 'stable' | 'declining';

interface PredictionData {
  /** Predicted strength in 7 days (0-100) */
  predictedStrength: number;

  /** Current strength (0-100) */
  currentStrength: number;

  /** Confidence level (0-100) */
  confidence: number;

  /** Risk assessment */
  riskLevel: RiskLevel;

  /** Trend direction */
  trend: TrendDirection;

  /** Suggested actions to improve */
  suggestions: string[];
}

interface PredictionInsightsProps {
  /** Prediction data */
  data: PredictionData;

  /** Show detailed suggestions */
  showSuggestions?: boolean;
}

/**
 * Risk Badge Component
 */
function RiskBadge({ level, theme }: { level: RiskLevel; theme: any }) {
  const config = {
    low: {
      icon: CheckCircle,
      label: 'Low Risk',
      backgroundColor: theme.custom.colors.success[50],
      textColor: theme.custom.colors.success[700],
      iconColor: theme.custom.colors.success[600],
    },
    medium: {
      icon: Activity,
      label: 'Moderate Risk',
      backgroundColor: theme.custom.colors.warning[50],
      textColor: theme.custom.colors.warning[700],
      iconColor: theme.custom.colors.warning[600],
    },
    high: {
      icon: AlertTriangle,
      label: 'High Risk',
      backgroundColor: theme.custom.colors.error[50],
      textColor: theme.custom.colors.error[700],
      iconColor: theme.custom.colors.error[600],
    },
  }[level];

  const Icon = config.icon;

  return (
    <View
      style={[
        styles.riskBadge,
        {
          backgroundColor: config.backgroundColor,
          borderRadius: theme.custom.borderRadius.small,
        },
      ]}
    >
      <Icon size={16} color={config.iconColor} />
      <Text
        style={[
          theme.custom.typography.caption,
          { color: config.textColor, fontWeight: '600' },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

/**
 * Trend Indicator Component
 */
function TrendIndicator({
  trend,
  change,
  theme,
}: {
  trend: TrendDirection;
  change: number;
  theme: any;
}) {
  const config = {
    improving: {
      icon: TrendingUp,
      label: 'Improving',
      color: theme.custom.colors.success[600],
    },
    stable: {
      icon: Activity,
      label: 'Stable',
      color: theme.custom.colors.gray[600],
    },
    declining: {
      icon: TrendingDown,
      label: 'Declining',
      color: theme.custom.colors.error[600],
    },
  }[trend];

  const Icon = config.icon;

  return (
    <View style={styles.trendIndicator}>
      <Icon size={20} color={config.color} />
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          { color: config.color, fontWeight: '600' },
        ]}
      >
        {config.label}
      </Text>
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          { color: config.color, fontFamily: theme.custom.fontFamilies.monospace },
        ]}
      >
        {change > 0 ? '+' : ''}
        {change.toFixed(0)}%
      </Text>
    </View>
  );
}

/**
 * Main PredictionInsights Component
 */
export default function PredictionInsights({
  data,
  showSuggestions = true,
}: PredictionInsightsProps) {
  const theme = useAppTheme();

  const strengthChange = data.predictedStrength - data.currentStrength;

  return (
    <View style={styles.container}>
      {/* Prediction Header */}
      <View style={styles.predictionHeader}>
        <View>
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[600] },
            ]}
          >
            7-Day Forecast
          </Text>
          <Text
            style={[
              theme.custom.typography.heading1,
              {
                color: theme.custom.colors.gray[900],
                fontFamily: theme.custom.fontFamilies.monospace,
              },
            ]}
          >
            {data.predictedStrength.toFixed(0)}%
          </Text>
        </View>
        <RiskBadge level={data.riskLevel} theme={theme} />
      </View>

      {/* Trend Indicator */}
      <TrendIndicator trend={data.trend} change={strengthChange} theme={theme} />

      {/* Confidence Level */}
      <View style={styles.confidenceContainer}>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[600] },
          ]}
        >
          Confidence Level
        </Text>
        <View
          style={[
            styles.confidenceBar,
            {
              backgroundColor: theme.custom.colors.gray[200],
              borderRadius: theme.custom.borderRadius.small,
            },
          ]}
        >
          <View
            style={[
              styles.confidenceFill,
              {
                width: `${data.confidence}%`,
                backgroundColor: theme.custom.colors.primary[500],
                borderRadius: theme.custom.borderRadius.small,
              },
            ]}
          />
        </View>
        <Text
          style={[
            theme.custom.typography.caption,
            {
              color: theme.custom.colors.gray[700],
              fontFamily: theme.custom.fontFamilies.monospace,
            },
          ]}
        >
          {data.confidence.toFixed(0)}%
        </Text>
      </View>

      {/* Risk Assessment Message */}
      {data.riskLevel === 'high' && (
        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.custom.colors.error[50],
              borderLeftWidth: 3,
              borderLeftColor: theme.custom.colors.error[500],
              borderRadius: theme.custom.borderRadius.medium,
            },
          ]}
        >
          <AlertTriangle
            size={20}
            color={theme.custom.colors.error[600]}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                theme.custom.typography.bodyMedium,
                { color: theme.custom.colors.error[700], fontWeight: '600' },
              ]}
            >
              At Risk of Decline
            </Text>
            <Text
              style={[
                theme.custom.typography.bodySmall,
                { color: theme.custom.colors.error[600], marginTop: 4 },
              ]}
            >
              This habit shows signs of weakening. Take action now to maintain your
              progress.
            </Text>
          </View>
        </View>
      )}

      {/* Suggested Actions */}
      {showSuggestions && data.suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text
            style={[
              theme.custom.typography.bodyMedium,
              { color: theme.custom.colors.gray[900], fontWeight: '600', marginBottom: 8 },
            ]}
          >
            Suggested Actions
          </Text>
          {data.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <View
                style={[
                  styles.bulletPoint,
                  { backgroundColor: theme.custom.colors.primary[500] },
                ]}
              />
              <Text
                style={[
                  theme.custom.typography.bodySmall,
                  { color: theme.custom.colors.gray[700], flex: 1 },
                ]}
              >
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Methodology Note */}
      <View style={styles.methodologyNote}>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500], fontStyle: 'italic' },
          ]}
        >
          Predictions are based on your recent tracking patterns and historical data.
          Results may vary based on your consistency.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceContainer: {
    gap: 6,
  },
  confidenceBar: {
    height: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  suggestionsContainer: {
    paddingTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  methodologyNote: {
    paddingTop: 8,
  },
});
