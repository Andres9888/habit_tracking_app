/** AboutSupportSection — Quiet Configuration Index §6: advocacy + feedback.
 *  Changelog lives in the footer. */
import { Heart, MessageSquare } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  sectionIconColor: string;
  onLoveChainDay: () => void;
  onFeedback: () => void;
}

export function AboutSupportSection({
  sectionIconColor,
  onLoveChainDay,
  onFeedback,
}: Props) {
  const { settings } = useThemeColors();
  const iconSize = iconSizes.small;

  return (
    <SettingsSection
      icon={<Heart color={sectionIconColor} size={iconSize} />}
      title='Help & About'
    >
      <SettingsRow
        icon={<Heart color={settings.star.icon} size={iconSize} />}
        iconBackgroundColor={settings.star.bg}
        label='Love Chain Day?'
        subtitle='Rate it or share with a friend'
        type='navigation'
        onPress={onLoveChainDay}
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
