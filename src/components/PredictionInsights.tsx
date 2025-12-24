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
    high: {
      backgroundColor: theme.custom.colors.error[50],
      icon: AlertTriangle,
      iconColor: theme.custom.colors.error[600],
      label: 'High Risk',
      textColor: theme.custom.colors.error[700],
    },
    low: {
      backgroundColor: theme.custom.colors.success[50],
      icon: CheckCircle,
      iconColor: theme.custom.colors.success[600],
      label: 'Low Risk',
      textColor: theme.custom.colors.success[700],
    },
    medium: {
      backgroundColor: theme.custom.colors.warning[50],
      icon: Activity,
      iconColor: theme.custom.colors.warning[600],
      label: 'Moderate Risk',
      textColor: theme.custom.colors.warning[700],
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
      <Icon color={config.iconColor} size={16} />
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
    declining: {
      color: theme.custom.colors.error[600],
      icon: TrendingDown,
      label: 'Declining',
    },
    improving: {
      color: theme.custom.colors.success[600],
      icon: TrendingUp,
      label: 'Improving',
    },
    stable: {
      color: theme.custom.colors.gray[600],
      icon: Activity,
      label: 'Stable',
    },
  }[trend];

  const Icon = config.icon;

  return (
    <View style={styles.trendIndicator}>
      <Icon color={config.color} size={20} />
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
          {
            color: config.color,
            fontFamily: theme.custom.fontFamilies.monospace,
          },
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
      <TrendIndicator
        change={strengthChange}
        theme={theme}
        trend={data.trend}
      />

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
                backgroundColor: theme.custom.colors.primary[500],
                borderRadius: theme.custom.borderRadius.small,
                width: `${data.confidence}%`,
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
              borderLeftColor: theme.custom.colors.error[500],
              borderLeftWidth: 3,
              borderRadius: theme.custom.borderRadius.medium,
            },
          ]}
        >
          <AlertTriangle
            color={theme.custom.colors.error[600]}
            size={20}
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
              This habit shows signs of weakening. Take action now to maintain
              your progress.
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
              {
                color: theme.custom.colors.gray[900],
                fontWeight: '600',
                marginBottom: 8,
              },
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
          Predictions are based on your recent tracking patterns and historical
          data. Results may vary based on your consistency.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  confidenceBar: {
    height: 8,
    overflow: 'hidden',
  },
  confidenceContainer: {
    gap: 6,
  },
  confidenceFill: {
    height: '100%',
  },
  container: {
    gap: 16,
  },
  methodologyNote: {
    paddingTop: 8,
  },
  predictionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  suggestionItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  suggestionsContainer: {
    paddingTop: 8,
  },
  trendIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
});
