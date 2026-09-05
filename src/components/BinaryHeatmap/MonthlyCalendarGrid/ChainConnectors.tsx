/**
 * ChainConnectors
 *
 * Always-on, calm "soft ribbon": fills the gap between consecutive completed
 * days in a week row with the same solid tint as the day cells, so a run reads
 * as one continuous rounded pill. Misses break the ribbon — that gap is the
 * "don't break the chain" cue. Rendered behind the cells (no own color beyond
 * the shared tint), so it adds the chain back without reintroducing clutter.
 */

import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';
import { isLinkable } from './chainLinkHelpers';
import type { DayData } from './types';

const CELL_SIZE = 36;

interface ChainConnectorsProps {
  week: DayData[];
  /** Pre-blended solid tint, identical to the completed cell background. */
  completedBg: string;
  rowWidth: number;
}

export const ChainConnectors = memo(function ChainConnectors({
  week,
  completedBg,
  rowWidth,
}: ChainConnectorsProps) {
  const reduceMotion = useReducedMotion();
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimationsEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (rowWidth <= 0) return null;

  const pitch = rowWidth / 7;
  const bridges: Array<{ index: number; key: string }> = [];
  for (let i = 0; i < 6; i++) {
    if (isLinkable(week[i]) && isLinkable(week[i + 1])) {
      bridges.push({
        index: i,
        key: `${week[i]?.dateString ?? i}-${week[i + 1]?.dateString ?? i + 1}`,
      });
    }
  }
  if (bridges.length === 0) return null;

  // Bridges fade on the same clock as the day-cell fill (durations.quick) so
  // toggling a day moves cell + ribbon as one motion, both in and out.
  const entering =
    animationsEnabled && !reduceMotion
      ? FadeIn.duration(durations.quick).easing(enterEasing)
      : undefined;
  const exiting =
    animationsEnabled && !reduceMotion
      ? FadeOut.duration(durations.quick).easing(exitEasing)
      : undefined;

  return (
    <Animated.View pointerEvents='none' style={styles.overlay}>
      {bridges.map(({ index, key }) => (
        <Animated.View
          key={key}
          entering={entering}
          exiting={exiting}
          style={{
            backgroundColor: completedBg,
            height: CELL_SIZE,
            left: (index + 0.5) * pitch,
            position: 'absolute',
            top: 2,
            width: pitch,
          }}
        />
      ))}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill },
});
