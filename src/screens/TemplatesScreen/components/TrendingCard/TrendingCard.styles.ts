/**
 * Styles for TrendingCard and AddButton components
 */

import { StyleSheet } from 'react-native';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../../theme/typography';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';

export const CARD_WIDTH = 180;
const ICON_BOX = 48;
const ADD_BUTTON_SIZE = 44;

export const s = StyleSheet.create({
  card: {
    ...shadows.card,
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
    ...typography.bodySmall,
    fontWeight: fontWeights.bold,
    marginTop: spacing.md,
  },
  description: {
    ...typography.caption,
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  frequency: {
    ...typography.caption,
    fontFamily: fontFamilies.monospace,
  },
  scienceBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  scienceText: {
    ...typography.tabBar,
    fontWeight: fontWeights.semibold,
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto' as unknown as number,
    paddingTop: spacing.md,
  },
  popularityText: { ...typography.caption },
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
  },
  imported: {},
});
