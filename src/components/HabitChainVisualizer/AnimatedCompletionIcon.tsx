/**
 * AnimatedCompletionIcon - Animated icon for habit completion state
 */

import React from 'react';
import { Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';

interface AnimatedCompletionIconProps {
  completionIcon: 'checkbox' | 'chainLink';
  completion: Animated.Value;
}

export function AnimatedCompletionIcon({
  completionIcon,
  completion,
}: AnimatedCompletionIconProps) {
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
        <Check color='#ffffff' size={20} strokeWidth={2.25} />
      ) : (
        <ChainLinkIcon color='#ffffff' size={20} variant='stroke' />
      )}
    </Animated.View>
  );
}
