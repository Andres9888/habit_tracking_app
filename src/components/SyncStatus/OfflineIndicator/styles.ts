/**
 * OfflineIndicator Styles
 *
 * Subtle, non-intrusive styling for the offline status indicator.
 * Uses muted colors to avoid distraction while remaining visible.
 */

import { StyleSheet } from 'react-native';

import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fafaf9', // stone-50 - subtle background
    borderColor: '#e7e5e4', // stone-200 - soft border
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4', // stone-100
    borderRadius: 8,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: '#78716c', // stone-500 - muted text
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
