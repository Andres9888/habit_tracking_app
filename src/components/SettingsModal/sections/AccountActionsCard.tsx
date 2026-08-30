/** AccountActionsCard — Name + Email + Restore purchases group.
 *  Photo editing stays on the tappable avatar only — a dedicated row here
 *  duplicated that entry point. Name is editable here because the profile hero
 *  advertises "Edit name, photo & account" and, until now, only delivered the
 *  photo. */
import { useState } from 'react';
import { Mail, RotateCcw, User } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SettingsRow } from '../SettingsRow';
import { AccountGroupCard } from '../AccountGroupCard';
import { useProfileDisplayName } from '../useProfileDisplayName';
import { useRestorePurchases } from '../useRestorePurchases';
import { EditNameModal } from './EditNameModal';

export function AccountActionsCard() {
  const { settings } = useThemeColors();
  const { email, name } = useProfileDisplayName();
  const { isRestoring, handleRestore } = useRestorePurchases();
  const [editingName, setEditingName] = useState(false);
  const size = iconSizes.small;

  return (
    <AccountGroupCard title='Account'>
      <SettingsRow
        icon={<User color={settings.user.icon} size={size} />}
        iconBackgroundColor={settings.user.bg}
        label='Name'
        type='selection'
        value={name}
        onPress={() => setEditingName(true)}
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
      <EditNameModal
        currentName={name}
        visible={editingName}
        onClose={() => setEditingName(false)}
      />
    </AccountGroupCard>
  );
}
