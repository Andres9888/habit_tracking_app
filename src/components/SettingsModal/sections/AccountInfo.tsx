import React from 'react';
import { LogOut, Trash2, User } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  email?: string;
  highContrast: boolean;
  isLoading: boolean;
  isDeletingAccount?: boolean;
  onSignOut: () => void;
  onDeleteAccount?: () => void;
}

export function AccountInfo({
  email,
  highContrast,
  isLoading,
  isDeletingAccount = false,
  onSignOut,
  onDeleteAccount,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='Account'>
      {email ? (
        <SettingsRow
          highContrastMode={highContrast}
          icon={<User color={settings.user.icon} size={16} />}
          iconBackgroundColor={settings.user.bg}
          label={email}
          type='info'
        />
      ) : null}
      <SettingsRow
        hapticStyle='heavy'
        highContrastMode={highContrast}
        icon={<LogOut color={settings.signOut.icon} size={16} />}
        iconBackgroundColor={settings.signOut.bg}
        label={isLoading ? 'Signing out...' : 'Sign Out'}
        type='navigation'
        onPress={onSignOut}
      />
      {onDeleteAccount ? (
        <SettingsRow
          hapticStyle='heavy'
          highContrastMode={highContrast}
          icon={<Trash2 color={settings.deleteAccount.icon} size={16} />}
          iconBackgroundColor={settings.deleteAccount.bg}
          label={isDeletingAccount ? 'Deleting account...' : 'Delete Account'}
          showBorder={false}
          type='navigation'
          onPress={onDeleteAccount}
        />
      ) : null}
    </SettingsSection>
  );
}
