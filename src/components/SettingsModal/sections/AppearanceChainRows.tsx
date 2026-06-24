/** AppearanceChainRows — gradient streak fill + streak connection toggles */
import { Droplets, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
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
        icon={
          <Droplets color={settings.gradient.icon} size={iconSizes.small} />
        }
        help={{
          title: 'Gradient streak fill',
          body: 'Active streak cells on your calendar fill with a soft color gradient, so longer runs look richer and more rewarding.',
        }}
        iconBackgroundColor={settings.gradient.bg}
        label='Gradient streak fill'
        subtitle='Color fills active streak cells'
        type='toggle'
        value={p.showGradientFill}
        onToggle={(v) => void p.onChangeShowGradientFill(v)}
      />
      <SettingsRow
        icon={<Link2 color={settings.checkbox.icon} size={iconSizes.small} />}
        help={{
          title: 'Streak connections',
          body: 'Completed days link together into a visible chain across your calendar, instead of showing as separate marks.',
        }}
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
