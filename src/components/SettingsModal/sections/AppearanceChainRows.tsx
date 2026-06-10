/** AppearanceChainRows — gradient streak fill + streak connection toggles */
import { Droplets, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrastMode: boolean;
  showGradientFill: boolean;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  showStreakConnections: boolean;
  onChangeShowStreakConnections: (value: boolean) => void | Promise<void>;
}

export function AppearanceChainRows(p: Props) {
  const { settings } = useThemeColors();

  return (
    <>
      <SettingsRow
        highContrastMode={p.highContrastMode}
        icon={
          <Droplets color={settings.gradient.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.gradient.bg}
        label='Gradient streak fill'
        subtitle='Color fills active streak cells'
        type='toggle'
        value={p.showGradientFill}
        onToggle={(v) => void p.onChangeShowGradientFill(v)}
      />
      <SettingsRow
        highContrastMode={p.highContrastMode}
        icon={<Link2 color={settings.checkbox.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.checkbox.bg}
        label='Streak connections'
        subtitle='Link completed days into a chain on the calendar'
        type='toggle'
        value={p.showStreakConnections}
        onToggle={(v) => void p.onChangeShowStreakConnections(v)}
      />
    </>
  );
}
