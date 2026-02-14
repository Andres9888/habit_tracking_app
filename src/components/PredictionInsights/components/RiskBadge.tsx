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

const RISK_COLORS = {
  high: { bg: '#FFEBEE', icon: '#D32F2F', text: '#B71C1C' },
  low: { bg: '#E8F5E9', icon: '#2E7D32', text: '#1B5E20' },
  medium: { bg: '#fef3c7', icon: '#D97706', text: '#92400E' },
};

const RISK_ICONS = {
  high: AlertTriangle,
  low: CheckCircle,
  medium: Activity,
};

const RISK_LABELS = {
  high: 'High Risk',
  low: 'Low Risk',
  medium: 'Moderate Risk',
};

export function RiskBadge({ level, theme }: RiskBadgeProps) {
  const riskColors = RISK_COLORS[level];
  const Icon = RISK_ICONS[level];

  return (
    <View
      style={[
        styles.riskBadge,
        {
          backgroundColor: riskColors.bg,
          borderRadius: theme.custom.borderRadius.small,
        },
      ]}
    >
      <Icon color={riskColors.icon} size={16} />
      <Text
        style={[
          theme.custom.typography.caption,
          { color: riskColors.text, fontWeight: '600' },
        ]}
      >
        {RISK_LABELS[level]}
      </Text>
    </View>
  );
}
