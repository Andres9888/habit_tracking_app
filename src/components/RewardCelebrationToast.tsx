import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

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
  const translateY = useRef(new Animated.Value(160)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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
        <Text className='text-base font-bold text-[#101727]'>{title}</Text>
        <Text className='mt-2 text-sm text-[#334155]'>{message}</Text>

        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <Pressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full border border-[#0ea5e9] px-3 py-2'
            onPress={onSecondaryAction}
          >
            <Text className='text-sm font-semibold text-[#0ea5e9]'>Share streak</Text>
          </Pressable>
          <Pressable
            accessibilityHint='Open boosters to accelerate progress'
            accessibilityLabel='Unlock boosters'
            className='flex-1 items-center justify-center rounded-full bg-[#0ea5e9] px-3 py-2'
            onPress={onPrimaryAction}
          >
            <Text className='text-sm font-semibold text-white'>Unlock boosters</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel='Dismiss reward toast'
          className='mt-3 items-center'
          onPress={onDismiss}
        >
          <Text className='text-xs font-semibold uppercase tracking-wider text-[#64748b]'>Not now</Text>
        </Pressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;

