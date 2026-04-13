/**
 * TemplateAddedToast Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';
import { ICON_BADGE_SIZE } from './constants';

export const styles = StyleSheet.create({
  actionPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: fontWeights.bold,
  },
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 10,
    height: ICON_BADGE_SIZE,
    justifyContent: 'center',
    width: ICON_BADGE_SIZE,
  },
  iconText: {
    fontSize: 20,
  },
  nameText: {
    ...typography.bodySmall,
    color: colors.text.inverse,
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
