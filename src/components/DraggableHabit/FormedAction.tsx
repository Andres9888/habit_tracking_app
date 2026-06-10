/**
 * FormedAction — left-side swipe action revealed by swiping a habit card
 * to the RIGHT. Celebratory mirror of the delete/archive actions: marks
 * the habit as formed (mastered and retired with honors).
 */
import React from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface FormedActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onMarkFormed: () => void;
}

export function FormedAction({ dragX, onMarkFormed }: FormedActionProps) {
  const { triggerSuccess } = useHapticFeedback();
  const handlePress = () => {
    triggerSuccess();
    onMarkFormed();
  };

  // Mirror of SwipeActions interpolations, flipped to positive drag values
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 96],
    outputRange: [-96, 0],
  });

  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 60, 96],
    outputRange: [0.8, 1, 1.1],
  });

  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 48, 96],
    outputRange: [0.6, 0.85, 1],
  });

  return (
    <Animated.View
      className='flex-row items-center justify-start'
      style={{ transform: [{ translateX: trans }] }}
    >
      <Pressable
        accessibilityLabel='Mark habit as formed'
        accessibilityRole='button'
        onPress={handlePress}
        style={{
          alignItems: 'center',
          backgroundColor: colors.streak[300],
          borderBottomLeftRadius: borderRadius.xl,
          borderTopLeftRadius: borderRadius.xl,
          height: '100%',
          justifyContent: 'center',
          width: 96,
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
          <Trophy
            color={colors.streak[700]}
            size={iconSizes.large}
            strokeWidth={2}
          />
          <Text
            style={{
              color: colors.streak[700],
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: fontWeights.semibold,
              letterSpacing: 0.2,
              marginTop: 4,
            }}
          >
            Formed
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
