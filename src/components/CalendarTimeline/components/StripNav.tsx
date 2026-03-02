import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';

interface StripNavProps {
  children: React.ReactNode;
  canNavigateForward: boolean;
}

const ICON_SIZE = 16;
const OPACITY_LOW = 0.3;
const OPACITY_HIGH = 0.7;
const BREATHE_MS = 1500;

/** Circle center Y: 14px label + 2px gap + 22px half-circle - 8px half-icon */
const HINT_TOP = 30;
/** 10px into the 16px parent padding — close to cells, not at shelf edge */
const HINT_OFFSET = -10;

const HINT_BASE = {
  position: 'absolute' as const,
  top: HINT_TOP,
  zIndex: 2,
};

function useBreathe() {
  const opacity = useSharedValue(OPACITY_LOW);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(OPACITY_HIGH, { duration: BREATHE_MS }),
        withTiming(OPACITY_LOW, { duration: BREATHE_MS }),
      ),
      -1,
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

/** Day-strip with breathing swipe-hint chevrons in the padding zone */
export const StripNav: React.FC<StripNavProps> = ({
  children,
  canNavigateForward,
}) => {
  const { colors } = useThemeColors();
  const chevronColor = colors.gray[400];
  const breatheStyle = useBreathe();

  return (
    <View style={{ position: 'relative' }}>
      {children}

      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility='no'
        pointerEvents='none'
        style={[{ ...HINT_BASE, left: HINT_OFFSET }, breatheStyle]}
      >
        <ChevronLeft color={chevronColor} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>

      {canNavigateForward && (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility='no'
          pointerEvents='none'
          style={[{ ...HINT_BASE, right: HINT_OFFSET }, breatheStyle]}
        >
          <ChevronRight color={chevronColor} size={ICON_SIZE} strokeWidth={2.5} />
        </Animated.View>
      )}
    </View>
  );
};
