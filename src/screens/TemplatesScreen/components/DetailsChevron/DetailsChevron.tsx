/**
 * DetailsChevron — quiet navigation cue on habit rows: the row body
 * opens the details page, and this makes that visible.
 */

import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '../../../../theme/iconSizes';
import { useBrowserPalette } from '../../browserPalette';

export function DetailsChevron() {
  const palette = useBrowserPalette();
  return (
    <ChevronRight
      color={palette.textTertiary}
      size={iconSizes.small}
      strokeWidth={2.5}
    />
  );
}
