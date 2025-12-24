import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface NotificationBadgeProps {
  count?: number;
  visible?: boolean;
}

export function NotificationBadge({ count = 1, visible = true }: NotificationBadgeProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      return;
    }

    // Subtle pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1, // Infinite repeat
      false
    );

    opacity.value = withTiming(1, { duration: 200 });
  }, [visible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: '#ef4444',
          borderWidth: 2,
          borderColor: '#faf9f7',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        },
      ]}
    >
      {count > 0 && (
        <Text
          style={{
            color: '#ffffff',
            fontSize: 11,
            fontWeight: '700',
            lineHeight: 14,
          }}
        >
          {count > 9 ? '9+' : count}
        </Text>
      )}
    </Animated.View>
  );
}
