import { StyleSheet } from 'react-native';
import { typography, fontWeights } from '../../../theme/typography';
import { borderRadius, spacing, componentSpacing } from '../../../theme/spacing';

export const headerButtonStyles = StyleSheet.create({
  compactButton: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
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
