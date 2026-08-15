/** HabitDataRows — analytics, archive, and export entry points. */
import { BarChart3, BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useSettingsToast } from '../SettingsToast';
import { useThemeColors } from '../../../theme/ThemeContext';

interface HabitDataRowsProps {
  archivedHabitsCount?: number;
  onOpenAnalytics: () => void;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
}

export function HabitDataRows({
  archivedHabitsCount,
  onOpenAnalytics,
  onOpenArchivedHabits,
  onExportHabitsData,
}: HabitDataRowsProps) {
  const { settings } = useThemeColors();
  const { showToast } = useSettingsToast();

  // Only claim the export started if there is actually a handler to run.
  const handleExport = () => {
    if (!onExportHabitsData) return;
    void onExportHabitsData();
    showToast('Export started…');
  };

  return (
    <>
      <SettingsRow
        icon={<BarChart3 color={settings.export.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.export.bg}
        label='Analytics'
        subtitle='Strength, trends, and weekly insights'
        type='navigation'
        onPress={onOpenAnalytics}
      />
      <SettingsRow
        badge={archivedHabitsCount}
        icon={<BookOpen color={settings.archive.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.archive.bg}
        label='Archived habits'
        subtitle='View and restore hidden habits'
        type='navigation'
        onPress={onOpenArchivedHabits}
      />
      <SettingsRow
        icon={<Download color={settings.export.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.export.bg}
        label='Export my data'
        subtitle='Download habits as CSV or JSON'
        type='navigation'
        onPress={handleExport}
      />
    </>
  );
}
