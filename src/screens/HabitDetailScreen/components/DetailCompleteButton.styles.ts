/** Static styles for DetailCompleteButton — C1 "Settled" anatomy. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

export const BAR_HEIGHT = 46;
export const WELL_SIZE = 30;

export const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    height: BAR_HEIGHT,
    paddingHorizontal: spacing.sm,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
  well: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: WELL_SIZE,
    justifyContent: 'center',
    width: WELL_SIZE,
  },
  // Trailing spacer mirroring the well so the label stays optically centered.
  wellBalance: {
    width: WELL_SIZE,
  },
});
