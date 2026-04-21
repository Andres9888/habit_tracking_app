/**
 * AnimatedCompletionIcon - Animated icon for habit completion state
 */

import React from 'react';
import { Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';

interface AnimatedCompletionIconProps {
  completionIcon: 'checkbox' | 'chain';
  completion: Animated.Value;
  iconColor?: string;
}

export function AnimatedCompletionIcon({
  completionIcon,
  completion,
  iconColor,
}: AnimatedCompletionIconProps) {
  const resolvedColor = iconColor ?? colors.text.inverse;
  return (
    <Animated.View
      style={{
        opacity: completion,
        transform: [
          {
            scale: completion.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      {completionIcon === 'checkbox' ? (
        <Check color={resolvedColor} size={iconSizes.medium} strokeWidth={2.5} />
      ) : (
        <ChainLinkIcon color={resolvedColor} size={20} variant='stroke' />
      )}
    </Animated.View>
  );
}
