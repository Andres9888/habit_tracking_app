/**
 * Memory Tab Component
 * Detailed memory usage and growth information.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import { StatRow } from './StatRow';
import { HistoryChart } from './HistoryChart';
import { tabStyles, valueStyles } from './tabStyles';
import type { MemoryData } from '../types';
import { fontFamilies } from '@/theme/typography';

interface MemoryTabProps {
  data: MemoryData;
}

const MAX_MEMORY = 200 * 1024 * 1024; // 200MB budget

export function MemoryTab({ data }: MemoryTabProps) {
  if (!data.isSupported) {
    return (
      <View style={styles.unsupported}>
        <Text style={styles.unsupportedText}>
          Memory monitoring not supported on this platform
        </Text>
      </View>
    );
  }

  const growthLabel = formatGrowthLabel(data.growthRate);
  const chartData = data.history.slice(-30).map((snapshot) => ({
    maxValue: MAX_MEMORY,
    value: snapshot.jsHeapUsed ?? 0,
  }));

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.mainMetric}>
        <View>
          <Text style={valueStyles.value}>{data.formattedUsage}</Text>
          <Text style={valueStyles.label}>Current Usage</Text>
        </View>
        <StatusIndicator size='large' status={data.status} />
      </View>

      <View style={tabStyles.stats}>
        <StatRow
          label='Peak Usage'
          value={data.peakUsage ? formatBytes(data.peakUsage) : 'N/A'}
        />
        <StatRow label='Growth Since Mount' value={growthLabel} />
        <StatRow label='Samples' value={data.history.length.toString()} />
      </View>

      <HistoryChart
        data={chartData}
        getBarColor={getMemoryBarColor}
        label='Memory Timeline'
      />
    </View>
  );
}

function formatGrowthLabel(growthRate: number | null): string {
  if (growthRate === null) return 'N/A';
  return growthRate > 0
    ? `+${formatBytes(growthRate)}`
    : formatBytes(growthRate);
}

function formatBytes(bytes: number): string {
  const absBytes = Math.abs(bytes);
  if (absBytes < 1024) return `${bytes} B`;
  if (absBytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMemoryBarColor(usage: number): string {
  const ratio = MAX_MEMORY > 0 ? usage / MAX_MEMORY : 0;
  if (ratio < 0.5) return '#22c55e';
  if (ratio < 0.75) return '#f59e0b';
  return '#ef4444';
}

const styles = StyleSheet.create({
  unsupported: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  unsupportedText: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    textAlign: 'center',
  },
});
