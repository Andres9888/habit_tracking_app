/** AuthError - OPTIMIZED: FadeIn animation, better styling, haptics, dark mode */
import { Text, View } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { AuthErrorProps } from './types';

export function AuthError({ message, onDismiss }: AuthErrorProps) {
  const { isDark } = useThemeColors();

  const errorBg = isDark ? '#450A0A' : '#FEF2F2';
  const errorBorder = isDark ? '#7F1D1D' : '#FECACA';
  const errorIconBg = isDark ? '#7F1D1D' : '#FEE2E2';
  const errorIconColor = isDark ? '#FCA5A5' : '#dc2626';
  const errorTextColor = isDark ? '#FCA5A5' : '#991B1B';

  return (
    <Animated.View
      accessibilityLiveRegion='assertive'
      accessibilityRole='alert'
      className='mb-4 flex-row items-start gap-3 rounded-2xl p-4'
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={[
        {
          backgroundColor: errorBg,
          borderColor: errorBorder,
          borderWidth: 1,
        },
        shadows.card,
      ]}
    >
      <View
        className='mt-0.5 h-8 w-8 items-center justify-center rounded-full'
        style={{ backgroundColor: errorIconBg }}
      >
        <AlertCircle color={errorIconColor} size={18} strokeWidth={2.5} />
      </View>
      <View className='flex-1'>
        <Text
          className='text-[17px] font-medium leading-[22px]'
          style={{ color: errorTextColor }}
        >
          {message}
        </Text>
      </View>
      <AnimatedPressable
        accessibilityHint='Removes the error message from the screen'
        accessibilityLabel='Dismiss error'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full'
        onPress={onDismiss}
      >
        <X color={errorIconColor} size={18} strokeWidth={2} />
      </AnimatedPressable>
    </Animated.View>
  );
}
