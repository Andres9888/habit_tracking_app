import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { springs } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';

interface CheckBadgeProps {
  reduceMotion: boolean;
}

const BADGE_SIZE = 16;

/**
 * Bouncy entrance spring for the check badge pop-in.
 * Replaces legacy { friction: 5, tension: 200 } with design-system preset.
 */
const ENTRANCE_SPRING = springs.bouncy;

/** Themed circle with checkmark at bottom-right of a completed day cell */
export const CheckBadge: React.FC<CheckBadgeProps> = ({ reduceMotion }) => {
  const { colors } = useThemeColors();
  const scale = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, ENTRANCE_SPRING);
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.badge,
        { backgroundColor: colors.card },
        shadows.subtle,
        animatedStyle,
      ]}
    >
      <Check color={colors.primary[500]} size={9} strokeWidth={2.5} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: BADGE_SIZE / 2,
    bottom: -2,
    height: BADGE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: BADGE_SIZE,
    zIndex: 1,
  },
});
