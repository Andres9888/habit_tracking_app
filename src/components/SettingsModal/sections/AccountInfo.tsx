import React from 'react';
import { LogOut, Trash2, User } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

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
  return (
    <SettingsSection highContrastMode={highContrast} title='Account'>
      {email ? (
        <SettingsRow
          highContrastMode={highContrast}
          icon={<User color='#6366f1' size={16} />}
          iconBackgroundColor='#e0e7ff'
          label={email}
          type='info'
        />
      ) : null}
      <SettingsRow
        highContrastMode={highContrast}
        icon={<LogOut color='#ef4444' size={16} />}
        iconBackgroundColor='#fecaca'
        label={isLoading ? 'Signing out...' : 'Sign Out'}
        type='navigation'
        onPress={onSignOut}
      />
      {onDeleteAccount ? (
        <SettingsRow
          highContrastMode={highContrast}
          icon={<Trash2 color='#dc2626' size={16} />}
          iconBackgroundColor='#fecaca'
          label={isDeletingAccount ? 'Deleting account...' : 'Delete Account'}
          showBorder={false}
          type='navigation'
          onPress={onDeleteAccount}
        />
      ) : null}
    </SettingsSection>
  );
}
