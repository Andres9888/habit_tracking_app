import React from 'react';
import { View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';

interface StripNavProps {
  children: React.ReactNode;
  canNavigateForward: boolean;
}

const ICON_SIZE = 16;
const HINT_OPACITY = 0.35;

/** Circle center Y: 14px label + 2px gap + 22px half-circle - 8px half-icon */
const HINT_TOP = 30;
/** 10px into the 16px parent padding — close to cells, not at shelf edge */
const HINT_OFFSET = -10;

const HINT_BASE = {
  position: 'absolute' as const,
  top: HINT_TOP,
  zIndex: 2,
  opacity: HINT_OPACITY,
};

/** Day-strip with static swipe-hint chevrons in the padding zone */
export const StripNav: React.FC<StripNavProps> = ({
  children,
  canNavigateForward,
}) => {
  const { colors } = useThemeColors();
  const chevronColor = colors.gray[400];

  return (
    <View style={{ position: 'relative' }}>
      {children}

      <View
        accessibilityElementsHidden
        importantForAccessibility='no'
        pointerEvents='none'
        style={{ ...HINT_BASE, left: HINT_OFFSET }}
      >
        <ChevronLeft color={chevronColor} size={ICON_SIZE} strokeWidth={2.5} />
      </View>

      {canNavigateForward && (
        <View
          accessibilityElementsHidden
          importantForAccessibility='no'
          pointerEvents='none'
          style={{ ...HINT_BASE, right: HINT_OFFSET }}
        >
          <ChevronRight
            color={chevronColor}
            size={ICON_SIZE}
            strokeWidth={2.5}
          />
        </View>
      )}
    </View>
  );
};
