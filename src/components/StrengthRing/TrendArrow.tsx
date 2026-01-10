/**
 * TrendArrow - Displays an up, down, or stable trend indicator
 */
import React from 'react';
import { Text } from 'react-native';

import { TREND_CONFIG } from './StrengthRing.constants';
import { styles } from './StrengthRing.styles';

interface TrendArrowProps {
  trend: 'up' | 'down' | 'stable';
  fontSize: number;
}

export const TrendArrow = React.memo(function TrendArrow({
  trend,
  fontSize,
}: TrendArrowProps) {
  const { symbol, color } = TREND_CONFIG[trend];
  return (
    <Text style={[styles.trendArrow, { color, fontSize: fontSize * 0.7 }]}>
      {symbol}
    </Text>
  );
});
