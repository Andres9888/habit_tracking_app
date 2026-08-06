/** ThemeSettingsRow — collapsible Theme row: value + chevron → radio list */
import { Moon } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { DarkModePreference } from '../../../convex/settings/types';
import { DisclosureRow } from './components/DisclosureRow';
import { ThemeOptionsList } from './components/ThemeOptionsList';
import { useThemeColors } from '../../theme/ThemeContext';

interface Props {
  selected: DarkModePreference;
  onSelect: (preference: DarkModePreference) => void | Promise<void>;
}

const VALUE_LABEL: Record<DarkModePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export function ThemeSettingsRow({ selected, onSelect }: Props) {
  const { settings } = useThemeColors();

  return (
    <DisclosureRow
      icon={<Moon color={settings.checkbox.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.checkbox.bg}
      label='Theme'
      valueLabel={VALUE_LABEL[selected]}
    >
      <ThemeOptionsList
        selected={selected}
        onSelect={(v) => void onSelect(v)}
      />
    </DisclosureRow>
  );
}
