/**
 * StickyCreateBar Component
 * Sticky bottom CTA bar for the Create Habit modal
 */

import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useKeyboardState } from '../../hooks/useKeyboardState';
import type { StickyCreateBarProps } from './types';
import { DEFAULT_BUTTON_COLOR, getGradientColors } from './colorUtils';
import { useStickyBarAnimations } from './useStickyBarAnimations';
import { CreateButton } from './CreateButton';
import { MotivationText } from './MotivationText';

function StickyCreateBarComponent({
  disabled,
  onPress,
  selectedColor,
}: StickyCreateBarProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useThemeColors();
  const { isKeyboardVisible, keyboardHeight } = useKeyboardState();
  const { scale, colorOpacity, triggerSuccess, handlePressIn, handlePressOut } =
    useStickyBarAnimations(disabled, selectedColor);

  const bottom = useMemo(() => {
    if (isKeyboardVisible) return keyboardHeight + 12;
    return Math.max(insets.bottom, 12) + 12;
  }, [insets.bottom, isKeyboardVisible, keyboardHeight]);

  const buttonColor = selectedColor ?? DEFAULT_BUTTON_COLOR;
  const gradientColors = useMemo(
    () => getGradientColors(disabled, buttonColor),
    [disabled, buttonColor]
  );

  const handlePress = useCallback(() => {
    if (!disabled) {
      triggerSuccess();
      onPress();
    }
  }, [disabled, onPress, triggerSuccess]);

  return (
    <View
      pointerEvents='box-none'
      style={{
        bottom: 0,
        left: 0,
        paddingBottom: bottom - 12,
        position: 'absolute',
        right: 0,
      }}
    >
      <LinearGradient
        colors={
          isDark
            ? ['transparent', `${themeColors.surface}E6`, themeColors.surface]
            : ['transparent', 'rgba(250, 248, 245, 0.9)', '#FAF8F5']
        }
        locations={[0, 0.4, 1]}
        pointerEvents='none'
        style={{ height: 32 }}
      />
      <View
        className='px-4 pb-2'
        style={{ backgroundColor: isDark ? themeColors.surface : '#FAF8F5' }}
      >
        <MotivationText />
        <CreateButton
          colorOpacity={colorOpacity}
          disabled={disabled}
          gradientColors={gradientColors}
          scale={scale}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
        <View className='mt-3 items-center'>
          <View className='h-1 w-32 rounded-full' style={{ backgroundColor: themeColors.border }} />
        </View>
      </View>
    </View>
  );
}

export const StickyCreateBar = memo(StickyCreateBarComponent);
export default StickyCreateBar;
