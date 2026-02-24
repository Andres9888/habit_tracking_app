/**
 * FPS Tab Component
 * Detailed FPS and frame timing information.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import { StatRow } from './StatRow';
import { HistoryChart } from './HistoryChart';
import { tabStyles, valueStyles } from './tabStyles';
import type { FPSData } from '../types';
import { fontFamilies } from '@/theme/typography';

interface FPSTabProps {
  data: FPSData;
}

export function FPSTab({ data }: FPSTabProps) {
  const jankPercentage =
    data.totalFrames > 0
      ? ((data.jankFrames / data.totalFrames) * 100).toFixed(1)
      : '0.0';

  const chartData = data.history.slice(-30).map((frame) => ({
    maxValue: 60,
    value: frame.fps,
  }));

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.mainMetric}>
        <View style={styles.fpsDisplay}>
          <Text style={valueStyles.valueLarge}>
            {data.currentFPS.toFixed(0)}
          </Text>
          <Text style={styles.fpsUnit}>FPS</Text>
        </View>
        <StatusIndicator size='large' status={data.status} />
      </View>

      <View style={tabStyles.stats}>
        <StatRow label='Average FPS' value={data.averageFPS.toFixed(1)} />
        <StatRow label='Total Frames' value={data.totalFrames.toString()} />
        <StatRow label='Jank Frames' value={data.jankFrames.toString()} />
        <StatRow label='Jank Rate' value={`${jankPercentage}%`} />
      </View>

      <HistoryChart
        data={chartData}
        getBarColor={getFPSBarColor}
        label={`History (${data.history.length} samples)`}
      />
    </View>
  );
}

function getFPSBarColor(fps: number): string {
  if (fps >= 55) return '#22c55e';
  if (fps >= 30) return '#f59e0b';
  return '#ef4444';
}

const styles = StyleSheet.create({
  fpsDisplay: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  fontFamily: fontFamilies.primary.text,
  fpsUnit: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '500' },
});
