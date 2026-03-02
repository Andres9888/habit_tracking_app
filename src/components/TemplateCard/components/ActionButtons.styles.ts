/**
 * Styles for ActionButtons component
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontFamilies } from '../../../theme/typography';

export const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  cardButton: {
    borderRadius: borderRadius.medium,
    flex: 1,
    paddingVertical: spacing.md,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: '100%',
  },
  successButtonText: {
    color: '#fff',
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
});
