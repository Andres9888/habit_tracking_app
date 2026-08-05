/**
 * XAxisLabels Component
 *
 * Renders time-based labels below the chart.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface XAxisLabelsProps {
  /** Labels to display along the X-axis */
  labels: string[];
  /** Height of the label area */
  height: number;
}

/**
 * Renders evenly-spaced X-axis labels below the chart.
 */
export const XAxisLabels = React.memo(function XAxisLabels({
  labels,
  height,
}: XAxisLabelsProps) {
  const { colors: themeColors } = useThemeColors();
  // Guard against null/undefined labels
  const safeLabels = labels ?? [];

  return (
    <View
      className='absolute bottom-0 left-0 right-0 flex-row justify-between px-4'
      style={{ height }}
    >
      {safeLabels.map((label, i) => (
        <Text key={i} className='text-xs' style={{ color: themeColors.text.tertiary }}>
          {label ?? ''}
        </Text>
      ))}
    </View>
  );
});
