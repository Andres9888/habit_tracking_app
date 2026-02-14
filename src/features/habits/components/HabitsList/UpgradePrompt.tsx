/**
 * UpgradePrompt Component
 * Modal overlay for upgrade CTA — optimized for trial conversion with dark mode
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
  visible: boolean;
}

export function UpgradePrompt({
  onClose,
  onUpgradePress,
  visible,
}: UpgradePromptProps) {
  const { colors, isDark } = useThemeColors();

  if (!visible) return null;

  return (
    <Animated.View
      className='absolute inset-0 z-20 items-center justify-end'
      entering={FadeIn.duration(280)}
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(28,25,23,0.5)' }}
    >
      <Pressable
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <Animated.View
        className='w-full rounded-t-3xl px-6 py-8'
        entering={SlideInDown.duration(280).damping(18)}
      >
        <LinearGradient
          className='absolute inset-0 rounded-t-3xl'
          colors={
            isDark
              ? [colors.card, colors.background]
              : ['#ffffff', 'rgba(255, 251, 235, 0.3)']
          }
        />
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text
            className='text-center text-[24px] font-bold tracking-tight'
            style={{ color: colors.text.primary }}
          >
            You're on a roll! Ready for more?
          </Text>
          <Text
            className='text-center text-[15px] font-normal leading-[20px]'
            style={{ color: colors.text.tertiary }}
          >
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <View
            className='items-center rounded-2xl px-4 py-3'
            style={{
              backgroundColor: isDark ? 'rgba(124, 58, 237, 0.15)' : '#f5f3ff',
            }}
          >
            <Text
              className='text-center text-[13px] font-semibold'
              style={{ color: isDark ? '#a78bfa' : '#6d28d9' }}
            >
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <Pressable
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center rounded-full px-5 py-4'
            style={({ pressed }) => ({
              elevation: 6,
              opacity: pressed ? 0.8 : 1,
              shadowColor: '#312e81',
              shadowOffset: { height: 8, width: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
            })}
            onPress={onUpgradePress}
          >
            <LinearGradient
              className='absolute inset-0 rounded-full'
              colors={['#7c3aed', '#4f46e5']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            />
            <Text className='text-[17px] font-semibold text-white'>
              Start Free Trial →
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Dismiss upgrade prompt'
            accessibilityRole='button'
            className='items-center rounded-full border-2 px-5 py-3'
            style={({ pressed }) => ({
              backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.8)',
              borderColor: isDark ? colors.cardBorder : '#DDD8D2',
              opacity: pressed ? 0.7 : 1,
            })}
            onPress={onClose}
          >
            <Text
              className='text-[15px] font-normal'
              style={{ color: colors.text.secondary }}
            >
              Maybe later
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
