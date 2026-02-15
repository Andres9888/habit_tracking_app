/**
 * Renders Tab Component
 * Component render performance and slow component detection.
 */

import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';

import type { RenderData, RenderTiming } from '../types';
import { StatRow } from './StatRow';
import { StatusIndicator } from './StatusIndicator';
import { rendersStyles } from './RendersTab.styles';
import { tabStyles, valueStyles } from './tabStyles';

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
  const renderItem = useCallback(
    ({ item }: { item: RenderTiming }) => <ComponentRow component={item} />,
    []
  );

  const keyExtractor = useCallback(
    (_: RenderTiming, index: number) => `${index}`,
    []
  );

  return (
    <View style={rendersStyles.list}>
      <Text style={[tabStyles.historyLabel, slow && rendersStyles.slowLabel]}>
        {label}
      </Text>
      {components.length === 0 ? (
        <Text style={tabStyles.emptyText}>No renders tracked yet</Text>
      ) : (
        <FlatList
          nestedScrollEnabled
          data={components}
          initialNumToRender={8}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={[tabStyles.scrollView, rendersStyles.scrollView]}
          windowSize={3}
        />
      )}
    </View>
  );
}

function ComponentRow({ component }: { component: RenderTiming }) {
  const isSlow = component.averageRenderTime > 16;
  return (
    <View style={rendersStyles.compRow}>
      <Text numberOfLines={1} style={rendersStyles.compName}>
        {component.componentName}
      </Text>
      <View style={rendersStyles.compStats}>
        <Text style={rendersStyles.compRenders}>{component.renderCount}x</Text>
        <Text
          style={[
            rendersStyles.compDuration,
            isSlow && rendersStyles.slowDuration,
          ]}
        >
          {component.averageRenderTime.toFixed(1)}ms
        </Text>
      </View>
    </View>
  );
}
