/** SignOutCard — routine, reversible, and on its own.
 *
 *  Signing out is not destructive: the account and every habit survive it. It
 *  used to share a card with Delete account, which lent it a severity it
 *  doesn't have and, worse, softened the row that genuinely is irreversible. */
import { LogOut } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';
import { AccountGroupCard } from '../AccountGroupCard';

interface Props {
  isSigningOut: boolean;
  onSignOut: () => void;
}

export function SignOutCard({ isSigningOut, onSignOut }: Props) {
  const { settings } = useThemeColors();

  return (
    <AccountGroupCard>
      <SettingsRow
        icon={<LogOut color={settings.signOut.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.signOut.bg}
        label={isSigningOut ? 'Signing out…' : 'Sign out'}
        labelColor={settings.signOut.icon}
        type='navigation'
        onPress={isSigningOut ? undefined : onSignOut}
      />
    </AccountGroupCard>
  );
}
