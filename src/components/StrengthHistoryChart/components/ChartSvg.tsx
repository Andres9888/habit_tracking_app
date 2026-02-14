import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Circle, Path } from 'react-native-svg';

import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../StrengthHistoryChart.styles';
import type { ChartPoint } from '../StrengthHistoryChart.types';

interface ChartSvgProps {
  chartWidth: number;
  chartHeight: number;
  padding: number;
  linePath: string;
  points: ChartPoint[];
  height: number;
}

export function ChartSvg({
  chartWidth,
  chartHeight,
  padding,
  linePath,
  points,
  height,
}: ChartSvgProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: theme.custom.colors.gray[50],
          borderRadius: theme.custom.borderRadius.medium,
          height,
        },
      ]}
    >
      <Svg height={chartHeight} width={chartWidth}>
        {/* Grid lines */}
        <Line
          stroke={theme.custom.colors.gray[300]}
          strokeWidth='1'
          x1={padding}
          x2={chartWidth - padding}
          y1={chartHeight - padding}
          y2={chartHeight - padding}
        />
        <Line
          stroke={theme.custom.colors.gray[200]}
          strokeDasharray='4,4'
          strokeWidth='1'
          x1={padding}
          x2={chartWidth - padding}
          y1={chartHeight / 2}
          y2={chartHeight / 2}
        />
        <Line
          stroke={theme.custom.colors.gray[300]}
          strokeWidth='1'
          x1={padding}
          x2={chartWidth - padding}
          y1={padding}
          y2={padding}
        />

        {/* Main line path */}
        <Path
          d={linePath}
          fill='none'
          stroke={theme.custom.colors.primary[500]}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2.5'
        />

        {/* Data point circles */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            fill={theme.custom.colors.primary[500]}
            r={4}
            stroke={themeColors.background}
            strokeWidth='2'
          />
        ))}
      </Svg>
    </View>
  );
}
