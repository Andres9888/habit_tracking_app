import React, { ReactNode } from 'react';
import { Star, Share2, MessageSquare, Sparkles } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  icon?: ReactNode;
  onRate: () => void;
  onShare: () => void;
  onFeedback: () => void;
  onWhatsNew: () => void;
}

export function AppActions({
  icon,
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection icon={icon} title='Support'>
      <SettingsRow
        icon={<Star color={settings.star.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.star.bg}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        icon={<Share2 color={settings.share.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.share.bg}
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        icon={
          <MessageSquare
            color={settings.feedback.icon}
            size={iconSizes.small}
          />
        }
        iconBackgroundColor={settings.feedback.bg}
        label='Send Feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        icon={
          <Sparkles color={settings.whatsNew.icon} size={iconSizes.small} />
        }
        iconBackgroundColor={settings.whatsNew.bg}
        label="What's New"
        showBorder={false}
        type='navigation'
        onPress={onWhatsNew}
      />
    </SettingsSection>
  );
}
