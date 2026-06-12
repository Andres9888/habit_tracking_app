/** ThemeSettingsRow — Appearance row hosting the light/dark/system picker */
import { Moon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { DarkModePreference } from '../../../convex/settings/types';
import { SettingsRow } from './SettingsRow';
import { ThemePicker } from './ThemePicker';
import { useThemeColors } from '../../theme/ThemeContext';

interface Props {
  selected: DarkModePreference;
  onSelect: (preference: DarkModePreference) => void | Promise<void>;
}

export function ThemeSettingsRow({ selected, onSelect }: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsRow
      icon={<Moon color={settings.checkbox.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.checkbox.bg}
      label='Theme'
      rightAccessory={
        <ThemePicker selected={selected} onSelect={(v) => void onSelect(v)} />
      }
      type='info'
    />
  );
}
