/**
 * QuickTimeButton Component
 *
 * A pressable button for selecting a quick time preset.
 * Features press animation and haptic feedback.
 */

import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

import { springs } from '@/theme/animations';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { QuickTimeButtonProps } from './types';

export const QuickTimeButton = ({
  isSelected,
  label,
  onPress,
  time,
}: QuickTimeButtonProps) => {
  const { triggerSelection } = useHapticFeedback();
  const { colors: themeColors } = useThemeColors();
  const { animatedStyle, pressHandlers } = usePressAnimation({
    enableHaptics: false,
    pressScale: 0.95,
    springConfig: springs.standard,
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Pressable
        accessibilityLabel={`Set reminder to ${label} at ${time}`}
        accessibilityRole='button'
        className='items-center rounded-xl py-3'
        style={{ backgroundColor: isSelected ? themeColors.status.info : themeColors.background }}
        onPress={() => {
          triggerSelection();
          onPress();
        }}
        {...pressHandlers}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected ? 'text-white' : ''
          }`}
          style={!isSelected ? { color: themeColors.text.secondary } : undefined}
        >
          {label}
        </Text>
        <Text
          className='mt-0.5 text-[10px]'
          style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : themeColors.text.tertiary }}
        >
          {time}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
