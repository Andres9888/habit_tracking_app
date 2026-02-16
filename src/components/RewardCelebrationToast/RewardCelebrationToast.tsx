import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useRewardToastAnimation } from './useRewardToastAnimation';
import { useRewardToastContent } from './useRewardToastContent';
import { useThemeColors } from '../../theme/ThemeContext';

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
  const { colors, isDark } = useThemeColors();

  const cardBg = isDark ? '#1F2937' : '#FFFFFF';
  const cardShadow = isDark ? '#000000' : '#DBEAFE';
  const titleColor = isDark ? '#F9FAFB' : '#1c1917';
  const bodyColor = isDark ? '#D6D3D1' : '#44403C';
  const ctaGradient: [string, string] = isDark
    ? ['#1E1B4B', '#172554']
    : ['#faf5ff', '#eff6ff'];
  const ctaText = isDark ? '#A78BFA' : '#7c3aed';
  const shareBorder = isDark ? '#4B5563' : '#d6d3d1';
  const shareText = isDark ? '#D1D5DB' : '#57534E';
  const dismissText = isDark ? '#9CA3AF' : '#78716C';

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View
        className='rounded-3xl p-5'
        style={{
          backgroundColor: cardBg,
          shadowColor: cardShadow,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text
          className='text-[17px] font-bold leading-[24px]'
          style={{ color: titleColor }}
        >
          {title}
        </Text>
        <Text
          className='mt-2 text-[17px] leading-[22px]'
          style={{ color: bodyColor }}
        >
          {message}
        </Text>
        <View className='mt-3 rounded-2xl p-3'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={ctaGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Text
            className='text-[13px] font-semibold'
            style={{ color: ctaText }}
          >
            ✨ {premiumCTA.benefit}
          </Text>
        </View>
        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full px-4 py-2.5'
            style={{ borderWidth: 1, borderColor: shareBorder }}
            onPress={() => {
              triggerLightImpact();
              onSecondaryAction();
            }}
          >
            <Text
              className='text-[17px] font-semibold leading-[22px]'
              style={{ color: shareText }}
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
          <Text
            className='text-[13px] font-medium uppercase leading-[18px] tracking-wider'
            style={{ color: dismissText }}
          >
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;
