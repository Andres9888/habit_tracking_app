import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export const libraryHeroStyles = StyleSheet.create({
  hero: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    gap: spacing.md,
    overflow: 'hidden',
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
    position: 'relative',
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    paddingRight: spacing['2xl'],
  },
  title: {
    ...typography.heading1,
    fontSize: 26,
    lineHeight: 33,
    paddingRight: spacing['2xl'],
  },
});
