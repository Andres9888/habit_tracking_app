import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import { styles } from '../PredictionInsights.styles';

interface RiskWarningBoxProps {
  theme: any;
}

export function RiskWarningBox({ theme }: RiskWarningBoxProps) {
  return (
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
          This habit shows signs of weakening. Take action now to maintain your
          progress.
        </Text>
      </View>
    </View>
  );
}
