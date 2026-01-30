/**
 * Overview Tab Component
 * Shows summary of all performance metrics.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MetricCard } from './MetricCard';
import type { FPSData, MemoryData, NetworkData, RenderData } from '../types';

interface OverviewTabProps {
  fps: FPSData;
  memory: MemoryData;
  network: NetworkData;
  renders: RenderData;
}

export function OverviewTab({
  fps,
  memory,
  network,
  renders,
}: OverviewTabProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MetricCard
          label='FPS'
          status={fps.status}
          subtitle={`Avg: ${fps.averageFPS.toFixed(0)}`}
          value={fps.currentFPS.toFixed(0)}
        />
        <MetricCard
          label='Memory'
          status={memory.status}
          subtitle={
            memory.peakUsage ? `Peak: ${formatMB(memory.peakUsage)}` : undefined
          }
          value={memory.formattedUsage}
        />
      </View>
      <View style={styles.row}>
        <MetricCard
          label='P95 Latency'
          status={network.status}
          subtitle={`${network.totalRequests} requests`}
          value={`${network.p95Latency.toFixed(0)}ms`}
        />
        <MetricCard
          label='Slow Renders'
          status={renders.status}
          subtitle={`${renders.totalRenders} total`}
          value={renders.slowComponents.length.toString()}
        />
      </View>
    </View>
  );
}

function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
