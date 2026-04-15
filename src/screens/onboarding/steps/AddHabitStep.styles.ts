import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createOwnLink: {
    ...typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.base,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  templateGrid: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  templateGridContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
});
