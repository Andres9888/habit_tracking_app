/** AboutSupportSection — Rate, Share, Feedback, What's New, Privacy, Terms, Version */
import {
  FileText,
  Info,
  MessageSquare,
  Share2,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  sectionIconColor: string;
  version: string;
  buildNumber: string;
  onRate: () => void;
  onShare: () => void;
  onFeedback: () => void;
  onWhatsNew: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function AboutSupportSection({
  sectionIconColor,
  version,
  buildNumber,
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
  onPrivacy,
  onTerms,
}: Props) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsSection
      icon={<Info color={sectionIconColor} size={iconSize} />}
      title='About & Support'
    >
      <SettingsRow
        icon={<Star color={settings.star.icon} size={iconSize} />}
        iconBackgroundColor={settings.star.bg}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        icon={<Share2 color={settings.share.icon} size={iconSize} />}
        iconBackgroundColor={settings.share.bg}
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        icon={<MessageSquare color={settings.feedback.icon} size={iconSize} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send Feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        icon={<Sparkles color={settings.whatsNew.icon} size={iconSize} />}
        iconBackgroundColor={settings.whatsNew.bg}
        label="What's New"
        type='navigation'
        onPress={onWhatsNew}
      />
      <SettingsRow
        icon={<Shield color={settings.legal.icon} size={iconSize} />}
        iconBackgroundColor={settings.legal.bg}
        label='Privacy Policy'
        type='navigation'
        onPress={onPrivacy}
      />
      <SettingsRow
        icon={<FileText color={settings.legal.icon} size={iconSize} />}
        iconBackgroundColor={settings.legal.bg}
        label='Terms of Service'
        type='navigation'
        onPress={onTerms}
      />
      <SettingsRow
        icon={<Info color={settings.info.icon} size={iconSize} />}
        iconBackgroundColor={settings.info.bg}
        label='Version'
        showBorder={false}
        type='info'
        value={`${version} (${buildNumber})`}
      />
    </SettingsSection>
  );
}
