import { StyleSheet } from 'react-native';
import { componentSpacing, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: componentSpacing.button.height,
    minWidth: componentSpacing.button.height,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  skipText: {
    fontWeight: '500',
    ...typography.bodySmall,
  },
  stepContainer: {
    flex: 1,
  },
  topBar: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
});
