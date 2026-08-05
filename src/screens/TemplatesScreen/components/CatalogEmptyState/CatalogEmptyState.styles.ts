import { StyleSheet } from 'react-native';
import { spacing } from '../../../../theme/spacing';

export const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  wrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
  },
});
