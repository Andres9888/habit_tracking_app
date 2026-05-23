import React, { useEffect, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { DayData } from './types';

const CELL_SIZE = 36;

interface ChainConnectorsProps {
  week: DayData[];
  habitColor: string;
  visible: boolean;
  rowWidth: number;
}

function isLinkable(d: DayData | undefined): boolean {
  return Boolean(d?.isCompleted && d?.isCurrentMonth && !d?.isFuture);
}

export const ChainConnectors = memo(function ChainConnectors({
  week,
  habitColor,
  visible,
  rowWidth,
}: ChainConnectorsProps) {
  const opacity = useSharedValue(visible ? 0.85 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 0.85 : 0, { duration: 220 });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const segments: number[] = [];
  for (let i = 0; i < 6; i++) {
    if (isLinkable(week[i]) && isLinkable(week[i + 1])) {
      segments.push(i);
    }
  }

  const pitch = rowWidth / 7;
  const gapWidth = pitch - CELL_SIZE;
  const canRender = rowWidth > 0 && gapWidth > 0 && segments.length > 0;

  if (!canRender) return null;

  return (
    <View pointerEvents='none' style={styles.overlay}>
      {segments.map((i) => (
        <Animated.View
          key={`conn-${i}`}
          style={[
            styles.connector,
            {
              backgroundColor: habitColor,
              left: (i + 0.5) * pitch + CELL_SIZE / 2,
              width: gapWidth,
            },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  connector: {
    position: 'absolute',
    top: 18,
    height: 4,
    borderRadius: 2,
  },
});
