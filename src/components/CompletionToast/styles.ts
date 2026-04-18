/**
 * CompletionToast Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

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
    fontSize: 22,
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
    fontSize: 13,
  },
  streakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
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
