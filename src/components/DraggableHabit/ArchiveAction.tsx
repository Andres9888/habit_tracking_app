import React from 'react';
import { Animated, View, Text } from 'react-native';
import { Archive } from 'lucide-react-native';
import { borderRadius } from '../../theme/spacing';

interface ArchiveActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
}

export function ArchiveAction({ dragX }: ArchiveActionProps) {
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, 0],
    outputRange: [0, 100],
  });

  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, -60, -30, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-100, -40, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Animated.View
      className='flex-row items-center justify-end'
      style={{ transform: [{ translateX: trans }] }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#f59e0b',
          borderBottomRightRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          height: '100%',
          justifyContent: 'center',
          width: 100,
        }}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: iconOpacity,
            transform: [{ scale: iconScale }],
          }}
        >
          <Archive color='white' size={22} strokeWidth={2} />
          <Text
            style={{
              color: 'white',
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 0.2,
              marginTop: 4,
            }}
          >
            Archive
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
