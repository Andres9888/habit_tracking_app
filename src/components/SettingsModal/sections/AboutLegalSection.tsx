/** AboutLegalSection — Privacy, Terms, Version */
import { FileText, Info, Shield } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  version: string;
  buildNumber: string;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function AboutLegalSection({
  highContrast,
  version,
  buildNumber,
  onPrivacy,
  onTerms,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='About'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Shield color={settings.legal.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.legal.bg}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<FileText color={settings.legal.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.legal.bg}
        label='Terms of Service'
        type='navigation'
        onPress={onTerms}
      />
      <SettingsRow
        highContrastMode={highContrast}
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
