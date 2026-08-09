import { borderRadius } from '../../../theme/spacing';
import type { InsightPalette } from '../insightPalette';

export function noteCardFrame(
  variant: 'dashed' | 'onBand',
  palette: InsightPalette
) {
  if (variant === 'onBand') {
    return {
      backgroundColor: palette.card,
      borderColor: palette.bandHairline,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
    };
  }
  return {
    borderColor: palette.cardBorder,
    borderRadius: borderRadius.large,
    borderStyle: 'dashed' as const,
    borderWidth: 1.5,
  };
}
