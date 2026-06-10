/** AppearanceDisplayRows — compact cards + high contrast toggles */
import { Contrast, Rows3 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrastMode: boolean;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  highContrastEnabled: boolean;
  onChangeHighContrast: (value: boolean) => void | Promise<void>;
}

export function AppearanceDisplayRows(p: Props) {
  const { settings } = useThemeColors();

  return (
    <>
      <SettingsRow
        highContrastMode={p.highContrastMode}
        icon={<Rows3 color={settings.compact.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.compact.bg}
        label='Compact habit cards'
        subtitle='Fit more on screen'
        type='toggle'
        value={p.compactView}
        onToggle={(v) => void p.onChangeCompactView(v)}
      />
      <SettingsRow
        highContrastMode={p.highContrastMode}
        icon={
          <Contrast color={settings.compact.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.compact.bg}
        label='High contrast'
        showBorder={false}
        subtitle='Stronger borders and text'
        type='toggle'
        value={p.highContrastEnabled}
        onToggle={(v) => void p.onChangeHighContrast(v)}
      />
    </>
  );
}
