/**
 * Styles for ShareCard footer section (science badge, app info)
 */

import { StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';

export const shareCardFooterStyles = StyleSheet.create({
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    color: '#FFFFFF',
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
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scienceBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '400',
  },
});
