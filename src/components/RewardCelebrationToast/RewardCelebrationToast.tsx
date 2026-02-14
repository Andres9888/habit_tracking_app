/**
 * RewardCelebrationToast - Premium upsell toast shown after streak milestones.
 * Uses theme-aware colors for dark mode support.
 */

import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '../../theme/ThemeContext';
import { useRewardToastAnimation } from './useRewardToastAnimation';
import { useRewardToastContent } from './useRewardToastContent';

interface RewardCelebrationToastProps {
  message: string;
  onDismiss: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  streak?: number;
  visible: boolean;
}

const AnimatedContainer = Animated.createAnimatedComponent(View);

export const RewardCelebrationToast = ({
  message,
  onDismiss,
  onPrimaryAction,
  onSecondaryAction,
  streak,
  visible,
}: RewardCelebrationToastProps) => {
  const { translateY, opacity } = useRewardToastAnimation(visible);
  const { title, premiumCTA } = useRewardToastContent(streak);
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const { colors, isDark } = useThemeColors();

  const premiumGradient: [string, string] = isDark
    ? ['#1e1b4b', '#172554']
    : ['#faf5ff', '#eff6ff'];

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View
        className='rounded-3xl p-5 shadow-lg'
        style={{ backgroundColor: colors.card }}
      >
        <Text
          className='text-[17px] font-bold leading-[24px]'
          style={{ color: colors.text.primary }}
        >
          {title}
        </Text>
        <Text
          className='mt-2 text-[17px] leading-[22px]'
          style={{ color: colors.text.secondary }}
        >
          {message}
        </Text>
        <View className='mt-3 rounded-2xl p-3'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={premiumGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className='text-[13px] font-semibold text-[#7c3aed]'>
            ✨ {premiumCTA.benefit}
          </Text>
        </View>
        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full px-4 py-2.5'
            style={{ borderWidth: 1, borderColor: colors.gray[300] }}
            onPress={() => {
              triggerSelection();
              onSecondaryAction();
            }}
          >
            <Text
              className='text-[17px] font-semibold leading-[22px]'
              style={{ color: colors.text.secondary }}
            >
              Share
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint={`${premiumCTA.text}: ${premiumCTA.benefit}`}
            accessibilityLabel={premiumCTA.text}
            className='flex-1 items-center justify-center rounded-full px-4 py-2.5'
            style={{ backgroundColor: '#7c3aed' }}
            onPress={() => {
              triggerSelection();
              onPrimaryAction();
            }}
          >
            <Text className='text-[17px] font-semibold leading-[22px] text-white'>
              {premiumCTA.text}
            </Text>
          </AnimatedPressable>
        </View>
        <AnimatedPressable
          accessibilityLabel='Dismiss reward toast'
          className='mt-3 items-center'
          onPress={() => {
            triggerLightImpact();
            onDismiss();
          }}
        >
          <Text
            className='text-[13px] font-medium uppercase leading-[18px] tracking-wider'
            style={{ color: colors.text.tertiary }}
          >
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;
