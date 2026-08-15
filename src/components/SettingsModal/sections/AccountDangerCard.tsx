/** AccountDangerCard — one card, one irreversible action.
 *
 *  Sign out and Pause used to sit here too, which was the problem: a card
 *  holding three rows of wildly different severity teaches people to swipe
 *  past red. Now the only thing wearing the destructive token pair is the only
 *  thing that actually destroys something, and it lives far below the rest of
 *  the page so it can't be hit on the way to somewhere else. */
import { Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';
import { AccountGroupCard } from '../AccountGroupCard';
import { DangerZoneNotice } from './DangerZoneNotice';

interface Props {
  isDeletingAccount: boolean;
  needsIdentityCleanup: boolean;
  onDeleteAccount: () => void;
}

export function AccountDangerCard({
  isDeletingAccount,
  needsIdentityCleanup,
  onDeleteAccount,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <AccountGroupCard>
      <SettingsRow
        icon={
          <Trash2 color={settings.deleteAccount.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.deleteAccount.bg}
        label={
          isDeletingAccount
            ? 'Deleting account…'
            : needsIdentityCleanup
              ? 'Finish deleting account'
              : 'Delete account'
        }
        labelColor={settings.deleteAccount.icon}
        subtitle={
          needsIdentityCleanup
            ? 'Your data is gone — remove your sign-in profile'
            : 'Permanently removes all your data'
        }
        type='navigation'
        onPress={isDeletingAccount ? undefined : onDeleteAccount}
      />
      <DangerZoneNotice />
    </AccountGroupCard>
  );
}
