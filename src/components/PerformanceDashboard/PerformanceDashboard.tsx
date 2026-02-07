/**
 * Performance Dashboard Component
 * Dev-only floating dashboard for real-time performance monitoring.
 */

import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DashboardFAB,
  DashboardHeader,
  MiniMetric,
  TabBar,
  TabContent,
} from './components';
import { useDashboardData } from './useDashboardData';
import { getOverallStatus, getPositionStyle } from './utils';
import { dashboardStyles } from './PerformanceDashboard.styles';
import type { DashboardConfig } from './types';

interface PerformanceDashboardProps {
  config?: DashboardConfig;
}

export function PerformanceDashboard({ config }: PerformanceDashboardProps) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) return null;
  return <DashboardContent config={config} />;
}

function DashboardContent({ config }: PerformanceDashboardProps) {
  const state = useDashboardData(config);
  const { width } = useWindowDimensions();
  const dashboardWidth = Math.min(width - 32, 320);
  const overallStatus = getOverallStatus(state);
  const positionStyle = getPositionStyle(config?.position);

  if (!state.isVisible) {
    return (
      <DashboardFAB
        currentFPS={state.fps.currentFPS}
        positionStyle={positionStyle}
        status={overallStatus}
        onPress={state.toggleVisibility}
      />
    );
  }

  return (
    <SafeAreaView
      pointerEvents='box-none'
      style={[
        dashboardStyles.container,
        positionStyle,
        { width: dashboardWidth },
      ]}
    >
      <View style={dashboardStyles.dashboard}>
        <DashboardHeader
          isExpanded={state.isExpanded}
          status={overallStatus}
          onClose={state.toggleVisibility}
          onToggleExpand={state.toggleExpanded}
        />
        {state.isExpanded ? (
          <ExpandedContent state={state} />
        ) : (
          <CollapsedContent state={state} />
        )}
      </View>
    </SafeAreaView>
  );
}

function ExpandedContent({
  state,
}: {
  state: ReturnType<typeof useDashboardData>;
}) {
  return (
    <View style={dashboardStyles.content}>
      <TabBar activeTab={state.activeTab} onTabChange={state.setTab} />
      <TabContent
        activeTab={state.activeTab}
        fps={state.fps}
        memory={state.memory}
        network={state.network}
        renders={state.renders}
      />
    </View>
  );
}

function CollapsedContent({
  state,
}: {
  state: ReturnType<typeof useDashboardData>;
}) {
  return (
    <View style={dashboardStyles.miniMetrics}>
      <MiniMetric label='FPS' value={state.fps.currentFPS.toFixed(0)} />
      <MiniMetric label='MEM' value={state.memory.formattedUsage} />
      <MiniMetric
        label='P95'
        value={`${state.network.p95Latency.toFixed(0)}ms`}
      />
    </View>
  );
}

export default PerformanceDashboard;
