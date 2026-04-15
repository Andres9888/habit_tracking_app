/**
 * Styles for ActionButtons component
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontFamilies } from '../../../theme/typography';

export const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  cardButton: {
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  previewButton: {
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: '100%',
  },
  successButtonText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
});
