import { FadeOut } from 'react-native-reanimated';

import { durations } from '@/theme/animations';

/**
 * Uncheck fade. Layout animations run through the LayoutAnimationsProxy rather
 * than the animated-props registry, so an unchecked cell can fade out without
 * any resting color living in Reanimated state.
 *
 * Timings mirror the previous `runCompletionTransition` fade.
 */
export const buildDayToggleFadeOut = (reduceMotion: boolean) =>
  FadeOut.duration(reduceMotion ? durations.stagger : durations.reveal);
