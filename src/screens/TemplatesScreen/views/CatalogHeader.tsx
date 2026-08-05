/**
 * CatalogHeader — the Habit Browser header ("Habit Browser Final" design):
 * the serif "Habit library" title and a circular close button.
 *
 * The library is presented as a full-screen modal and is its own root, so a
 * back chevron would be a second control for the same dismiss action. One
 * close affordance only.
 */

import { ScreenHeader } from '../../../components/ScreenHeader';
import { ModalCloseButton } from '../../../components/ui/ModalCloseButton';
import { useBrowserPalette } from '../browserPalette';

interface CatalogHeaderProps {
  onClose: () => void;
}

export function CatalogHeader({ onClose }: CatalogHeaderProps) {
  const palette = useBrowserPalette();

  return (
    <ScreenHeader
      leftAction={null}
      rightAction={
        <ModalCloseButton
          label='Close habit library'
          testID='close-habit-library'
          onClose={onClose}
        />
      }
      title='Habit library'
      titleStyle={{ color: palette.textPrimary }}
    />
  );
}
