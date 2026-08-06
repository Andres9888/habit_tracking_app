/** HelpAndAboutSection — Help & About: feedback, what's new, rate, share */
import { MessageSquare, Share2, Sparkles, Star } from 'lucide-react-native';
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

export function HelpAndAboutSection({
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
}: Props) {
  const { colors: themeColors, settings } = useThemeColors();
  const iconSize = iconSizes.small;
  const gold = { icon: themeColors.status.warning, bg: themeColors.status.warningLight };

  return (
    <SettingsSection title='Help & About'>
      <SettingsRow
        icon={<MessageSquare color={settings.feedback.icon} size={iconSize} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        icon={<Sparkles color={gold.icon} size={iconSize} />}
        iconBackgroundColor={gold.bg}
        label="What's New"
        type='navigation'
        onPress={onWhatsNew}
      />
      <SettingsRow
        icon={<Star color={gold.icon} size={iconSize} />}
        iconBackgroundColor={gold.bg}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        icon={<Share2 color={settings.share.icon} size={iconSize} />}
        iconBackgroundColor={settings.share.bg}
        label='Share with friends'
        type='navigation'
        onPress={onShare}
      />
    </SettingsSection>
  );
}
