/** AboutSupportSection — Rate, Share, Feedback, What's New (Privacy/Terms/Version live in the footer) */
import {
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Star,
} from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  sectionIconColor: string;
  onRate: () => void;
  onShare: () => void;
  onFeedback: () => void;
  onWhatsNew: () => void;
}

export function AboutSupportSection({
  sectionIconColor,
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
}: Props) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsSection
      icon={<Heart color={sectionIconColor} size={iconSize} />}
      title='Support'
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
    </SettingsSection>
  );
}
