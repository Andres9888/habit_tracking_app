/** Static styles for DetailCompleteButton. */
import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

/** Button-only dimensions with no shared token equivalent. */
export const INDICATOR_SIZE = 24;

export const styles = StyleSheet.create({
  burstRing: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: INDICATOR_SIZE,
    position: 'absolute',
    width: INDICATOR_SIZE,
  },
  container: {
    borderRadius: borderRadius.large,
    gap: spacing.sm + spacing.xs,
    marginHorizontal: spacing.base + spacing.xs,
    marginTop: spacing.base,
    paddingVertical: spacing.base - 2,
    // Layered depth so the bar reads as a raised, pressable button.
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
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
