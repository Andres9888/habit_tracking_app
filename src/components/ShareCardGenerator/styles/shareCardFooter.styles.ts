/**
 * Styles for ShareCard footer section (science badge, app info)
 */

// Intentional: static color for share card rendering — white text on gradient backgrounds
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const shareCardFooterStyles = StyleSheet.create({
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scienceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scienceBadgeText: {
    color: colors.text.inverse,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '400',
  },
});
