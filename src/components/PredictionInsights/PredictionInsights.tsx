/**
 * PredictionInsights Component
 * Phase 3: Habit Strength Prediction & Risk Assessment
 * Based on UX Specification Section 2.1 (Prediction Insights - Premium)
 */

import React from 'react';
import { View, Text } from 'react-native';

import { useAppTheme } from '../../theme';

import { styles } from './PredictionInsights.styles';
import type { PredictionInsightsProps } from './PredictionInsights.types';
import {
  ConfidenceLevel,
  RiskBadge,
  RiskWarningBox,
  SuggestedActions,
  TrendIndicator,
} from './components';

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

      <TrendIndicator
        change={strengthChange}
        theme={theme}
        trend={data.trend}
      />

      <ConfidenceLevel confidence={data.confidence} theme={theme} />

      {data.riskLevel === 'high' && <RiskWarningBox theme={theme} />}

      {showSuggestions && (
        <SuggestedActions suggestions={data.suggestions} theme={theme} />
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
