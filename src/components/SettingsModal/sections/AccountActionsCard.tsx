/** AccountActionsCard — Change photo, Email, Restore purchases group */
import { Image as ImageIcon, Mail, RotateCcw } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';
import { AccountGroupCard } from '../AccountGroupCard';
import { useChangeProfileImage } from '../useChangeProfileImage';
import { useProfileDisplayName } from '../useProfileDisplayName';
import { useRestorePurchases } from '../useRestorePurchases';

export function AccountActionsCard() {
  const { settings } = useThemeColors();
  const { email } = useProfileDisplayName();
  const { openPhotoPicker } = useChangeProfileImage();
  const { isRestoring, handleRestore } = useRestorePurchases();
  const size = iconSizes.small;

  return (
    <AccountGroupCard title='Account'>
      <SettingsRow
        icon={<ImageIcon color={settings.user.icon} size={size} />}
        iconBackgroundColor={settings.user.bg}
        label='Change photo'
        type='navigation'
        onPress={openPhotoPicker}
      />
      <SettingsRow
        icon={<Mail color={settings.user.icon} size={size} />}
        iconBackgroundColor={settings.user.bg}
        label='Email'
        subtitle='Managed by your sign-in provider'
        type='info'
        value={email ?? '—'}
      />
      <SettingsRow
        icon={<RotateCcw color={settings.neutral.icon} size={size} />}
        iconBackgroundColor={settings.neutral.bg}
        label={isRestoring ? 'Restoring…' : 'Restore purchases'}
        type='navigation'
        onPress={isRestoring ? undefined : handleRestore}
      />
    </AccountGroupCard>
  );
}
