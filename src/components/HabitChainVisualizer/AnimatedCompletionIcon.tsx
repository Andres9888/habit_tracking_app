/**
 * AnimatedCompletionIcon - Animated icon for habit completion state
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';

interface AnimatedCompletionIconProps {
  completionIcon: 'checkbox' | 'chain';
  completion: Animated.Value;
  completed: boolean;
  iconColor?: string;
}

export function AnimatedCompletionIcon({
  completionIcon,
  completion,
  completed,
  iconColor,
}: AnimatedCompletionIconProps) {
  const resolvedColor = iconColor ?? colors.text.inverse;
  // Static fallback backstops native-driver opacity dropouts. On initial
  // mount with `completed=true` it renders immediately (no entrance animation
  // to protect). On a runtime false→true transition it waits 300ms so the
  // scale/fade-in plays unobstructed.
  const isInitialMountRef = useRef(true);
  const [showFallback, setShowFallback] = useState(completed);
  useEffect(() => {
    if (!completed) {
      isInitialMountRef.current = false;
      setShowFallback(false);
      return;
    }
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      setShowFallback(true);
      return;
    }
    const t = setTimeout(() => setShowFallback(true), 300);
    return () => clearTimeout(t);
  }, [completed]);
  const icon =
    completionIcon === 'checkbox' ? (
      <Check color={resolvedColor} size={iconSizes.medium} strokeWidth={2.5} />
    ) : (
      <ChainLinkIcon color={resolvedColor} size={iconSizes.medium} variant='stroke' />
    );
  return (
    <>
      {completed && showFallback ? (
        <View
          pointerEvents='none'
          style={StyleSheet.absoluteFillObject}
          className='items-center justify-center'
        >
          {icon}
        </View>
      ) : null}
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
        {icon}
      </Animated.View>
    </>
  );
}
