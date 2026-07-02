/** AppearanceSection — Look & Feel: calendar-look entry, theme, growth, density */
import { CalendarDays } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { GrowthIconsSettingsRow } from '../GrowthIconsSettingsRow';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { ThemeSettingsRow } from '../ThemeSettingsRow';
import { AppearanceDisplayRows } from './AppearanceDisplayRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AppearanceSectionProps } from './AppearanceSection.types';

export function AppearanceSection(p: AppearanceSectionProps) {
  const { settings } = useThemeColors();
  return (
    <SettingsSection icon={p.icon} title='Look & Feel'>
      <SettingsRow
        icon={
          <CalendarDays
            color={settings.dayMarker.icon}
            size={iconSizes.small}
          />
        }
        iconBackgroundColor={settings.dayMarker.bg}
        label='Calendar look'
        subtitle='Day shape, fill, chain style & preview'
        type='navigation'
        onPress={p.onOpenCalendarLook}
      />
      <ThemeSettingsRow
        selected={p.darkModePreference}
        onSelect={p.onChangeDarkModePreference}
      />
      <GrowthIconsSettingsRow />
      <AppearanceDisplayRows
        compactView={p.compactView}
        onChangeCompactView={p.onChangeCompactView}
      />
    </SettingsSection>
  );
}
