/** AboutLegalSection — Privacy, Terms, Version */
import { ReactNode } from 'react';
import { FileText, Info, Shield } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  icon?: ReactNode;
  version: string;
  buildNumber: string;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function AboutLegalSection({
  icon,
  version,
  buildNumber,
  onPrivacy,
  onTerms,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection icon={icon} title='About'>
      <SettingsRow
        icon={<Shield color={settings.legal.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.legal.bg}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        icon={<FileText color={settings.legal.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.legal.bg}
        label='Terms of Service'
        type='navigation'
        onPress={onTerms}
      />
      <SettingsRow
        icon={<Info color={settings.info.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.info.bg}
        label='Version'
        showBorder={false}
        type='info'
        value={`${version} (${buildNumber})`}
      />
    </SettingsSection>
  );
}
