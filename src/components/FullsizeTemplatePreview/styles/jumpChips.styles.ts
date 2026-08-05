/**
 * Sticky jump-chip row styles — Duolingo unit chips: pill buttons with a filled,
 * hard-shadowed active state; the row background is opaque so scrolled content
 * hides cleanly behind it.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const jumpChipsStyles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.light.background,
    borderBottomColor: 'rgba(45,42,38,0.08)',
    borderBottomWidth: 1,
    flexGrow: 0,
    paddingVertical: 8,
  },
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.base },
  chip: {
    alignItems: 'center',
    backgroundColor: colors.light.cardElevated,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[700],
    boxShadow: `0 2px 0 ${colors.primary[700]}`,
  },
  chipText: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  chipTextActive: { color: '#FFFFFF' },
});
