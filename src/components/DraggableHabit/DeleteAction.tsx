import React from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

interface DeleteActionProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
}

export function DeleteAction({ dragX, onPress }: DeleteActionProps) {
  const { isDark } = useThemeColors();

  const iconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-160, -100, -60, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const iconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-160, -80, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Pressable
      accessibilityLabel="Delete habit"
      accessibilityRole="button"
      testID="delete-habit-action"
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: colors.error,
        height: '100%',
        justifyContent: 'center',
        width: 80,
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
        <Trash2 color="white" size={iconSizes.large} strokeWidth={2} />
        <Text
          style={{
            color: 'white',
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.tabBar.fontSize,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.2,
            marginTop: 4,
          }}
        >
          Delete
        </Text>
      </Animated.View>
    </Pressable>
  );
}
