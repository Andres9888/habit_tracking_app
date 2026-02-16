/**
 * PasswordInput - Secure text input with visibility toggle
 */
import { forwardRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { usePasswordInputAnimations } from './usePasswordInputAnimations';
import type { PasswordInputProps } from './types';

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(
    {
      value,
      onChangeText,
      placeholder = 'Enter your password',
      error,
      labelRight,
      ...props
    },
    ref
  ) {
    const [isSecure, setIsSecure] = useState(true);
    const { colors: themeColors, isDark } = useThemeColors();
    const { animatedStyle, handleFocus, handleBlur } =
      usePasswordInputAnimations();

    const errorStyle = error ? { borderColor: '#ef4444', borderWidth: 1 } : {}; // red-500 is semantic error
    const iconColor = themeColors.text.secondary;

    return (
      <View className='gap-2'>
        <View className='flex-row items-center justify-between'>
          <Text
            className='text-sm font-medium'
            style={{ color: themeColors.text.secondary }}
          >
            Password
          </Text>
          {labelRight}
        </View>
        <Animated.View
          className='relative flex-row items-center rounded-2xl border'
          style={[
            animatedStyle,
            errorStyle,
            {
              backgroundColor: themeColors.card,
              borderColor: error ? '#ef4444' : themeColors.border, // red-500 is semantic error
            },
          ]}
        >
          <View className='pl-5'>
            <Lock
              color={iconColor}
              size={20}
              strokeWidth={2}
              testID='password-lock-icon'
            />
          </View>

          <TextInput
            ref={ref}
            accessible
            accessibilityHint='Enter your password to sign in'
            accessibilityLabel='Password input field'
            autoComplete='password'
            className='flex-1 px-3 py-4 text-[17px] font-medium leading-[22px]'
            placeholder={placeholder}
            placeholderTextColor={themeColors.text.tertiary}
            secureTextEntry={isSecure}
            style={{ color: themeColors.text.primary }}
            value={value}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            {...props}
          />

          <AnimatedPressable
            accessible
            accessibilityHint='Toggle password visibility'
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            accessibilityRole='button'
            className='min-h-[44px] min-w-[44px] items-center justify-center pr-2'
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            testID='password-visibility-toggle'
            onPress={() => setIsSecure((prev) => !prev)}
          >
            {isSecure ? (
              <Eye
                color={iconColor}
                size={20}
                strokeWidth={2}
                testID='eye-icon'
              />
            ) : (
              <EyeOff
                color={iconColor}
                size={20}
                strokeWidth={2}
                testID='eye-off-icon'
              />
            )}
          </AnimatedPressable>
        </Animated.View>

        {error && (
          <Text
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            className='px-2 text-sm font-medium text-red-600'
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);
