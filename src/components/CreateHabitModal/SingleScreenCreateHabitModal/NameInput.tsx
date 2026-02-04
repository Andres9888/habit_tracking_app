/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION, COLORS, DIMENSIONS, TYPOGRAPHY } from './constants';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface NameInputProps {
  autoFocus?: boolean;
  error?: string | null;
  onBlur?: () => void;
  onChangeText: (text: string) => void;
  value: string;
}

function NameInputComponent({
  autoFocus = true,
  error,
  onBlur,
  onChangeText,
  value,
}: NameInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue<string>(COLORS.neutralBase);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, ANIMATION.screenEntry + 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  useEffect(() => {
    const errorColor = '#EF4444';
    if (error) {
      borderColor.value = withTiming(errorColor, {
        duration: ANIMATION.fieldFocus,
        easing: Easing.out(Easing.ease),
      });
    } else if (isFocused) {
      borderColor.value = withTiming(COLORS.accent, {
        duration: ANIMATION.fieldFocus,
        easing: Easing.out(Easing.ease),
      });
    } else {
      borderColor.value = withTiming(COLORS.neutralBase, {
        duration: ANIMATION.fieldFocus,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [borderColor, error, isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <View className='mb-4'>
      <AnimatedTextInput
        ref={inputRef}
        blurOnSubmit
        accessibilityHint='Enter a name for your habit'
        accessibilityLabel='Habit name'
        className='px-4'
        maxLength={50}
        placeholder='Habit name'
        placeholderTextColor={COLORS.mutedText}
        returnKeyType='done'
        style={[
          animatedStyle,
          {
            backgroundColor: COLORS.cardBackground,
            borderRadius: DIMENSIONS.borderRadius.input,
            borderWidth: 1,
            color: COLORS.secondary,
            fontSize: TYPOGRAPHY.body.fontSize,
            height: DIMENSIONS.inputHeight,
          },
        ]}
        value={value}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        onFocus={handleFocus}
      />
      {error && (
        <Text
          accessibilityLabel={`Error: ${error}`}
          accessibilityRole='alert'
          className='mt-2 text-center'
          style={{
            color: '#EF4444',
            fontSize: TYPOGRAPHY.caption.fontSize,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export const NameInput = memo(NameInputComponent);
