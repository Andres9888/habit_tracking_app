import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
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

export const RewardCelebrationToast = ({
  message,
  onDismiss,
  onPrimaryAction,
  onSecondaryAction,
  streak,
  visible,
}: RewardCelebrationToastProps) => {
  const { animatedStyle } = useRewardToastAnimation(visible);
  const { title, premiumCTA } = useRewardToastContent(streak);
  const { triggerLightImpact } = useHapticFeedback({});

  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={animatedStyle}
    >
      <View className='rounded-3xl bg-white p-5 shadow-lg shadow-blue-100'>
        <Text className='text-[17px] font-bold leading-[24px] text-[#1c1917]'>
          {title}
        </Text>
        <Text className='mt-2 text-[17px] leading-[22px] text-stone-700'>
          {message}
        </Text>
        <View className='mt-3 rounded-2xl p-3'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={['#faf5ff', '#eff6ff']}
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
            className='flex-1 items-center justify-center rounded-full border border-[#d6d3d1] px-4 py-2.5'
            onPress={() => {
              triggerLightImpact();
              onSecondaryAction();
            }}
          >
            <Text className='text-[17px] font-semibold leading-[22px] text-stone-600'>
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
          <Text className='text-[13px] font-medium uppercase leading-[18px] tracking-wider text-stone-500'>
            Not now
          </Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

export default RewardCelebrationToast;
