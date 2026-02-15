
import React from 'react';
import { View, Text } from 'react-native';

import { TrendingUp, TrendingDown, Activity } from 'lucide-react-native';

import type { AppTheme } from '../../../theme';
import type { TrendDirection } from '../PredictionInsights.types';
import { styles } from '../PredictionInsights.styles';

interface TrendIndicatorProps {
  trend: TrendDirection;
  change: number;
  theme: AppTheme;
}

const TREND_CONFIG = {
  declining: {
    colorKey: 'error' as const,
    icon: TrendingDown,
    label: 'Declining',
  },
  improving: {
    colorKey: 'success' as const,
    icon: TrendingUp,
    label: 'Improving',
  },
  stable: {
    colorKey: 'gray' as const,
    icon: Activity,
    label: 'Stable',
  },
};

export function TrendIndicator({ trend, change, theme }: TrendIndicatorProps) {
  const config = TREND_CONFIG[trend];
  const color = theme.custom.colors[config.colorKey][600];
  const Icon = config.icon;

  return (
    <View style={styles.trendIndicator}>
      <Icon color={color} size={20} />
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          { color, fontWeight: '600' },
        ]}
      >
        {config.label}
      </Text>
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          {
            color,
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
