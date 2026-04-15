import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  buttonContainer: {
    paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  habitChip: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    ...shadows.subtle,
  },
  habitChipEmoji: {
    fontSize: 28,
  },
  habitChipName: {
    ...typography.heading3,
    flexShrink: 1,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    ...typography.displayLarge,
    textAlign: 'center',
  },
});
