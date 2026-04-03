/**
 * Tips box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

export const tipsStyles = StyleSheet.create({
  tipIconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  tipItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tipNumber: {
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: '700',
  },
  tipsBox: {
    backgroundColor: colors.warningLight,
    borderColor: colors.streak[100],
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: spacing.lg,
    marginTop: spacing.base,
    padding: spacing.lg,
  },
  tipsDivider: {
    backgroundColor: colors.streak[100],
    height: 1,
    marginBottom: 12,
  },
  tipsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tipsLabel: {
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tipText: {
    color: colors.warning,
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
