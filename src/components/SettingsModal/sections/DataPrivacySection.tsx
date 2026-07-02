/** DataPrivacySection — Archived habits, export, and delete account */
import { Database, Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { HabitDataRows } from '../components/HabitDataRows';
import { useThemeColors } from '../../../theme/ThemeContext';

interface DataPrivacySectionProps {
  sectionIconColor: string;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function DataPrivacySection(p: DataPrivacySectionProps) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection
      icon={<Database color={p.sectionIconColor} size={iconSizes.small} />}
      title='Data & Privacy'
    >
      <HabitDataRows
        archivedHabitsCount={p.archivedHabitsCount}
        onExportHabitsData={p.onExportHabitsData}
        onOpenArchivedHabits={p.onOpenArchivedHabits}
      />
      <SettingsRow
        icon={
          <Trash2 color={settings.deleteAccount.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.deleteAccount.bg}
        label={p.isDeletingAccount ? 'Deleting account…' : 'Delete account'}
        type='navigation'
        onPress={p.isDeletingAccount ? undefined : p.onDeleteAccount}
      />
    </SettingsSection>
  );
}
