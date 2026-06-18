/** SettingsHeader — centered serif title + circular close, matching the Account screen */
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import type { SettingsColors } from './types';

interface SettingsHeaderProps {
  colors: SettingsColors;
  onClose: () => void;
}

export function SettingsHeader({ onClose }: SettingsHeaderProps) {
  return (
    <ScreenHeader
      leftAction={null}
      rightAction={
        <ModalCloseButton label='Close settings' onClose={onClose} />
      }
      title='Settings'
    />
  );
}
