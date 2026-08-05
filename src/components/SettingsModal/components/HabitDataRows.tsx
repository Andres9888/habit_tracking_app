/** HabitDataRows — archive + export entry points.
 *  Both live in Habits now (mock decision 3B: 7 cards → 6 — a lone navigational
 *  row didn't earn its own Privacy & Security card). */
import { BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useSettingsToast } from '../SettingsToast';
import { useThemeColors } from '../../../theme/ThemeContext';

interface HabitDataRowsProps {
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
}

export function HabitDataRows({
  archivedHabitsCount,
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
