/** Static styles for HeaderButton. */
import { StyleSheet } from 'react-native';
import {
  borderRadius,
  componentSpacing,
  spacing,
} from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

export const s = StyleSheet.create({
  compactButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  compactCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  textButton: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    height: componentSpacing.button.height,
    paddingHorizontal: spacing.base,
  },
  textLabel: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium,
    letterSpacing: -0.2,
  },
});
