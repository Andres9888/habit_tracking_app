/** AuthError - OPTIMIZED: FadeIn animation, better styling, haptics */
import { Text, View } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { AuthErrorProps } from './types';

export function AuthError({ message, onDismiss }: AuthErrorProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLiveRegion='assertive'
      accessibilityRole='alert'
      className='mb-4 flex-row items-start gap-3 rounded-2xl border p-4'
      entering={FadeInDown.duration(280).springify().damping(18)}
      exiting={FadeOut.duration(150)}
      style={{
        backgroundColor: colors.status.errorLight,
        borderColor: colors.status.errorLight,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.errorLight }}>
        <AlertCircle color={colors.status.error} size={18} strokeWidth={2.5} />
      </View>
      <View className='flex-1'>
        <Text className='text-[17px] font-medium leading-[22px]' style={{ color: colors.status.errorText }}>
          {message}
        </Text>
      </View>
      <AnimatedPressable
        accessibilityHint='Removes the error message from the screen'
        accessibilityLabel='Dismiss error'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full'
        style={{ backgroundColor: 'transparent' }}
        onPress={onDismiss}
      >
        <X color={colors.status.error} size={18} strokeWidth={2} />
      </AnimatedPressable>
    </Animated.View>
  );
}
