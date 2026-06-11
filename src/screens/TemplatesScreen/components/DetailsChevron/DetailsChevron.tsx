/**
 * DetailsChevron — quiet navigation cue on habit rows: the row body
 * opens the details page, and this makes that visible.
 */

import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '../../../../theme/iconSizes';

export function DetailsChevron() {
  const { colors } = useThemeColors();

  return (
    <ChevronRight
      color={colors.text.tertiary}
      size={iconSizes.small}
      strokeWidth={2.25}
    />
  );
}
