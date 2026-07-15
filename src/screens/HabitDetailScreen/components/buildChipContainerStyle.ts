/** Container style for GoalPresetChip — extracted to keep the component lean. */
import type { ViewStyle } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';

const CHIP_BORDER_WIDTH = 1.5;
const DISABLED_OPACITY = 0.45;

export function buildChipContainerStyle(
  isGrid: boolean,
  disabled: boolean
): ViewStyle {
  return {
    alignItems: 'center',
    borderRadius: isGrid ? borderRadius.medium : borderRadius.full,
    borderWidth: CHIP_BORDER_WIDTH,
    opacity: disabled ? DISABLED_OPACITY : 1,
    paddingHorizontal: isGrid ? spacing.sm : spacing.base,
    paddingVertical: isGrid ? spacing.sm + 2 : spacing.sm,
    width: isGrid ? '100%' : undefined,
  };
}
