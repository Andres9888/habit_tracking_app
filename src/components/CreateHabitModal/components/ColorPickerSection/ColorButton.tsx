import { memo, useCallback } from 'react';
import { AccessibilityInfo, Keyboard, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { getColorName } from '../../constants';
import type { ColorButtonProps } from './types';
import { useColorButtonAnimations } from './useColorButtonAnimations';
import { ColorSwatch } from './ColorSwatch';

/**
 * Individual color swatch button with selection animation
 * V12: 44px base with 52px container for better touch targets
 */
const ColorButtonComponent = ({
  color,
  isSelected,
  onSelect,
  reduceMotion,
}: ColorButtonProps) => {
  const { triggerSelection } = useHapticFeedback();
  const colorName = getColorName(color);
  const {
    animatePressIn,
    animatePressOut,
    rippleOpacity,
    rippleScale,
    scale,
    triggerRipple,
  } = useColorButtonAnimations({ reduceMotion });

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    triggerRipple();
    onSelect(color);
    AccessibilityInfo.announceForAccessibility(`Selected ${colorName} color`);
  }, [color, colorName, onSelect, triggerSelection, triggerRipple]);

  const selectedShadowStyle = isSelected
    ? {
        ...shadows.floatingActionButton,
        shadowOpacity: 0.3,
      }
    : undefined;

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ position: 'relative' }}>
      {/* Ripple effect layer */}
      <Animated.View
        pointerEvents='none'
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          rippleStyle,
        ]}
      >
        <View
          style={{
            backgroundColor: color,
            borderRadius: borderRadius.full,
            height: 44,
            width: 44,
          }}
        />
      </Animated.View>

      {/* Main color button with outer ring for selection */}
      <View
        style={{
          alignItems: 'center',
          height: 52,
          justifyContent: 'center',
          width: 52,
        }}
      >
        <Animated.View style={[scaleStyle, selectedShadowStyle]}>
          <ColorSwatch
            color={color}
            colorName={colorName}
            isSelected={isSelected}
            onPress={handlePress}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export const ColorButton = memo(ColorButtonComponent);
