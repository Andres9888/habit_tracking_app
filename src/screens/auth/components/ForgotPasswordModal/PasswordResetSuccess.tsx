/** PasswordResetSuccess - OPTIMIZED: FadeIn animation, better styling */
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { PasswordResetSuccessProps } from './types';

export function PasswordResetSuccess({ onClose }: PasswordResetSuccessProps) {
  const { colors } = useThemeColors();
  return (
    <View className='gap-4 py-2'>
      <Animated.View
        className='items-center justify-center rounded-2xl bg-emerald-50 p-6'
        entering={FadeInDown.duration(280).springify().damping(18)}
        style={{
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <View className='mb-3 h-16 w-16 items-center justify-center rounded-full bg-emerald-500'>
          <Check color='#ffffff' size={32} strokeWidth={3} />
        </View>
        <Text className='text-center text-[17px] font-semibold text-emerald-900'>
          Email Sent!
        </Text>
        <Text className='mt-1 text-center text-[17px] leading-[22px] text-emerald-700'>
          Check your inbox for password reset instructions.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(280).delay(100).springify().damping(18)}
      >
        <AnimatedPressable
          accessibilityHint='Closes this dialog and returns to sign in'
          accessibilityLabel='Close modal'
          accessibilityRole='button'
          className='items-center rounded-2xl py-4'
          style={{ backgroundColor: colors.gray[900] }}
          style={{
            shadowColor: '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
          }}
          onPress={onClose}
        >
          <Text className='text-[17px] font-semibold text-white'>Done</Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
