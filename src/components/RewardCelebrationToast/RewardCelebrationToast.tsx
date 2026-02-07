import { Animated, Text, View } from 'react-native';
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
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{ opacity, transform: [{ translateY }] }}
    >
      <View className='rounded-3xl bg-white p-5 shadow-lg shadow-blue-100'>
        <Text className='text-[17px] font-bold leading-[24px] text-[#1c1917]'>
          {title}
        </Text>
        <Text className='mt-2 text-[15px] leading-[20px] text-[#44403c]'>
          {message}
        </Text>
        <View
          className='mt-3 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-3'
          style={{ backgroundColor: '#faf5ff' }}
        >
          <Text className='text-[13px] font-semibold text-[#7c3aed]'>
            ✨ {premiumCTA.benefit}
          </Text>
        </View>
        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <AnimatedPressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full border border-[#d6d3d1] px-4 py-2.5'
            onPress={() => {
              triggerSelection();
              onSecondaryAction();
            }}
          >
            <Text className='text-[15px] font-semibold leading-[20px] text-[#475467]'>
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
            <Text className='text-[15px] font-semibold leading-[20px] text-white'>
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
          <Text className='text-[10px] font-medium uppercase leading-[12px] tracking-wider text-[#78716c]'>
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;
