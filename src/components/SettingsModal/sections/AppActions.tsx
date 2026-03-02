import React from 'react';
import { Star, Share2, MessageSquare, Sparkles } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  onRate: () => void;
  onShare: () => void;
  onFeedback: () => void;
  onWhatsNew: () => void;
}

export function AppActions({
  highContrast,
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='App'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Star color={settings.star.icon} size={16} />}
        iconBackgroundColor={settings.star.bg}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Share2 color={settings.share.icon} size={16} />}
        iconBackgroundColor={settings.share.bg}
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<MessageSquare color={settings.feedback.icon} size={16} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send Feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Sparkles color={settings.whatsNew.icon} size={16} />}
        iconBackgroundColor={settings.whatsNew.bg}
        label="What's New"
        showBorder={false}
        type='navigation'
        onPress={onWhatsNew}
      />
    </SettingsSection>
  );
}
