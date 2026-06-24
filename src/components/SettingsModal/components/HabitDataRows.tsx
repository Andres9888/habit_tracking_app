import { BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface HabitDataRowsProps {
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  /** Show a divider below the Export row (set true when another row follows) */
  showLastBorder?: boolean;
}

export function HabitDataRows({
  archivedHabitsCount,
  onOpenArchivedHabits,
  onExportHabitsData,
  showLastBorder = false,
}: HabitDataRowsProps) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <>
      <SettingsRow
        badge={archivedHabitsCount}
        icon={<BookOpen color={settings.archive.icon} size={iconSize} />}
        iconBackgroundColor={settings.archive.bg}
        label='Archived habits'
        subtitle='View and restore hidden habits'
        type='navigation'
        onPress={onOpenArchivedHabits}
      />
      <SettingsRow
        icon={<Download color={settings.export.icon} size={iconSize} />}
        iconBackgroundColor={settings.export.bg}
        label='Export habits data'
        showBorder={showLastBorder}
        subtitle='Download as CSV or JSON'
        type='navigation'
        onPress={() => void onExportHabitsData?.()}
      />
    </>
  );
}
