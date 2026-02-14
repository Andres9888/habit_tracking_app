import React from 'react';
import { ExternalLink } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { iconBg } from '../iconColors';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function LegalLinks({ highContrast, onPrivacy, onTerms }: Props) {
  const { isDark } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='Legal'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={isDark ? '#a8a29e' : '#78716c'} size={16} />}
        iconBackgroundColor={iconBg('#e7e5e4', isDark)}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<ExternalLink color={isDark ? '#a8a29e' : '#78716c'} size={16} />}
        iconBackgroundColor={iconBg('#e7e5e4', isDark)}
        label='Terms of Service'
        showBorder={false}
        type='navigation'
        onPress={onTerms}
      />
    </SettingsSection>
  );
}
