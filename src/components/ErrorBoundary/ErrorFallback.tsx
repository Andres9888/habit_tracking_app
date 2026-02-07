/**
 * ErrorFallback - OPTIMIZED: Better visuals, animation, haptics
 */
import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Trigger error haptic on mount
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRetry();
  };

  return (
    <View className='flex-1 items-center justify-center bg-stone-50 px-6'>
      <Animated.View
        className='items-center'
        entering={FadeInDown.duration(300).springify().damping(18)}
      >
        {/* Icon */}
        <View
          className='mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-50'
          style={{
            shadowColor: '#ef4444',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
        >
          <AlertTriangle color='#dc2626' size={40} strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text
          className='mb-2 text-center font-bold text-stone-900'
          style={{ fontSize: 22, letterSpacing: -0.5 }}
        >
          Something went wrong
        </Text>

        {/* Description */}
        <Text className='mb-8 text-center text-[15px] leading-[22px] text-stone-500'>
          We encountered an unexpected error.{'\n'}Please try again.
        </Text>

        {/* Retry Button */}
        <AnimatedPressable
          accessibilityLabel='Try again'
          accessibilityRole='button'
          className='flex-row items-center gap-2 rounded-2xl bg-stone-900 px-8 py-4'
          style={[
            animatedStyle,
            {
              shadowColor: '#1c1917',
              shadowOffset: { height: 4, width: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
          ]}
          onPress={handleRetry}
          onPressIn={() => {
            scale.value = withSpring(0.95, { damping: 15 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15 });
          }}
        >
          <RefreshCw color='#ffffff' size={18} strokeWidth={2.5} />
          <Text className='text-[17px] font-semibold text-white'>
            Try Again
          </Text>
        </AnimatedPressable>

        {/* Dev Error Details */}
        {__DEV__ && error && (
          <View className='mt-8 max-w-[300px] rounded-xl bg-red-50 p-4'>
            <Text className='font-mono text-[12px] text-red-700'>
              {error.message}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
