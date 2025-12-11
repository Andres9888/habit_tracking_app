import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface RewardCelebrationToastProps {
  message: string;
  onDismiss: () => void;
  onSecondaryAction: () => void;
  streak?: number;
  visible: boolean;
}

const AnimatedContainer = Animated.createAnimatedComponent(View);

export const RewardCelebrationToast = ({
  message,
  onDismiss,
  onSecondaryAction,
  streak,
  visible,
}: RewardCelebrationToastProps) => {
  const translateY = useRef(new Animated.Value(160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          duration: 280,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 220,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
        toValue: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 180,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  const title = useMemo(() => {
    if (typeof streak === 'number' && streak > 0) {
      return `🔥 ${streak} day streak unlocked`;
    }
    return 'Momentum boost unlocked';
  }, [streak]);

  return (
    <AnimatedContainer
      accessibilityLiveRegion='polite'
      className='absolute bottom-6 left-4 right-4'
      pointerEvents='box-none'
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View className='rounded-3xl bg-white p-5 shadow-lg shadow-blue-100'>
        <Text className='text-[17px] font-bold leading-[24px] text-[#101727]'>{title}</Text>
        <Text className='mt-2 text-[14px] leading-[20px] text-[#334155]'>{message}</Text>

        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <Pressable
            accessibilityHint='Dismiss this celebration'
            accessibilityLabel='Dismiss'
            className='flex-1 items-center justify-center rounded-full border border-[#cbd5e1] px-3 py-2.5'
            onPress={() => {
              triggerLightImpact();
              onDismiss();
            }}
          >
            <Text className='text-[14px] font-semibold leading-[20px] text-[#475467]'>Dismiss</Text>
          </Pressable>
          <Pressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full px-3 py-2.5'
            style={{ backgroundColor: '#3b82f6' }}
            onPress={() => {
              triggerSelection();
              onSecondaryAction();
            }}
          >
            <Text className='text-[14px] font-semibold leading-[20px] text-white'>Share</Text>
          </Pressable>
        </View>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;

