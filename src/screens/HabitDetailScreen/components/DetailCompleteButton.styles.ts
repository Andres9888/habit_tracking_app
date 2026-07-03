/** Static styles for DetailCompleteButton. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

export const BAR_HEIGHT = 46;

export const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    height: BAR_HEIGHT,
    shadowOffset: { height: 4, width: 0 },
    shadowRadius: 14,
  },
});
