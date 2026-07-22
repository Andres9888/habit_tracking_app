/**
 * DetailsChevron — quiet navigation cue on habit rows: the row body
 * opens the details page, and this makes that visible.
 */

import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '../../../../theme/iconSizes';
import { browserPalette } from '../../browserPalette';

export function DetailsChevron() {
  return (
    <ChevronRight
      color={browserPalette.textTertiary}
      size={iconSizes.small}
      strokeWidth={2.5}
    />
  );
}
