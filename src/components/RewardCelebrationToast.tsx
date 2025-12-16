import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

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

  // Dynamic CTA based on streak milestone
  const premiumCTA = useMemo(() => {
    if (!streak || streak < 7) {
      return {
        text: 'Get Premium Habits',
        benefit: 'Science-backed habits from experts'
      };
    }
    if (streak < 14) {
      return {
        text: 'Unlock Streak Protection',
        benefit: 'Never lose progress on rest days'
      };
    }
    if (streak < 30) {
      return {
        text: 'Get Advanced Analytics',
        benefit: 'See your trends & insights'
      };
    }
    return {
      text: 'Join Premium Community',
      benefit: 'Connect with 10k+ habit builders'
    };
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

        {/* Premium value prop */}
        <View className='mt-3 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 p-3' style={{ backgroundColor: '#faf5ff' }}>
          <Text className='text-[13px] font-semibold text-[#7c3aed]'>✨ {premiumCTA.benefit}</Text>
        </View>

        <View className='mt-4 flex-row items-center justify-between gap-3'>
          <Pressable
            accessibilityHint='Share this streak to motivate friends'
            accessibilityLabel='Share streak'
            className='flex-1 items-center justify-center rounded-full border border-[#cbd5e1] px-3 py-2.5'
            onPress={() => {
              triggerSelection();
              onSecondaryAction();
            }}
          >
            <Text className='text-[14px] font-semibold leading-[20px] text-[#475467]'>Share</Text>
          </Pressable>
          <Pressable
            accessibilityHint={`${premiumCTA.text}: ${premiumCTA.benefit}`}
            accessibilityLabel={premiumCTA.text}
            className='flex-1 items-center justify-center rounded-full px-3 py-2.5'
            style={{ backgroundColor: '#7c3aed' }}
            onPress={() => {
              triggerSelection();
              onPrimaryAction();
            }}
          >
            <Text className='text-[14px] font-semibold leading-[20px] text-white'>{premiumCTA.text}</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel='Dismiss reward toast'
          className='mt-3 items-center'
          onPress={() => {
            triggerLightImpact();
            onDismiss();
          }}
        >
          <Text className='text-[11px] font-semibold uppercase leading-[16px] tracking-wider text-[#64748b]'>Not now</Text>
        </Pressable>
      </View>
    </AnimatedContainer>
  );
};

export default RewardCelebrationToast;

