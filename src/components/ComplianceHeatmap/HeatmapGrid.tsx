/**
 * Heatmap grid with scrollable weeks
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import type { HeatmapData, MonthLabel } from './ComplianceHeatmap.types';
import { styles } from './ComplianceHeatmap.styles';
import { MonthLabels } from './MonthLabels';
import { WeekColumn } from './WeekColumn';

interface HeatmapGridProps {
  weeks: HeatmapData[][];
  monthLabels: MonthLabel[];
  onDayPress?: (day: HeatmapData) => void;
}

export function HeatmapGrid({
  weeks,
  monthLabels,
  onDayPress,
}: HeatmapGridProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
    >
      <View>
        <MonthLabels labels={monthLabels} />
        <View style={styles.weeksContainer}>
          {weeks.map((week, weekIndex) => (
            <WeekColumn key={weekIndex} week={week} onDayPress={onDayPress} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
