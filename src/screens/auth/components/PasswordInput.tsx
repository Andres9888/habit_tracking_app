import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(
    {
      value,
      onChangeText,
      placeholder = 'Enter your password',
      error,
      ...props
    },
    ref
  ) {
  const [isSecure, setIsSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Animated values for focus/blur animations
  const borderColor = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  const toggleSecureEntry = () => {
    setIsSecure((prev) => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    shadowOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    shadowOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value === 1 ? '#0f172a' : '#e2e8f0', // slate-900 : slate-200
      shadowOpacity: shadowOpacity.value * 0.1,
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: shadowOpacity.value * 2,
    };
  });

  const errorStyle = error
    ? {
        borderColor: '#ef4444', // red-500
        borderWidth: 1,
      }
    : {};

  return (
    <View className="gap-2">
      <Text className="text-[10px] font-medium tracking-[3px] text-slate-500">
        PASSWORD
      </Text>
      <Animated.View
        style={[animatedStyle, errorStyle]}
        className="relative flex-row items-center rounded-3xl border border-slate-200 bg-white"
      >
        {/* Lock Icon Prefix */}
        <View className="pl-5">
          <Text className="text-lg">🔒</Text>
        </View>

        {/* Text Input */}
        <TextInput
          ref={ref}
          secureTextEntry={isSecure}
          autoComplete="password"
          className="flex-1 px-3 py-3.5 text-base font-medium text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessible={true}
          accessibilityLabel="Password input field"
          accessibilityHint="Enter your password to sign in"
          {...props}
        />

        {/* Toggle Visibility Button */}
        <TouchableOpacity
          onPress={toggleSecureEntry}
          className="pr-5"
          accessible={true}
          accessibilityLabel={
            isSecure ? 'Show password' : 'Hide password'
          }
          accessibilityRole="button"
          accessibilityHint="Toggle password visibility"
        >
          <Text className="text-lg">{isSecure ? '👁' : '🙈'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Text className="px-2 text-sm font-medium text-red-500">{error}</Text>
      )}
    </View>
  );
  }
);
