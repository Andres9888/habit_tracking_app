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
import { absoluteFillObject } from '@/theme/absoluteFillObject';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
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
  const reduceMotion = useReduceMotion();
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

  const entering =
    animationsEnabled && !reduceMotion
      ? FadeIn.duration(durations.reveal).easing(enterEasing)
      : undefined;

  return (
    <Animated.View pointerEvents='none' style={styles.overlay}>
      {bridges.map(({ index, key }) => (
        <Animated.View
          key={key}
          entering={entering}
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
  overlay: { ...absoluteFillObject },
});
