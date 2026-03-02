import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  iconButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  left: { minWidth: 40 },
  right: { alignItems: 'flex-end', minWidth: 40 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  titleCenter: {
    ...typography.heading1,
    flex: 1,
    textAlign: 'center',
  },
  titleLeft: {
    ...typography.heading1,
  },
  transparent: { backgroundColor: 'transparent' },
});
