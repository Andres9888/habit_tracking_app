/**
 * StrengthTimelineChart Component - SVG area chart for habit strength evolution
 */

import React, { useMemo } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

import { getStrengthColor } from '../strengthUtils';
import {
  DEFAULT_HEIGHT,
  DEFAULT_CHART_COLOR,
  MIN_HISTORY_LENGTH,
  PATH_ANIMATION_DURATION,
} from './constants';
import { generateChartPaths } from './pathUtils';
import { generateXAxisLabels, calculateTrendDescription } from './axisUtils';
import { useChartDimensions } from './useChartDimensions';
import { usePathAnimation } from './usePathAnimation';
import { usePulseAnimation } from './usePulseAnimation';
import { ChartSvg } from './ChartSvg';
import { XAxisLabels } from './XAxisLabels';
import { NoDataState, BuildingHistoryState } from './EmptyStates';
import type { StrengthTimelineChartProps } from './types';

export function StrengthTimelineChart({
  strengthHistory,
  habitColor,
  height = DEFAULT_HEIGHT,
}: StrengthTimelineChartProps) {
  const { colors: themeColors } = useThemeColors();
  const dimensions = useChartDimensions(height);

  const chartColor = useMemo(() => {
    if (habitColor) return habitColor;
    if (strengthHistory.length > 0)
      return getStrengthColor(strengthHistory.at(-1)?.strength ?? 0);
    return DEFAULT_CHART_COLOR;
  }, [habitColor, strengthHistory]);

  const { areaPath, linePath, lastPoint } = useMemo(
    () => generateChartPaths(strengthHistory, dimensions),
    [strengthHistory, dimensions]
  );

  const xAxisLabels = useMemo(
    () => generateXAxisLabels(strengthHistory.length, dimensions),
    [strengthHistory.length, dimensions]
  );

  const { animatedLineProps } = usePathAnimation({
    historyLength: strengthHistory.length,
  });
  const { pulsingRingProps } = usePulseAnimation({ lastPoint });
  const trendDescription = useMemo(
    () => calculateTrendDescription(strengthHistory),
    [strengthHistory]
  );

  if (strengthHistory.length === 0) return <NoDataState height={height} />;
  if (strengthHistory.length < MIN_HISTORY_LENGTH)
    return <BuildingHistoryState height={height} />;

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Strength timeline chart showing ${strengthHistory.length} days of history. ${trendDescription}`}
      accessibilityRole='image'
      className='overflow-hidden rounded-xl'
      style={{ backgroundColor: themeColors.background }}
      entering={FadeIn.duration(PATH_ANIMATION_DURATION)}
    >
      <ChartSvg
        animatedLineProps={animatedLineProps}
        areaPath={areaPath}
        chartColor={chartColor}
        dimensions={dimensions}
        lastPoint={lastPoint}
        linePath={linePath}
        pulsingRingProps={pulsingRingProps}
      />
      <XAxisLabels labels={xAxisLabels} />
    </Animated.View>
  );
}

export default StrengthTimelineChart;
