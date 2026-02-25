import React from 'react';
import { View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { colors } from '../../../theme/colors';

interface StripNavProps {
  children: React.ReactNode;
  canNavigateForward: boolean;
}

const INDICATOR = {
  position: 'absolute' as const,
  top: 16, // vertically centered on the day-number circle row
  opacity: 0.35,
  zIndex: 2,
};

/** Day-strip wrapper with passive swipe-hint chevrons at edges */
export const StripNav: React.FC<StripNavProps> = ({
  children,
  canNavigateForward,
}) => (
  <View style={{ position: 'relative' }}>
    {children}

    {/* Left swipe indicator — always visible */}
    <View
      accessibilityElementsHidden
      importantForAccessibility='no'
      pointerEvents='none'
      style={{ ...INDICATOR, left: -2 }}
    >
      <ChevronLeft color={colors.gray[300]} size={10} strokeWidth={2.5} />
    </View>

    {/* Right swipe indicator — hidden when at current week */}
    {canNavigateForward && (
      <View
        accessibilityElementsHidden
        importantForAccessibility='no'
        pointerEvents='none'
        style={{ ...INDICATOR, right: -2 }}
      >
        <ChevronRight color={colors.gray[300]} size={10} strokeWidth={2.5} />
      </View>
    )}
  </View>
);
