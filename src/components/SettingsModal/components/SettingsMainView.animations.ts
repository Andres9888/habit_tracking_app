import { FadeIn, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

export type SettingsView =
  | 'settings'
  | 'archived'
  | 'account'
  | 'calendar'
  | 'analytics';
export type ViewDirection = 'forward' | 'back' | 'none';

export function getSettingsViewEntering(
  targetView: SettingsView,
  direction: ViewDirection,
  reduceMotion: boolean
) {
  if (reduceMotion) {
    return direction === 'none'
      ? undefined
      : FadeIn.duration(durations.enter).easing(enterEasing);
  }

  if (targetView === 'settings') {
    return direction === 'back'
      ? SlideInLeft.duration(durations.enter).easing(enterEasing)
      : undefined;
  }

  return direction === 'forward'
    ? SlideInRight.duration(durations.enter).easing(enterEasing)
    : FadeIn.duration(durations.enter).easing(enterEasing);
}
