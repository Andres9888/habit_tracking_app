import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { springs } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';

interface CheckBadgeProps {
  reduceMotion: boolean;
}

const BADGE_SIZE = 18;

/** Snappy pop-in for the check badge — celebration spring for punchy feel */
const ENTRANCE_SPRING = springs.celebration;

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
        {
          backgroundColor: colors.primary[100],
          borderWidth: 1.5,
          borderColor: colors.card,
        },
        shadows.subtle,
        animatedStyle,
      ]}
    >
      <Check color={colors.primary[500]} size={iconSizes.micro} strokeWidth={2.5} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: BADGE_SIZE / 2,
    bottom: -3,
    height: BADGE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    width: BADGE_SIZE,
    zIndex: 1,
  },
});
