/**
 * ColorSwatch Component
 * Per spec: 36×36px visual, 48×48px tap, selected renders at 52×52 via ring padding
 * (rings are rendered at real size, never stretched via transform — avoids GPU blur)
 */

import { useCallback } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { AnimatedPressable } from '../../../ui';

interface ColorSwatchProps {
  color: string;
  colorName: string;
  isSelected: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

const SWATCH_SIZE = 36;
const TAP_TARGET = 48;

const getSwatchStyle = (color: string, isSelected: boolean) => ({
  backgroundColor: color,
  borderRadius: borderRadius.full,
  height: SWATCH_SIZE,
  width: SWATCH_SIZE,
  ...shadows.subtle,
  ...(isSelected && {
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 4,
  }),
});

export const ColorSwatch = ({
  color,
  colorName,
  isSelected,
  onPress,
  onPressIn,
  onPressOut,
}: ColorSwatchProps) => {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: durations.instant });
    onPressIn();
  }, [scale, onPressIn]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springs.pop);
    onPressOut();
  }, [scale, onPressOut]);

  return (
    <View
      style={{
        alignItems: 'center',
        height: TAP_TARGET,
        justifyContent: 'center',
        width: TAP_TARGET,
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          scaleStyle,
        ]}
      >
        <View
          style={{
            backgroundColor: isSelected ? color : 'transparent',
            borderRadius: borderRadius.full,
            padding: isSelected ? 3 : 0,
          }}
        >
          <View
            style={{
              backgroundColor: isSelected ? '#fff' : 'transparent',
              borderRadius: borderRadius.full,
              padding: isSelected ? 5 : 0,
            }}
          >
            <AnimatedPressable
              accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              style={getSwatchStyle(color, isSelected)}
              testID={`color-swatch-${color.replace('#', '')}`}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
