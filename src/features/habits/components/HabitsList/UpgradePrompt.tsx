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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ANIMATION_DURATION, ANIMATION_VALUES } from '../../../../constants';
import { useThemeColors } from '../../../../theme';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { UpgradePromptActions } from './UpgradePromptActions';

interface UpgradePromptProps {
  onClose: () => void;
  onUpgradePress: () => void;
}

export function UpgradePrompt({ onClose, onUpgradePress }: UpgradePromptProps) {
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
          <View
            className='items-center rounded-2xl px-4 py-3'
            style={{ backgroundColor: colors.status.premiumLight }}
          >
            <Text
              className='text-center text-sm font-semibold'
              style={{ color: colors.status.premiumText }}
            >
              $0 for 7 days · Cancel anytime
            </Text>
          </View>
          <UpgradePromptActions
            colors={colors}
            onClose={handleClose}
            onUpgradePress={onUpgradePress}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
