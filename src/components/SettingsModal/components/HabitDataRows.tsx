/** HabitDataRows — archive + export entry points.
 *  Both live in Habits now (mock decision 3B: 7 cards → 6 — a lone navigational
 *  row didn't earn its own Privacy & Security card). */
import { useState } from 'react';
import { BookOpen, Download } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useSettingsToast } from '../SettingsToast';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ExportFormatSheet, type ExportFormat } from './ExportFormatSheet';

interface HabitDataRowsProps {
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: (format: ExportFormat) => void | Promise<void>;
}

export function HabitDataRows({
  archivedHabitsCount,
  onOpenArchivedHabits,
  onExportHabitsData,
}: HabitDataRowsProps) {
  const { settings } = useThemeColors();
  const { showToast } = useSettingsToast();
  const [sheetVisible, setSheetVisible] = useState(false);

  // The toast used to fire the instant the row was tapped — before the format
  // was chosen, and it stayed up even if the user cancelled. It now waits for a
  // real choice and names the format it is actually writing.
  const handleSelect = (format: ExportFormat) => {
    if (!onExportHabitsData) return;
    void onExportHabitsData(format);
    showToast(`Exporting as ${format.toUpperCase()}…`);
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
        onPress={
          onExportHabitsData ? () => setSheetVisible(true) : undefined
        }
      />
      <ExportFormatSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
