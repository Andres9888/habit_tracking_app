/** Static styles for DetailCompleteButton — outlined bar + hero band block. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';

export const BAR_HEIGHT = 46;
/** Design: 18px vertical padding on a 17px line — reads as a 56pt block. */
export const BAND_BAR_HEIGHT = 56;
export const WELL_SIZE = 30;

export const styles = StyleSheet.create({
  bandContainer: {
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    height: BAND_BAR_HEIGHT,
    paddingHorizontal: spacing.md,
  },
  bandLabel: {
    fontSize: 17,
    fontWeight: fontWeights.bold,
  },
  container: {
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    height: BAR_HEIGHT,
    paddingHorizontal: spacing.sm,
  },
  label: {
    flex: 1,
    fontWeight: fontWeights.semibold,
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
