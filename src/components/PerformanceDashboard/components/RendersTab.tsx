/**
 * Renders Tab Component
 * Component render performance and slow component detection.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import { StatRow } from './StatRow';
import { tabStyles, valueStyles } from './tabStyles';
import type { RenderData, RenderTiming } from '../types';

interface RendersTabProps {
  data: RenderData;
}

export function RendersTab({ data }: RendersTabProps) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.mainMetric}>
        <View>
          <Text style={valueStyles.value}>{data.slowComponents.length}</Text>
          <Text style={valueStyles.label}>Slow Components</Text>
        </View>
        <StatusIndicator size='large' status={data.status} />
      </View>

      <View style={tabStyles.stats}>
        <StatRow label='Total Renders' value={data.totalRenders.toString()} />
        <StatRow
          label='Components Tracked'
          value={data.recentRenders.length.toString()}
        />
      </View>

      {data.slowComponents.length > 0 && (
        <ComponentsList
          slow
          components={data.slowComponents}
          label='Slow Components (>16ms)'
        />
      )}

      <ComponentsList
        components={data.recentRenders.slice(-8).reverse()}
        label='Recent Renders'
      />
    </View>
  );
}

function ComponentsList({
  components,
  label,
  slow,
}: {
  components: RenderTiming[];
  label: string;
  slow?: boolean;
}) {
  return (
    <View style={styles.list}>
      <Text style={[tabStyles.historyLabel, slow && styles.slowLabel]}>
        {label}
      </Text>
      <ScrollView
        nestedScrollEnabled
        style={[tabStyles.scrollView, styles.scrollView]}
      >
        {components.length === 0 ? (
          <Text style={tabStyles.emptyText}>No renders tracked yet</Text>
        ) : (
          components.map((comp, i) => <ComponentRow key={i} component={comp} />)
        )}
      </ScrollView>
    </View>
  );
}

function ComponentRow({ component }: { component: RenderTiming }) {
  const isSlow = component.averageRenderTime > 16;
  return (
    <View style={styles.compRow}>
      <Text numberOfLines={1} style={styles.compName}>
        {component.componentName}
      </Text>
      <View style={styles.compStats}>
        <Text style={styles.compRenders}>{component.renderCount}x</Text>
        <Text style={[styles.compDuration, isSlow && styles.slowDuration]}>
          {component.averageRenderTime.toFixed(1)}ms
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compDuration: {
    color: '#22c55e',
    fontFamily: 'monospace',
    fontSize: 10,
    width: 45,
  },
  compName: { color: 'rgba(255,255,255,0.8)', flex: 1, fontSize: 10 },
  compRenders: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'monospace',
    fontSize: 10,
    width: 30,
  },
  compRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 3,
  },
  compStats: { flexDirection: 'row', gap: 8 },
  list: { gap: 4 },
  scrollView: { maxHeight: 70 },
  slowDuration: { color: '#f59e0b' },
  slowLabel: { color: '#f59e0b', fontWeight: '600' },
});
