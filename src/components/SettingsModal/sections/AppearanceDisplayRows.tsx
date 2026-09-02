/** AppearanceDisplayRows — compact cards toggle */
import { Rows3 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
}

export function AppearanceDisplayRows(p: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsRow
      icon={<Rows3 color={settings.compact.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.compact.bg}
      label='Compact habit cards'
      type='toggle'
      value={p.compactView}
      onToggle={(v) => void p.onChangeCompactView(v)}
    />
  );
}
