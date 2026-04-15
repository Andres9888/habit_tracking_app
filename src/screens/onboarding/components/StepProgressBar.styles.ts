import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  bar: {
    borderRadius: borderRadius.xs,
    flex: 1,
    height: 4,
  },
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
});
