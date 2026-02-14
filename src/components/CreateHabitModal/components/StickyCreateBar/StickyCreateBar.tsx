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
  const { colors, isDark } = useThemeColors();
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

  const bgColor = colors.background;
  const bgTransparent = isDark ? 'rgba(17, 24, 39, 0)' : 'rgba(250, 248, 245, 0)';
  const bgSemi = isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(250, 248, 245, 0.9)';

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
        colors={[bgTransparent, bgSemi, bgColor]}
        locations={[0, 0.4, 1]}
        pointerEvents='none'
        style={{ height: 32 }}
      />
      <View className='px-4 pb-2' style={{ backgroundColor: bgColor }}>
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
          <View
            className='h-1 w-32 rounded-full'
            style={{ backgroundColor: colors.gray[300], opacity: 0.6 }}
          />
        </View>
      </View>
    </View>
  );
}

export const StickyCreateBar = memo(StickyCreateBarComponent);
export default StickyCreateBar;
