/**
 * UpgradePrompt — full-screen modal overlay for trial conversion.
 *
 * Part of the **monetization flow**: shown by {@link HabitsListModals} when
 * `upgradePromptVisible` is true (typically after the user tries to exceed
 * the free-tier habit limit).
 *
 * Features a slide-in card with headline, value prop, pricing pill, primary
 * CTA ("Start Free Trial"), and a dismissive secondary button ("Maybe later").
 * The backdrop is tappable to dismiss.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../../theme/ThemeContext';


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
  const { colors } = useThemeColors();
  
  if (!visible) return null;

  return (
    <Animated.View
      className='absolute inset-0 z-20 items-center justify-end'
      entering={FadeIn.duration(280)}
      style={{ backgroundColor: colors.gray[900] + '80' }}

    >
      <Pressable
        accessibilityHint='Tap outside to dismiss'
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={onClose}
      />
      <Animated.View
        className='w-full rounded-t-3xl px-6 py-8'
        entering={SlideInDown.duration(ANIMATION_DURATION.medium).damping(ANIMATION_VALUES.springDamping)}
      >
        <LinearGradient
          className='absolute inset-0 rounded-t-3xl'
          colors={[colors.white, colors.streak[100] + '4D']}
        />
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text
            className='text-center text-[24px] font-bold tracking-tight'
            style={{ color: colors.gray[900] }}
          >
            You're on a roll! Ready for more?
          </Text>
          <Text
            className='text-center text-[15px] font-normal leading-[20px]'
            style={{ color: colors.gray[500] }}
          >
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2× longer.
          </Text>
          <View
            className='items-center rounded-2xl px-4 py-3'
            style={{ backgroundColor: colors.premium[400] + '1A' }}
          >
            <Text
              className='text-center text-[13px] font-semibold'
              style={{ color: colors.premium[700] }}
            >
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <Pressable
            accessibilityHint='Start your 7-day free trial'
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center rounded-full px-5 py-4'
            style={({ pressed }) => ({
              elevation: 4,
              opacity: pressed ? 0.8 : 1,
              shadowColor: colors.premium[600],
              shadowOffset: { height: 8, width: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
            })}

            onPress={onUpgradePress}
          >
            <LinearGradient
              className='absolute inset-0 rounded-full'
              colors={[colors.premium[500], colors.secondary[600]]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            />
            <Text
              className='text-[17px] font-semibold'
              style={{ color: colors.white }}
            >
              Start Free Trial →
            </Text>
          </Pressable>
          <Pressable
            accessibilityHint='Dismiss this upgrade prompt'
            accessibilityLabel='Dismiss upgrade prompt'
            accessibilityRole='button'
            className='items-center rounded-full border-2 px-5 py-3'
            style={({ pressed }) => ({
              backgroundColor: colors.white + 'CC',
              borderColor: colors.gray[200],
              opacity: pressed ? 0.7 : 1,
            })}

            onPress={onClose}
          >
            <Text
              className='text-[15px] font-normal'
              style={{ color: colors.gray[600] }}
            >
              Maybe later
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
