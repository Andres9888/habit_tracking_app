import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';

export const visualStyles = StyleSheet.create({
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: -spacing.xs,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: -2,
    width: 36,
  },
  chainLinkInner: {
    borderRadius: borderRadius.button,
    height: 36,
    width: 20,
  },
  strengthBar: {
    borderRadius: borderRadius.chip,
    height: 32,
  },
  strengthContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    width: '100%',
  },
  strengthLabel: {
    ...typography.caption,
  },
  strengthLabelActive: {
    fontWeight: fontWeights.bold,
  },
  strengthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  templateEmoji: {
    fontSize: typography.heading1.fontSize,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    justifyContent: 'center',
    width: 280,
  },
  templateItem: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    height: 56,
    justifyContent: 'center',
    ...shadows.card,
    width: 56,
  },
});
