/**
 * Styles for TrendingCard and AddButton components
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { borderRadius, shadows } from '../../../../theme/spacing';

export const CARD_WIDTH = 165;
const ICON_BOX = 48;
const ADD_BUTTON_SIZE = 32;

export const s = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.border,
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    padding: 16,
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
    marginTop: 12,
  },
  metaRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  frequency: {
    color: colors.text.tertiary,
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
  },
  scienceBadge: {
    backgroundColor: colors.warningLight,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scienceText: { color: colors.warning, fontSize: 10, fontWeight: fontWeights.semibold },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto' as unknown as number,
    paddingTop: 12,
  },
  popularityText: { color: colors.primary[600], fontSize: 13, fontWeight: fontWeights.medium },
});

export const addButtonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: ADD_BUTTON_SIZE / 2,
    height: ADD_BUTTON_SIZE,
    justifyContent: 'center',
    width: ADD_BUTTON_SIZE,
  },
  default: {
    backgroundColor: colors.primary[600],
    elevation: 3,
    shadowColor: 'rgba(5,150,105,0.25)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  imported: {
    backgroundColor: colors.light.surfaceMuted,
  },
});
