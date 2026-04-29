/**
 * CompletionToast Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  habitIcon: {
    fontSize: typography.heading1.fontSize,
  },
  message: {
    flex: 1,
  },
  primaryText: {
    fontWeight: fontWeights.semibold,
  },
  streakBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  streakEmoji: {
    fontSize: typography.caption.fontSize,
  },
  streakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
  },
  toast: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
});
