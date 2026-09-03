import React from 'react';
import { StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme/colors';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { buildDayToggleFadeOut } from './dayToggleFadeOut';

interface Props {
  completionIcon: 'checkbox' | 'chain';
  iconColor?: string;
  reduceMotion: boolean;
}

/**
 * Rendered only while the day is completed. Opacity is a plain style so the
 * icon can never be erased by a stale animated-props commit; the fade on
 * uncheck comes from the exiting layout animation instead.
 */
export function AnimatedCompletionIcon({
  completionIcon,
  iconColor,
  reduceMotion,
}: Props) {
  const resolvedColor = iconColor ?? colors.text.inverse;
  const icon =
    completionIcon === 'checkbox' ? (
      <Check color={resolvedColor} size={iconSizes.medium} strokeWidth={2.5} />
    ) : (
      <ChainLinkIcon
        color={resolvedColor}
        size={iconSizes.medium}
        variant='stroke'
      />
    );
  return (
    <Animated.View
      exiting={buildDayToggleFadeOut(reduceMotion)}
      pointerEvents='none'
      style={[StyleSheet.absoluteFill, styles.center, styles.opaque]}
    >
      {icon}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  opaque: { opacity: 1 },
});
