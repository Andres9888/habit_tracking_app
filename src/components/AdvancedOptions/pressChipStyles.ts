/** Calm flat chip base — uniform border, no press depth. */
import type { ViewStyle } from 'react-native';

export interface ChipColors {
  border: string;
  background: string;
}

export function chipBase(colors: ChipColors): ViewStyle {
  return {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: 14,
  };
}
