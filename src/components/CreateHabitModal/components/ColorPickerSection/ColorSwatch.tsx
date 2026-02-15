/**
 * ColorSwatch Component
 * Per spec: 36×36px visual, 48×48px tap, scale 1.15 selected with white+color rings
 */

import { Animated, TouchableOpacity, View } from 'react-native';
import { useCallback, useRef } from 'react';

import { Motion } from '../../../../constants/motion';

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
  borderRadius: 999,
  elevation: isSelected ? 3 : 1,
  height: SWATCH_SIZE,
  shadowColor: '#1c1917',
  shadowOffset: { height: 1, width: 0 },
  shadowOpacity: isSelected ? 0.15 : 0.08,
  shadowRadius: isSelected ? 4 : 2,
  width: SWATCH_SIZE,
});

export const ColorSwatch = ({
  color,
  colorName,
  isSelected,
  onPress,
  onPressIn,
  onPressOut,
}: ColorSwatchProps) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.15 : 1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      toValue: isSelected ? 1.1 : 0.95,
      useNativeDriver: true,
    }).start();
    onPressIn();
  }, [scale, isSelected, onPressIn]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      friction: 8,
      tension: 200,
      toValue: isSelected ? 1.15 : 1,
      useNativeDriver: true,
    }).start();
    onPressOut();
  }, [scale, isSelected, onPressOut]);

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
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
        }}
      >
        <View
          style={{
            backgroundColor: isSelected ? color : 'transparent',
            borderRadius: 999,
            padding: isSelected ? 2 : 0,
          }}
        >
          <View
            style={{
              backgroundColor: isSelected ? '#fff' : 'transparent',
              borderRadius: 999,
              padding: isSelected ? 3 : 0,
            }}
          >
            <TouchableOpacity
              accessibilityLabel={`${colorName} color${isSelected ? ', selected' : ''}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.8}
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
