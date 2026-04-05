import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '../../theme/typography';

const FADE_WIDTH = 48;

export const styles = StyleSheet.create({
  categoriesContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryPill: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  categoryPillActive: {
    ...shadows.card,
    backgroundColor: colors.gray[900],
    shadowOpacity: 0.15,
  },
  categoryPillIcon: {
    fontSize: typography.bodySmall.fontSize,
  },
  categoryPillText: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
    marginLeft: spacing.xs,
  },
  categoryPillTextActive: {
    color: colors.text.inverse,
  },
  container: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  fadeLeft: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: FADE_WIDTH,
  },
  fadeRight: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: FADE_WIDTH,
  },
});
