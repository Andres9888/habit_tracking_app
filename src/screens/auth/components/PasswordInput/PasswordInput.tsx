/**
 * PasswordInput - Secure text input with visibility toggle
 */
import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePasswordInputAnimations } from './usePasswordInputAnimations';
import type { PasswordInputProps } from './types';

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
    const { animatedStyle, handleFocus, handleBlur } =
      usePasswordInputAnimations();

    const errorStyle = error ? { borderColor: '#ef4444', borderWidth: 1 } : {};

    return (
      <View className='gap-2'>
        <Text className='text-sm font-medium text-stone-500'>Password</Text>
        <Animated.View
          className='relative flex-row items-center rounded-3xl border'
          style={[animatedStyle, errorStyle]}
        >
          <View className='pl-5'>
            <Text className='text-lg'>🔒</Text>
          </View>

          <TextInput
            ref={ref}
            accessible
            accessibilityHint='Enter your password to sign in'
            accessibilityLabel='Password input field'
            autoComplete='password'
            className='flex-1 px-3 py-3.5 text-base font-medium text-stone-900'
            placeholder={placeholder}
            placeholderTextColor='#a8a29e'
            secureTextEntry={isSecure}
            value={value}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            {...props}
          />

          <TouchableOpacity
            accessible
            accessibilityHint='Toggle password visibility'
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            accessibilityRole='button'
            className='min-h-[44px] min-w-[44px] items-center justify-center pr-2'
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={() => setIsSecure((prev) => !prev)}
          >
            <Text className='text-lg'>{isSecure ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
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
