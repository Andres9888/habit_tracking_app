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
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { OPACITY, ANIMATION_DURATION, ANIMATION_VALUES } from '../../../../constants';
import { useThemeColors, colors as palette } from '../../../../theme';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
}

export function UpgradePrompt({
  onClose,
  onUpgradePress,
}: UpgradePromptProps) {
  const { colors, isDark } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback();

  const handleClose = () => {
    triggerLightImpact();
    onClose();
  };

  return (
    <Animated.View
      className='absolute inset-0 z-20 items-center justify-end'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      entering={FadeIn.duration(ANIMATION_DURATION.medium)}
      exiting={FadeOut.duration(200)}
    >
      <Pressable
        accessibilityHint='Tap outside to dismiss'
        accessibilityLabel='Close upgrade prompt'
        accessibilityRole='button'
        className='absolute inset-0'
        onPress={handleClose}
      />
      <Animated.View
        className='w-full rounded-t-3xl px-6 py-8'
        entering={FadeInDown.duration(ANIMATION_DURATION.medium).damping(
          ANIMATION_VALUES.springDamping
        )}
        exiting={FadeOutDown.duration(220)}
      >
        <LinearGradient
          className='absolute inset-0 rounded-t-3xl'
          colors={[
            colors.card,
            isDark ? `${colors.card}30` : 'rgba(255, 251, 235, 0.3)',
          ]}
        />
        <View className='gap-4'>
          <View className='items-center pb-2'>
            <Text className='text-[32px]'>🚀</Text>
          </View>
          <Text
            className='text-center text-2xl font-bold tracking-tight'
            style={{ color: colors.text.primary }}
          >
            Ready to build more habits?
          </Text>
          <Text
            className='text-center text-base font-normal leading-[20px]'
            style={{ color: colors.text.secondary }}
          >
            Track unlimited habits across all areas of your life. Premium
            members build stronger routines and stay consistent 2x longer.
          </Text>
          <View className='items-center rounded-2xl px-4 py-3' style={{ backgroundColor: colors.status.premiumLight }}>
            <Text className='text-center text-sm font-semibold' style={{ color: colors.status.premiumText }}>
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <Pressable
            accessibilityHint='Start your 7-day free trial'
            accessibilityLabel='Start 7-day free trial for premium'
            accessibilityRole='button'
            className='items-center rounded-full px-5 py-4 shadow-[0px_8px_16px_rgba(109,40,217,0.25)]'
            style={({ pressed }) => ({
              opacity: pressed ? OPACITY.strong : OPACITY.full,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
            onPress={onUpgradePress}
          >
            <LinearGradient
              className='absolute inset-0 rounded-full'
              colors={[palette.premium[600], palette.indigo[600]]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            />
            <Text className='text-base font-semibold text-white'>
              Start Free Trial →
            </Text>
          </Pressable>
          <Pressable
            accessibilityHint='Dismiss this upgrade prompt'
            accessibilityLabel='Dismiss upgrade prompt'
            accessibilityRole='button'
            className='items-center rounded-full border-2 px-5 py-3'
            style={({ pressed }) => ({
              borderColor: colors.border,
              backgroundColor: `${colors.card}CC`,
              opacity: pressed ? OPACITY.high : OPACITY.full,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
            onPress={handleClose}
          >
            <Text
              className='text-base font-normal'
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
