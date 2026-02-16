import React from 'react';
import { LogOut, Trash2, User } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { iconBg } from '../iconColors';
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
  const { isDark } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='Account'>
      {email ? (
        <SettingsRow
          highContrastMode={highContrast}
          icon={<User color={isDark ? '#818cf8' : '#6366f1'} size={16} />}
          iconBackgroundColor={iconBg('#e0e7ff', isDark)}
          label={email}
          type='info'
        />
      ) : null}
      <SettingsRow
        highContrastMode={highContrast}
        icon={<LogOut color={isDark ? '#f87171' : '#ef4444'} size={16} />}
        iconBackgroundColor={iconBg('#fecaca', isDark)}
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
