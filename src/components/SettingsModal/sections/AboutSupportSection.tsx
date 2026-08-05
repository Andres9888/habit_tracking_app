/** AboutSupportSection — Support: one action per row (mock: 44px targets).
 *  Rate and Share are separate rows again, and What's New sits here rather than
 *  hiding in the footer link line. */
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
  onWhatsNew: () => void;
  onFeedback: () => void;
}

export function AboutSupportSection({
  sectionIconColor,
  onRate,
  onShare,
  onWhatsNew,
  onFeedback,
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
        label='Share with a friend'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        icon={<Sparkles color={settings.whatsNew.icon} size={iconSize} />}
        iconBackgroundColor={settings.whatsNew.bg}
        label="What's new"
        type='navigation'
        onPress={onWhatsNew}
      />
      <SettingsRow
        icon={<MessageSquare color={settings.feedback.icon} size={iconSize} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send feedback'
        type='navigation'
        onPress={onFeedback}
      />
    </SettingsSection>
  );
}
