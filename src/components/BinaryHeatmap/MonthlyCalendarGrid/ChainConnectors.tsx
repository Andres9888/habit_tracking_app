/**
 * ChainConnectors
 *
 * Always-on, calm "soft ribbon": fills the gap between consecutive completed
 * days in a week row with the same solid tint as the day cells, so a run reads
 * as one continuous rounded pill. Misses break the ribbon — that gap is the
 * "don't break the chain" cue. Rendered behind the cells (no own color beyond
 * the shared tint), so it adds the chain back without reintroducing clutter.
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { DayData } from './types';

const CELL_SIZE = 36;

interface ChainConnectorsProps {
  week: DayData[];
  /** Pre-blended solid tint, identical to the completed cell background. */
  completedBg: string;
  rowWidth: number;
}

function isLinkable(d: DayData | undefined): boolean {
  return Boolean(d?.isCompleted && d?.isCurrentMonth && !d?.isFuture);
}

export const ChainConnectors = memo(function ChainConnectors({
  week,
  completedBg,
  rowWidth,
}: ChainConnectorsProps) {
  if (rowWidth <= 0) return null;

  const pitch = rowWidth / 7;
  const bridges: number[] = [];
  for (let i = 0; i < 6; i++) {
    if (isLinkable(week[i]) && isLinkable(week[i + 1])) bridges.push(i);
  }
  if (bridges.length === 0) return null;

  return (
    <View pointerEvents='none' style={styles.overlay}>
      {bridges.map((i) => (
        <View
          key={`bridge-${i}`}
          style={{
            backgroundColor: completedBg,
            height: CELL_SIZE,
            left: (i + 0.5) * pitch,
            position: 'absolute',
            top: 2,
            width: pitch,
          }}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
});
