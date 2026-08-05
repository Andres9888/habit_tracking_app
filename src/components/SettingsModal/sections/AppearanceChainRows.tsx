/** AppearanceChainRows — gradient streak fill toggle */
import { Droplets } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  showGradientFill: boolean;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
}

export function AppearanceChainRows(p: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsRow
      icon={<Droplets color={settings.gradient.icon} size={iconSizes.small} />}
      iconBackgroundColor={settings.gradient.bg}
      label='Gradient streak fill'
      subtitle='Color fills active streak cells'
      type='toggle'
      value={p.showGradientFill}
      onToggle={(v) => void p.onChangeShowGradientFill(v)}
    />
  );
}
