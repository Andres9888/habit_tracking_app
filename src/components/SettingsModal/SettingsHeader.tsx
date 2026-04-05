/** SettingsHeader - Shared screen header styling for settings */
import { View } from 'react-native';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { ScreenHeader } from '../ScreenHeader';
import type { SettingsColors } from './types';

interface SettingsHeaderProps {
  colors: SettingsColors;
  onClose: () => void;
}

export function SettingsHeader({ colors, onClose }: SettingsHeaderProps) {
  return (
    <View style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        leftAction={null}
        rightAction={<ModalCloseButton label='Close settings' onClose={onClose} />}
        title='Settings'
      />
    </View>
  );
}
