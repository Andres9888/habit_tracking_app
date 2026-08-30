/** HabitDataRows — archive + export entry points.
 *  Both live in Data & Privacy now (Quiet Configuration Index §5). */
import { BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
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

  // No toast here: the downstream flow asks the user to pick CSV or JSON and
  // can be cancelled — claiming "Export started…" before any of that is a lie.
  const handleExport = () => {
    if (!onExportHabitsData) return;
    void onExportHabitsData();
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
