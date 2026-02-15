/**
 * Tab Content Component
 * Renders the active tab's content.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import type {
  DashboardTab,
  FPSData,
  MemoryData,
  NetworkData,
  RenderData,
} from '../types';
import { FPSTab } from './FPSTab';
import { MemoryTab } from './MemoryTab';
import { NetworkTab } from './NetworkTab';
import { OverviewTab } from './OverviewTab';
import { RendersTab } from './RendersTab';

interface TabContentProps {
  activeTab: DashboardTab;
  fps: FPSData;
  memory: MemoryData;
  network: NetworkData;
  renders: RenderData;
}

export function TabContent({
  activeTab,
  fps,
  memory,
  network,
  renders,
}: TabContentProps) {
  return (
    <View style={styles.container}>
      {activeTab === 'overview' && (
        <OverviewTab
          fps={fps}
          memory={memory}
          network={network}
          renders={renders}
        />
      )}
      {activeTab === 'fps' && <FPSTab data={fps} />}
      {activeTab === 'memory' && <MemoryTab data={memory} />}
      {activeTab === 'network' && <NetworkTab data={network} />}
      {activeTab === 'renders' && <RendersTab data={renders} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
  },
});
