/**
 * ChainConnectionOverlay Component
 * Renders all streak chain connections as an SVG overlay behind calendar cells
 */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ChainConnectionOverlayProps,
  ConnectionConfig,
  ChainConnection,
  BreakIndicatorConfig,
  StreakBreak,
} from './types';
import {
  generateConnections,
  getDefaultGridData,
  detectStreakBreaks,
  DEFAULT_BREAK_INDICATOR_CONFIG,
} from './utils';
import { ConnectionPath } from './ConnectionPath';
import { BreakIndicator } from './BreakIndicator';

/**
 * ChainConnectionOverlay renders visual connections between consecutive completed days
 *
 * Features:
 * - Positioned absolutely behind calendar cells (z-index: -1)
 * - Generates connections from streak segments
 * - Staggered animation for smooth appearance
 * - Break indicators showing where streaks were interrupted
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
  showBreakIndicators = true,
  breakIndicatorConfig,
}: ChainConnectionOverlayProps) {
  // Get grid configuration for view mode
  const gridData = useMemo(() => getDefaultGridData(viewMode), [viewMode]);

  // Generate connections from segments
  const connections = useMemo(
    () => generateConnections(segments, positions),
    [segments, positions]
  );

  // Detect breaks between segments
  const breaks = useMemo(
    () => (showBreakIndicators ? detectStreakBreaks(segments, positions) : []),
    [segments, positions, showBreakIndicators]
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

  // Create break indicator config (merge defaults with overrides)
  const breakConfig: BreakIndicatorConfig = useMemo(
    () => ({
      ...DEFAULT_BREAK_INDICATOR_CONFIG,
      ...breakIndicatorConfig,
    }),
    [breakIndicatorConfig]
  );

  // Sort connections for consistent animation order (oldest to newest)
  const sortedConnections = useMemo(
    () => [...connections].sort((a, b) => a.fromDate.localeCompare(b.fromDate)),
    [connections]
  );

  // Sort breaks for consistent animation order
  const sortedBreaks = useMemo(
    () => [...breaks].sort((a, b) => a.beforeDate.localeCompare(b.beforeDate)),
    [breaks]
  );

  // Calculate animation delay based on position
  const getConnectionAnimationDelay = (
    connection: ChainConnection,
    index: number
  ): number => {
    if (reduceMotion) return 0;
    // Stagger from left to right (oldest to newest)
    return index * 30; // 30ms between each connection
  };

  // Calculate animation delay for break indicators
  // Breaks appear after connections finish (staggered after the last connection)
  const getBreakAnimationDelay = (break_: StreakBreak, index: number): number => {
    if (reduceMotion) return 0;
    const connectionsDuration = sortedConnections.length * 30;
    return connectionsDuration + 100 + index * 50; // 50ms between each break
  };

  // Don't render if no connections AND no breaks
  if (connections.length === 0 && breaks.length === 0) {
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
      {/* Render streak connections */}
      {sortedConnections.map((connection, index) => (
        <ConnectionPath
          key={connection.id}
          connection={connection}
          config={config}
          animationDelay={getConnectionAnimationDelay(connection, index)}
        />
      ))}

      {/* Render break indicators */}
      {breakConfig.enabled &&
        sortedBreaks.map((break_, index) => (
          <BreakIndicator
            key={break_.id}
            break_={break_}
            config={breakConfig}
            reduceMotion={reduceMotion}
            cellSize={gridData.cellSize}
            animationDelay={getBreakAnimationDelay(break_, index)}
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
