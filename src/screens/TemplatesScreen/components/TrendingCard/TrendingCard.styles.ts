/**
 * Styles for TrendingCard and AddButton components
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';

export const CARD_WIDTH = 165;
const ICON_BOX = 48;
const ADD_BUTTON_SIZE = 44;

export const s = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.border,
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    padding: spacing.base,
    width: CARD_WIDTH,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: ICON_BOX,
    justifyContent: 'center',
    width: ICON_BOX,
  },
  iconEmoji: { fontSize: 28 },
  name: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: fontWeights.bold,
    lineHeight: 14 * 1.3,
    marginTop: spacing.md,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  frequency: {
    color: colors.text.tertiary,
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
  },
  scienceBadge: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  scienceText: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: fontWeights.semibold,
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto' as unknown as number,
    paddingTop: spacing.md,
  },
  popularityText: { color: colors.primary[600], fontSize: 13, fontWeight: fontWeights.medium },
});

export const addButtonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: ADD_BUTTON_SIZE,
    justifyContent: 'center',
    width: ADD_BUTTON_SIZE,
  },
  default: {
    ...shadows.card,
    backgroundColor: colors.primary[600],
  },
  imported: {
    backgroundColor: colors.light.surfaceMuted,
  },
});
