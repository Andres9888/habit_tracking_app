/** SectionEnter — staggered FadeInDown wrapper honoring reduce-motion */
import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import { sectionEnterAnim } from '../SettingsContent.constants';

interface Props {
  index: number;
  reduceMotion: boolean;
  children: ReactNode;
}

export function SectionEnter({ index, reduceMotion, children }: Props) {
  if (reduceMotion) return children;
  return (
    <Animated.View entering={sectionEnterAnim(index)}>{children}</Animated.View>
  );
}
