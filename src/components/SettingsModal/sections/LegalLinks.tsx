
import React from 'react';

import { ExternalLink } from 'lucide-react-native';

import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';

interface Props {
  highContrast: boolean;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function LegalLinks({ highContrast, onPrivacy, onTerms }: Props) {
  return (
    <SettingsSection highContrastMode={highContrast} title='Legal'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color='#78716c' size={16} />}
        iconBackgroundColor='#e7e5e4'
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color='#78716c' size={16} />}
        iconBackgroundColor='#e7e5e4'
        label='Terms of Service'
        showBorder={false}
        type='navigation'
        onPress={onTerms}
      />
    </SettingsSection>
  );
}
