import React from 'react';
import { ExternalLink } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function LegalLinks({ highContrast, onPrivacy, onTerms }: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='Legal'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={settings.legal.icon} size={16} />}
        iconBackgroundColor={settings.legal.bg}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={settings.legal.icon} size={16} />}
        iconBackgroundColor={settings.legal.bg}
        label='Terms of Service'
        showBorder={false}
        type='navigation'
        onPress={onTerms}
      />
    </SettingsSection>
  );
}
