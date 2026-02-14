import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react-native';

import { styles } from '../PredictionInsights.styles';
import type { RiskLevel } from '../PredictionInsights.types';
import type { AppTheme } from '../../../theme';

interface RiskBadgeProps {
  level: RiskLevel;
  theme: AppTheme;
}

const RISK_CONFIG = {
  high: {
    colorKey: 'error' as const,
    icon: AlertTriangle,
    label: 'High Risk',
  },
  low: {
    colorKey: 'success' as const,
    icon: CheckCircle,
    label: 'Low Risk',
  },
  medium: {
    colorKey: 'warning' as const,
    icon: Activity,
    label: 'Moderate Risk',
  },
};

export function RiskBadge({ level, theme }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];
  const colorSet = theme.custom.colors[config.colorKey];
  const Icon = config.icon;

  return (
    <View
      style={[
        styles.riskBadge,
        {
          backgroundColor: colorSet[50],
          borderRadius: theme.custom.borderRadius.small,
        },
      ]}
    >
      <Icon color={colorSet[600]} size={16} />
      <Text
        style={[
          theme.custom.typography.caption,
          { color: colorSet[700], fontWeight: '600' },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}
