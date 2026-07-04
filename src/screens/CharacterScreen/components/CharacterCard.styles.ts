import { StyleSheet } from 'react-native';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';

export const cardStyles = StyleSheet.create({
  card: {
    ...shadows.floatingActionButton,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'column',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});
