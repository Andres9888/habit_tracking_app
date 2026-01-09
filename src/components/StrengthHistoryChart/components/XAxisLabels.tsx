import React from 'react';
import { View, Text } from 'react-native';

import { useAppTheme } from '../../../theme';
import { styles } from '../StrengthHistoryChart.styles';

interface XAxisLabelsProps {
  dataLength: number;
}

export function XAxisLabels({ dataLength }: XAxisLabelsProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.xAxis}>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        {dataLength} days ago
      </Text>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        Today
      </Text>
    </View>
  );
}
