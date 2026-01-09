import { Plus } from 'lucide-react-native';
import { memo, useCallback, useRef } from 'react';
import { Animated, Keyboard, TouchableOpacity, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { Motion } from '../../../../constants/motion';
import type { CustomColorButtonProps } from './types';

/**
 * Custom color button with dashed border and plus icon
 * V9: Updated to 36px to match color swatches
 * V12: Updated to 44px to match larger color swatches
 */
const CustomColorButtonComponent = ({ onPress }: CustomColorButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <View
      style={{
        alignItems: 'center',
        height: 52,
        justifyContent: 'center',
        width: 52,
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          accessibilityLabel='Choose custom color'
          accessibilityRole='button'
          style={{
            alignItems: 'center',
            borderColor: '#a8a29e',
            borderRadius: 999,
            borderStyle: 'dashed',
            borderWidth: 2,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}
          testID='color-swatch-custom'
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Plus color='#a8a29e' size={20} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export const CustomColorButton = memo(CustomColorButtonComponent);
