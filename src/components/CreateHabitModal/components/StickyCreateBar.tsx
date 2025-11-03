import { useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { useKeyboardState } from '../hooks/useKeyboardState';

interface StickyCreateBarProps {
  disabled: boolean;
  onPress: () => void;
}

export const StickyCreateBar = ({ disabled, onPress }: StickyCreateBarProps) => {
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible, keyboardHeight } = useKeyboardState();
  const scale = useRef(new Animated.Value(1)).current;

  const bottom = useMemo(() => {
    // Keep bar above keyboard if visible; otherwise rest on safe area
    if (isKeyboardVisible) return keyboardHeight + 12;
    return Math.max(insets.bottom, 12) + 12;
  }, [insets.bottom, isKeyboardVisible, keyboardHeight]);

  return (
    <View
      pointerEvents='box-none'
      style={{ position: 'absolute', left: 16, right: 16, bottom }}
    >
      <View className='rounded-2xl bg-white/95 p-2 shadow-lg shadow-black/10'>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            accessibilityLabel={STRINGS.CREATE_HABIT.createAction}
            accessibilityRole='button'
            className={`items-center justify-center rounded-xl py-3 ${disabled ? 'bg-gray-300' : ''}`}
            style={{ backgroundColor: disabled ? '#D1D5DB' : '#111827' }}
            disabled={disabled}
            onPressIn={() => {
              Animated.timing(scale, {
                duration: Motion.duration.fast,
                easing: Motion.easing.inEase,
                toValue: 0.98,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.timing(scale, {
                duration: Motion.duration.base,
                easing: Motion.easing.outEase,
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
            onPress={onPress}
          >
            <Text className='text-[15px] font-semibold text-white'>
              {STRINGS.CREATE_HABIT.createAction}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

export default StickyCreateBar;
