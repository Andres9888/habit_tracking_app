/**
 * useJumpNav - scroll-spy + tap-to-scroll for the science drill-down's
 * jump-nav chip row. Sections register their measured Y offset (relative to
 * `contentRef`) on layout; a reanimated reaction picks the active chip as
 * the user scrolls, and `scrollToKey` drives the tap interaction.
 */

import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const SPY_OFFSET = 24;

export function useJumpNav(
  scrollY: SharedValue<number>,
  contentRef: RefObject<View | null>,
  scrollRef: RefObject<Animated.ScrollView | null>,
  keys: readonly string[]
) {
  const offsets = useSharedValue<Record<string, number>>({});
  const [activeKey, setActiveKey] = useState<string>(keys[0]);
  const sectionRefs = useRef<Record<string, View | null>>({});

  const registerSection = useCallback(
    (key: string) => ({
      ref: (node: View | null) => {
        sectionRefs.current[key] = node;
      },
      onLayout: () => {
        const node = sectionRefs.current[key];
        if (!node || !contentRef.current) return;
        node.measureLayout(
          contentRef.current,
          (_x, y) => {
            offsets.value = { ...offsets.value, [key]: y };
          },
          () => {}
        );
      },
    }),
    [contentRef, offsets]
  );

  useAnimatedReaction(
    () => {
      'worklet';
      const y = scrollY.value + SPY_OFFSET;
      let current = keys[0];
      for (const key of keys) {
        const offset = offsets.value[key];
        if (offset !== undefined && offset <= y) current = key;
      }
      return current;
    },
    (current, previous) => {
      if (current !== previous) runOnJS(setActiveKey)(current);
    }
  );

  const scrollToKey = useCallback(
    (key: string) => {
      const y = offsets.value[key];
      if (y === undefined) return;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    },
    [offsets, scrollRef]
  );

  return { activeKey, registerSection, scrollToKey };
}
