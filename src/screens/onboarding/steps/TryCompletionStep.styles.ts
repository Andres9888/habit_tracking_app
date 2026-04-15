import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  chainText: {
    ...typography.heading3,
    textAlign: 'center',
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
  habitCard: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    gap: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    width: '100%',
    ...shadows.card,
  },
  habitEmoji: {
    fontSize: 48,
  },
  habitName: {
    ...typography.heading2,
    textAlign: 'center',
  },
});
