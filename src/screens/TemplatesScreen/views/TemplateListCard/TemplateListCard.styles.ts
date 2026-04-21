import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.base,
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 18,
  },
  iconText: {
    fontSize: 22,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  matchRow: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  matchText: {
    ...typography.caption,
    fontWeight: '700',
  },
  title: {
    ...typography.heading3,
    fontSize: 18,
    lineHeight: 22,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
});
