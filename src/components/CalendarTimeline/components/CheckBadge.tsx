import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Check } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';

interface CheckBadgeProps {
  reduceMotion: boolean;
}

const BADGE_SIZE = 16;
const ENTRANCE_SPRING = { friction: 5, tension: 200, useNativeDriver: true };

/** Themed circle with checkmark at bottom-right of a completed day cell */
export const CheckBadge: React.FC<CheckBadgeProps> = ({ reduceMotion }) => {
  const { colors } = useThemeColors();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }
    Animated.spring(scaleAnim, { ...ENTRANCE_SPRING, toValue: 1 }).start();
  }, [scaleAnim, reduceMotion]);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: BADGE_SIZE / 2,
        bottom: -2,
        ...shadows.subtle,
        height: BADGE_SIZE,
        justifyContent: 'center',
        position: 'absolute',
        right: -2,
        transform: [{ scale: scaleAnim }],
        width: BADGE_SIZE,
        zIndex: 1,
      }}
    >
      <Check color={colors.primary[500]} size={9} strokeWidth={2.5} />
    </Animated.View>
  );
};
