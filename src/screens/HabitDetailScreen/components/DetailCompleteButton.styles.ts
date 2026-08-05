/** Static geometry for the tactile primary action. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

export const BAR_HEIGHT = 56;
export const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    height: BAR_HEIGHT,
    paddingHorizontal: spacing.base,
    shadowColor: '#065F46',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
});
