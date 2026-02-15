
import React from 'react';

import { LogOut, User } from 'lucide-react-native';

import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';

interface Props {
  email?: string;
  highContrast: boolean;
  isLoading: boolean;
  onSignOut: () => void;
}

export function AccountInfo({
  email,
  highContrast,
  isLoading,
  onSignOut,
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
        showBorder={false}
        type='navigation'
        onPress={onSignOut}
      />
    </SettingsSection>
  );
}
