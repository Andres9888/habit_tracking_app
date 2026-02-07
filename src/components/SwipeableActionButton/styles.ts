/**
 * Styles for SwipeableActionButton component
 */

import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  swipeAction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  swipeActionInner: {
    alignItems: 'center',
    borderRadius: 12,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 16,
    width: 100,
  },
  swipeIconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  swipeLabel: {
    fontSize: typography.tabBar.fontSize,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

/** Swipe colors based on variant */
export function getSwipeColors(swipeVariant: 'destructive' | 'warning') {
  return swipeVariant === 'destructive'
    ? { bg: '#dc2626', iconBg: 'rgba(255,255,255,0.2)', text: '#ffffff' } // red-600
    : { bg: '#f59e0b', iconBg: 'rgba(255,255,255,0.2)', text: '#ffffff' }; // amber-500
}
