
import { Text } from 'react-native';
import { useEffect } from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { borderRadius } from '../theme/spacing';
import { colors } from '../theme/colors';
import { typography } from '@/theme/typography';

interface NotificationBadgeProps {
  count?: number;
  visible?: boolean;
}

export function NotificationBadge({
  count = 1,
  visible = true,
}: NotificationBadgeProps) {
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
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          backgroundColor: '#ef4444',
          borderColor: '#FAF8F5',
          borderRadius: borderRadius.full,
          borderWidth: 2,
          height: 18,
          justifyContent: 'center',
          minWidth: 18,
          paddingHorizontal: 4,
          position: 'absolute',
          right: -4,
          top: -4,
        },
      ]}
    >
      {count > 0 && (
        <Text
          style={{
            color: colors.text.inverse,
            fontSize: typography.tabBar.fontSize,
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
