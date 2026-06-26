/** Static styles for DetailCompleteButton. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

/** Button-only dimensions with no shared token equivalent. */
export const INDICATOR_SIZE = 24;

export const styles = StyleSheet.create({
  container: {
    // Fills the StickyCompleteBar capsule (its sole consumer owns positioning now).
    borderRadius: borderRadius.large,
    gap: spacing.sm + spacing.xs,
    paddingVertical: spacing.base - 2,
  },
  filledCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: INDICATOR_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    width: INDICATOR_SIZE,
  },
  indicatorWrap: {
    alignItems: 'center',
    height: INDICATOR_SIZE,
    justifyContent: 'center',
    width: INDICATOR_SIZE,
  },
  ring: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: INDICATOR_SIZE,
    position: 'absolute',
    width: INDICATOR_SIZE,
  },
});
