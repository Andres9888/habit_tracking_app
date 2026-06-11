import { BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface HabitDataRowsProps {
  highContrastMode: boolean;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
}

export function HabitDataRows({
  highContrastMode: hc,
  archivedHabitsCount,
  onOpenArchivedHabits,
  onExportHabitsData,
}: HabitDataRowsProps) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <>
      <SettingsRow
        badge={archivedHabitsCount}
        highContrastMode={hc}
        icon={<BookOpen color={settings.archive.icon} size={iconSize} />}
        iconBackgroundColor={settings.archive.bg}
        label='Archived habits'
        subtitle='View and restore hidden habits'
        type='navigation'
        onPress={onOpenArchivedHabits}
      />
      <SettingsRow
        highContrastMode={hc}
        icon={<Download color={settings.export.icon} size={iconSize} />}
        iconBackgroundColor={settings.export.bg}
        label='Export habits data'
        showBorder={false}
        subtitle='Download as CSV or JSON'
        type='navigation'
        onPress={() => void onExportHabitsData?.()}
      />
    </>
  );
}
