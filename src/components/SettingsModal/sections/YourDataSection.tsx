/** YourDataSection — archived habits, export, delete account */
import { BookOpen, Download, Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: () => void | Promise<void>;
  onDeleteAccount: () => void;
  isDeletingAccount: boolean;
}

export function YourDataSection(p: Props) {
  const { colors: themeColors, settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsSection title='Your Data'>
      <SettingsRow
        badge={p.archivedHabitsCount}
        icon={<BookOpen color={settings.archive.icon} size={iconSize} />}
        iconBackgroundColor={settings.archive.bg}
        label='Archived habits'
        subtitle='Resting, not deleted'
        type='navigation'
        onPress={p.onOpenArchivedHabits}
      />
      <SettingsRow
        icon={<Download color={settings.export.icon} size={iconSize} />}
        iconBackgroundColor={settings.export.bg}
        label='Export habits data'
        subtitle='JSON copy of habits & history'
        type='navigation'
        onPress={() => void p.onExportHabitsData?.()}
      />
      <SettingsRow
        icon={<Trash2 color={settings.deleteAccount.icon} size={iconSize} />}
        iconBackgroundColor={settings.deleteAccount.bg}
        label={p.isDeletingAccount ? 'Deleting account…' : 'Delete account'}
        labelColor={themeColors.status.error}
        subtitle='Permanent — export first if you need a copy'
        type='navigation'
        onPress={p.isDeletingAccount ? undefined : p.onDeleteAccount}
      />
    </SettingsSection>
  );
}
