import { Animated, Text, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
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
  const { triggerLightImpact } = useHapticFeedback({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Dark mode color configurations
  const cardBg = isDark ? 'bg-stone-800' : 'bg-white';
  const titleColor = isDark ? 'text-stone-100' : 'text-[#1c1917]';
  const messageColor = isDark ? 'text-stone-300' : 'text-stone-700';
  const shadowColor = isDark ? 'shadow-stone-900' : 'shadow-blue-100';
  const gradientColors = isDark
    ? ['#312e81', '#1e3a8a'] as const // dark purple → dark blue
    : ['#faf5ff', '#eff6ff'] as const; // light purple → light blue
  const benefitColor = isDark ? 'text-purple-300' : 'text-[#7c3aed]';
  const borderColor = isDark ? 'border-stone-600' : 'border-[#d6d3d1]';
  const secondaryTextColor = isDark ? 'text-stone-300' : 'text-stone-600';
  const dismissColor = isDark ? 'text-stone-400' : 'text-stone-500';

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View className={`rounded-3xl ${cardBg} p-5 shadow-lg ${shadowColor}`}>
        <Text className={`text-[17px] font-bold leading-[24px] ${titleColor}`}>
          {title}
        </Text>
        <Text className={`mt-2 text-[17px] leading-[22px] ${messageColor}`}>
          {message}
        </Text>
        <View className='mt-3 rounded-2xl p-3'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={gradientColors}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className={`text-[13px] font-semibold ${benefitColor}`}>
            ✨ {premiumCTA.benefit}
          </Text>
        </View>
        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className={`flex-1 items-center justify-center rounded-full border ${borderColor} px-4 py-2.5`}
            onPress={() => {
              triggerLightImpact();
              onSecondaryAction();
            }}
          >
            <Text className={`text-[17px] font-semibold leading-[22px] ${secondaryTextColor}`}>
              Share
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint={`${premiumCTA.text}: ${premiumCTA.benefit}`}
            accessibilityLabel={premiumCTA.text}
            className='flex-1 items-center justify-center rounded-full px-4 py-2.5'
            style={{ backgroundColor: '#7c3aed' }}
            onPress={() => {
              triggerLightImpact();
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
          <Text className={`text-[13px] font-medium uppercase leading-[18px] tracking-wider ${dismissColor}`}>
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;
