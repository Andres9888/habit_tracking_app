/** Crossfade wrapper — tier text swaps fade instead of popping. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

const ENTER = FadeIn.duration(durations.reveal).easing(enterEasing);
const EXIT = FadeOut.duration(durations.quick);

interface Props {
  contentKey: string;
  children: ReactNode;
}

export function TierContentCrossfade({ contentKey, children }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <View style={{ width: '100%' }}>{children}</View>;
  }

  return (
    <Animated.View
      key={contentKey}
      entering={ENTER}
      exiting={EXIT}
      style={{ left: 0, position: 'absolute', right: 0, top: 0, width: '100%' }}
    >
      {children}
    </Animated.View>
  );
}
