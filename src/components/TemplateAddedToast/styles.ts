/**
 * TemplateAddedToast Styles
 */

import { StyleSheet } from 'react-native';
import { colors, overlays } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';
import { ICON_BADGE_SIZE } from './constants';

export const styles = StyleSheet.create({
  actionColumn: {
    alignItems: 'stretch',
    gap: 8,
    minWidth: 132,
  },
  actionPill: {
    alignItems: 'center',
    backgroundColor: overlays.glassLight,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: fontWeights.bold,
  },
  addAnotherText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  copy: { flex: 1, minWidth: 0 },
  iconBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: ICON_BADGE_SIZE,
    justifyContent: 'center',
    width: ICON_BADGE_SIZE,
  },
  iconText: {
    fontSize: typography.heading3.fontSize,
  },
  nameText: {
    ...typography.bodySmall,
    color: colors.text.inverse,
    fontWeight: fontWeights.bold,
  },
  subText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  toast: {
    alignItems: 'center',
    backgroundColor: colors.gray[900],
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
});
