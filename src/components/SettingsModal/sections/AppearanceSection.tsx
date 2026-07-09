/** AppearanceSection — Look & Feel: calendar-look entry, theme, growth, density */
import { CalendarDays } from 'lucide-react-native';
import { View } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';
import { CalendarLookMiniPreview } from '../CalendarLookMiniPreview';
import { GrowthIconsSettingsRow } from '../GrowthIconsSettingsRow';
import { getSettingsRowColors, SettingsRow } from '../SettingsRow';
import { RowChevron } from '../SettingsRow/components/RowChevron';
import { SettingsSection } from '../SettingsSection';
import { ThemeSettingsRow } from '../ThemeSettingsRow';
import { AppearanceDisplayRows } from './AppearanceDisplayRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AppearanceSectionProps } from './AppearanceSection.types';

export function AppearanceSection(p: AppearanceSectionProps) {
  const { settings, isDark } = useThemeColors();
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
        rightAccessory={
          <View className='flex-row items-center gap-2'>
            <CalendarLookMiniPreview />
            <RowChevron color={getSettingsRowColors(isDark).chevron} />
          </View>
        }
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
