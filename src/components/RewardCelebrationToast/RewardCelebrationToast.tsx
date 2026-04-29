import { memo, Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '@/theme/ThemeContext';
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

function RewardCelebrationToastComponent({
  message,
  onDismiss,
  onPrimaryAction,
  onSecondaryAction,
  streak,
  visible,
}: RewardCelebrationToastProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { translateY, opacity } = useRewardToastAnimation(visible);
  const { title, premiumCTA } = useRewardToastContent(streak);
  const { triggerLightImpact } = useHapticFeedback({});

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View className='rounded-3xl p-5' style={{ backgroundColor: themeColors.card, shadowColor: themeColors.border, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}>
        <Text className='text-base font-bold leading-[24px]' style={{ color: themeColors.text.primary }}>
          {title}
        </Text>
        <Text className='mt-2 text-base leading-[22px]' style={{ color: themeColors.text.primary }}>
          {message}
        </Text>
        <View className='mt-3 rounded-2xl p-3'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={isDark ? [themeColors.status.premiumLight, themeColors.card] : ['#faf5ff', '#eff6ff']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className='text-sm font-semibold' style={{ color: themeColors.status.premium }}>
            ✨ {premiumCTA.benefit}
          </Text>
        </View>
        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full border px-4 py-2.5'
            style={{ borderColor: themeColors.border }}
            onPress={() => {
              triggerLightImpact();
              onSecondaryAction();
            }}
          >
            <Text className='text-base font-semibold leading-[22px]' style={{ color: themeColors.text.primary }}>
              Share
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint={`${premiumCTA.text}: ${premiumCTA.benefit}`}
            accessibilityLabel={premiumCTA.text}
            className='flex-1 items-center justify-center rounded-full px-4 py-2.5'
            style={{ backgroundColor: themeColors.status.premium }}
            onPress={() => {
              triggerLightImpact();
              onPrimaryAction();
            }}
          >
            <Text className='text-base font-semibold leading-[22px] text-white'>
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
          <Text className='text-sm font-medium uppercase leading-[18px] tracking-wider' style={{ color: themeColors.text.secondary }}>
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
}

export const RewardCelebrationToast = memo(RewardCelebrationToastComponent);

export default RewardCelebrationToast;
