import React from 'react';
import { ExternalLink } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { t } from '@/i18n';

interface Props {
  highContrast: boolean;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function LegalLinks({ highContrast, onPrivacy, onTerms }: Props) {
  return (
    <SettingsSection highContrastMode={highContrast} title={t('settings.legal')}>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color='#78716c' size={16} />}
        iconBackgroundColor='#e7e5e4'
        label={t('settings.privacyPolicy')}
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color='#78716c' size={16} />}
        iconBackgroundColor='#e7e5e4'
        label={t('settings.termsOfService')}
        showBorder={false}
        type='navigation'
        onPress={onTerms}
      />
    </SettingsSection>
  );
}
