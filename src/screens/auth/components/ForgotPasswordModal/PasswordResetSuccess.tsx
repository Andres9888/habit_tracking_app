/** PasswordResetSuccess - OPTIMIZED: FadeIn animation, better styling */
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import type { PasswordResetSuccessProps } from './types';

export function PasswordResetSuccess({ onClose }: PasswordResetSuccessProps) {
  return (
    <View className='gap-4 py-2'>
      <Animated.View
        className='items-center justify-center rounded-2xl bg-emerald-50 p-6'
        entering={FadeIn.duration(300)}
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
          className='items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800'
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
