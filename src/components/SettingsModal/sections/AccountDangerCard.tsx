/** AccountDangerCard — quiet Sign Out row paired with destructive Delete account */
import { LogOut, Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';
import { AccountGroupCard } from '../AccountGroupCard';

interface Props {
  isSigningOut: boolean;
  onSignOut: () => void;
  isDeletingAccount: boolean;
  onDeleteAccount: () => void;
}

export function AccountDangerCard({
  isSigningOut,
  onSignOut,
  isDeletingAccount,
  onDeleteAccount,
}: Props) {
  const { settings } = useThemeColors();
  const size = iconSizes.small;

  return (
    <AccountGroupCard>
      <SettingsRow
        icon={<LogOut color={settings.neutral.icon} size={size} />}
        iconBackgroundColor={settings.neutral.bg}
        label={isSigningOut ? 'Signing out…' : 'Sign Out'}
        type='navigation'
        onPress={isSigningOut ? undefined : onSignOut}
      />
      <SettingsRow
        icon={<Trash2 color={settings.deleteAccount.icon} size={size} />}
        iconBackgroundColor={settings.deleteAccount.bg}
        label={isDeletingAccount ? 'Deleting account…' : 'Delete account'}
        type='navigation'
        onPress={isDeletingAccount ? undefined : onDeleteAccount}
      />
    </AccountGroupCard>
  );
}
