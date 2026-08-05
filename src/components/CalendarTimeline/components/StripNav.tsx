import React from 'react';
import { View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useSwipeHint } from '../hooks/useSwipeHint';

interface StripNavProps {
  children: React.ReactNode;
  canNavigateForward: boolean;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  reduceMotion?: boolean;
}

const ICON_SIZE = iconSizes.small;
const HINT_OPACITY = 0.35;

/** Circle center Y: 14px label + 2px gap + 22px half-circle - 8px half-icon */
const HINT_TOP = 30;
/** 10px into the 16px parent padding — close to cells, not at shelf edge */
const HINT_OFFSET = -10;

const HINT_LEFT = {
  position: 'absolute' as const,
  top: HINT_TOP,
  left: HINT_OFFSET,
  zIndex: 2,
  opacity: HINT_OPACITY,
};

const HINT_RIGHT = {
  position: 'absolute' as const,
  top: HINT_TOP,
  right: HINT_OFFSET,
  zIndex: 2,
  opacity: HINT_OPACITY,
};

const HIT_SLOP_LEFT = { top: 12, bottom: 12, left: 16, right: 8 };
const HIT_SLOP_RIGHT = { top: 12, bottom: 12, left: 8, right: 16 };

/** Day-strip with interactive swipe-hint chevrons in the padding zone */
export const StripNav: React.FC<StripNavProps> = ({
  children,
  canNavigateForward,
  onPreviousWeek,
  onNextWeek,
  reduceMotion = false,
}) => {
  const { colors } = useThemeColors();
  const chevronColor = colors.gray[400];
  const { leftHintStyle, rightHintStyle } = useSwipeHint({
    reduceMotion,
    canNavigateForward,
  });

  return (
    <View style={{ position: 'relative' }}>
      {children}

      <AnimatedPressable
        accessibilityLabel="Previous week"
        accessibilityRole="button"
        hitSlop={HIT_SLOP_LEFT}
        style={[HINT_LEFT, leftHintStyle]}
        onPress={onPreviousWeek}
      >
        <ChevronLeft color={chevronColor} size={ICON_SIZE} strokeWidth={2.5} />
      </AnimatedPressable>

      {canNavigateForward && onNextWeek ? (
        <AnimatedPressable
          accessibilityLabel="Next week"
          accessibilityRole="button"
          hitSlop={HIT_SLOP_RIGHT}
          style={[HINT_RIGHT, rightHintStyle]}
          onPress={onNextWeek}
        >
          <ChevronRight
            color={chevronColor}
            size={ICON_SIZE}
            strokeWidth={2.5}
          />
        </AnimatedPressable>
      ) : null}
    </View>
  );
};
