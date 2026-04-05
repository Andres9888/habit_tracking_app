/**
 * WOOPSectionHeader - Header row for WOOPSection
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { HelpCircle, Plus, Pencil } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WOOPSectionHeaderProps {
  hasWoop: boolean;
  onHelpPress: () => void;
}

export function WOOPSectionHeader({
  hasWoop,
  onHelpPress,
}: WOOPSectionHeaderProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, springs.button);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springs.button);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className='mb-2 flex-row items-center justify-between'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base'>🎯</Text>
        <Text className='text-xs font-semibold' style={{ color: colors.text.primary }}>WOOP Plan</Text>
      </View>
      <View className='flex-row items-center gap-2'>
        <AnimatedPressable
          accessibilityLabel='Learn about WOOP'
          accessibilityRole='button'
          className='h-6 w-6 items-center justify-center rounded-full'
          hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
          style={animatedStyle}
          onPress={onHelpPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <HelpCircle color={colors.text.tertiary} size={iconSizes.small} />
        </AnimatedPressable>
        {hasWoop ? (
          <Pencil color={colors.text.tertiary} size={iconSizes.small} />
        ) : (
          <View className='flex-row items-center gap-1'>
            <Plus color={colors.text.secondary} size={iconSizes.small} />
            <Text className='text-xs font-medium' style={{ color: colors.text.secondary }}>Set up</Text>
          </View>
        )}
      </View>
    </View>
  );
}
