import { forwardRef, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * Props for the FormInput component
 */
interface FormInputProps extends TextInputProps {
  /** Label text displayed above the input */
  label: string;
  /** Emoji icon to display on the left side of the input */
  icon?: string;
  /** Error message to display below the input */
  error?: string;
}

/**
 * FormInput - Enhanced text input with icon, animations, and error handling
 *
 * Features:
 * - Optional left-side icon (emoji or symbol)
 * - Focus/blur animations with border color and scale
 * - Shake animation on validation errors
 * - Error message display with accessibility support
 * - Supports ref forwarding for keyboard navigation
 *
 * @example
 * <FormInput
 *   ref={emailRef}
 *   label="EMAIL"
 *   icon="📧"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 * />
 */
export const FormInput = forwardRef<TextInput, FormInputProps>(function FormInput(
  { label, icon, error, ...props },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  // Reanimated values for focus animations
  const borderColorProgress = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  // Shake animation for errors
  const shakeAnimation = useSharedValue(0);

  // Trigger shake animation when error changes
  useEffect(() => {
    if (error) {
      shakeAnimation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withRepeat(withTiming(-10, { duration: 100 }), 3, true),
        withTiming(0, { duration: 100 })
      );
    }
  }, [error]);

  // Handle focus state changes
  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColorProgress.value = withTiming(1, { duration: 200 });
    shadowOpacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1.01, { damping: 15, stiffness: 150 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColorProgress.value = withTiming(0, { duration: 200 });
    shadowOpacity.value = withTiming(0, { duration: 200 });
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    props.onBlur?.(e);
  };

  // Animated styles for the input container
  const animatedContainerStyle = useAnimatedStyle(() => {
    // Interpolate border color from stone-200 to stone-900
    const borderColor = error
      ? '#ef4444' // red-500 for errors
      : borderColorProgress.value === 1
      ? '#1c1917' // stone-900 when focused
      : '#e7e5e4'; // stone-200 default

    return {
      borderColor,
      transform: [
        { translateX: shakeAnimation.value },
        { scale: scale.value },
      ],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: shadowOpacity.value * 0.1,
      shadowRadius: 4,
      elevation: shadowOpacity.value * 2,
    };
  });

  return (
    <View className='gap-2'>
      <Text className='text-[10px] font-medium tracking-[3px] text-stone-500'>
        {label}
      </Text>
      <Reanimated.View
        style={animatedContainerStyle}
        className='rounded-3xl border bg-white'
      >
        <View className='flex-row items-center px-5 py-3.5'>
          {icon && (
            <Text className='mr-3 text-lg' accessibilityLabel={`${label} icon`}>
              {icon}
            </Text>
          )}
          <TextInput
            ref={ref}
            className='flex-1 text-base font-medium text-stone-900'
            placeholderTextColor='#a8a29e'
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </View>
      </Reanimated.View>
      {error && (
        <Text
          className='text-sm text-red-600'
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
        >
          {error}
        </Text>
      )}
    </View>
  );
});
