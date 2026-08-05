/** AccountDangerCard — the one card that holds every destructive action.
 *  Both rows carry the red token pair (settings.signOut / settings.deleteAccount)
 *  plus a red label, and nothing safe is ever mixed in beside them, so "this
 *  costs you something" reads before the words do. */
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
        icon={<LogOut color={settings.signOut.icon} size={size} />}
        iconBackgroundColor={settings.signOut.bg}
        label={isSigningOut ? 'Signing out…' : 'Sign out'}
        labelColor={settings.signOut.icon}
        type='navigation'
        onPress={isSigningOut ? undefined : onSignOut}
      />
      <SettingsRow
        icon={<Trash2 color={settings.deleteAccount.icon} size={size} />}
        iconBackgroundColor={settings.deleteAccount.bg}
        label={isDeletingAccount ? 'Deleting account…' : 'Delete account'}
        labelColor={settings.deleteAccount.icon}
        subtitle='Permanently removes all your data'
        type='navigation'
        onPress={isDeletingAccount ? undefined : onDeleteAccount}
      />
    </AccountGroupCard>
  );
}
