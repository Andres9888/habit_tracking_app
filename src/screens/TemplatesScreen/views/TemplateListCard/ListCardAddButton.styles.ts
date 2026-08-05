/**
 * Styles for ListCardAddButton — compact pill (default) and the regular
 * mock-weight CTA (44px, radius 12, hard press-depth shadow).
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';

export const s = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonRegular: {
    borderRadius: 12,
    height: 44,
    minWidth: 120,
    paddingHorizontal: 18,
  },
  buttonRegularShadow: {
    elevation: 3,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  label: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  labelRegular: { fontSize: 15 },
});
