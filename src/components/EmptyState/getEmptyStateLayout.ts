import { spacing } from '../../theme/spacing';
import type { SCALE_CONFIG } from './constants';

type ScaleConfig = (typeof SCALE_CONFIG)[keyof typeof SCALE_CONFIG];

export function getEmptyStateLayout(
  isCompact: boolean,
  scaleConfig: ScaleConfig
) {
  return {
    descriptionMarginBottom: isCompact ? 0 : spacing.base,
    iconMarginBottom: isCompact ? spacing.md : scaleConfig.iconMarginBottom,
    iconSize: isCompact ? 34 : scaleConfig.iconSize,
    paddingY: isCompact ? spacing.lg : scaleConfig.paddingY,
    titleMarginBottom: isCompact ? spacing.xs : spacing.sm,
  };
}
