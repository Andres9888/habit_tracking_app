/** AccountSection — staggered FadeInDown wrapper for account-page sections */
import type { ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

const anim = (index: number) =>
  FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .easing(enterEasing);

interface Props {
  index: number;
  reduceMotion: boolean;
  children: ReactNode;
}

export function AccountSection({ index, reduceMotion, children }: Props) {
  if (reduceMotion) return children;
  return <Animated.View entering={anim(index)}>{children}</Animated.View>;
}
