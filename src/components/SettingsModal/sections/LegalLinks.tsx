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
  const { colors } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='Legal'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={colors.gray[500]} size={16} />}
        iconBackgroundColor={colors.gray[200]}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={colors.gray[500]} size={16} />}
        iconBackgroundColor={colors.gray[200]}
        label='Terms of Service'
        showBorder={false}
        type='navigation'
        onPress={onTerms}
      />
    </SettingsSection>
  );
}
