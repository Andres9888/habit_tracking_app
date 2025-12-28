/**
 * ChainConnectionOverlay Component
 * Renders all streak chain connections as an SVG overlay behind calendar cells
 */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ChainConnectionOverlayProps, ConnectionConfig, ChainConnection } from './types';
import { generateConnections, getDefaultGridData } from './utils';
import { ConnectionPath } from './ConnectionPath';

/**
 * ChainConnectionOverlay renders visual connections between consecutive completed days
 *
 * Features:
 * - Positioned absolutely behind calendar cells (z-index: -1)
 * - Generates connections from streak segments
 * - Staggered animation for smooth appearance
 * - Optimized for performance with memoization
 */
export function ChainConnectionOverlay({
  segments,
  positions,
  habitColor,
  reduceMotion,
  viewMode,
  gridWidth,
  gridHeight,
}: ChainConnectionOverlayProps) {
  // Get grid configuration for view mode
  const gridData = useMemo(() => getDefaultGridData(viewMode), [viewMode]);

  // Generate connections from segments
  const connections = useMemo(
    () => generateConnections(segments, positions),
    [segments, positions]
  );

  // Create connection config
  const config: ConnectionConfig = useMemo(
    () => ({
      habitColor,
      useMutedColors: false,
      reduceMotion,
      cellSize: gridData.cellSize,
      cellGap: gridData.cellGap,
      labelOffset: gridData.labelWidth,
    }),
    [habitColor, reduceMotion, gridData]
  );

  // Sort connections for consistent animation order (oldest to newest)
  const sortedConnections = useMemo(
    () => [...connections].sort((a, b) => a.fromDate.localeCompare(b.fromDate)),
    [connections]
  );

  // Calculate animation delay based on position
  const getAnimationDelay = (connection: ChainConnection, index: number): number => {
    if (reduceMotion) return 0;
    // Stagger from left to right (oldest to newest)
    return index * 30; // 30ms between each connection
  };

  // Don't render if no connections
  if (connections.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.overlay,
        {
          width: gridWidth,
          height: gridHeight,
        },
      ]}
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {sortedConnections.map((connection, index) => (
        <ConnectionPath
          key={connection.id}
          connection={connection}
          config={config}
          animationDelay={getAnimationDelay(connection, index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
});

export default ChainConnectionOverlay;
