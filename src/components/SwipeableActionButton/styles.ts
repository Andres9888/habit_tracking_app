/**
 * Styles for SwipeableActionButton component
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

export const styles = StyleSheet.create({
  swipeAction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  swipeActionInner: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 16,
    width: 100,
  },
  swipeIconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  swipeLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

/** Swipe colors based on variant */
export function getSwipeColors(swipeVariant: 'destructive' | 'warning') {
  return swipeVariant === 'destructive'
    ? { bg: '#dc2626', iconBg: 'rgba(255,255,255,0.2)', text: colors.text.inverse } // red-600
    : { bg: '#f59e0b', iconBg: 'rgba(255,255,255,0.2)', text: colors.text.inverse }; // amber-500
}
