import React, { ReactNode } from 'react';
import { Star, Share2, MessageSquare, Sparkles } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '../../../theme/ThemeContext';

interface Props {
  highContrast: boolean;
  icon?: ReactNode;
  onRate: () => void;
  onShare: () => void;
  onFeedback: () => void;
  onWhatsNew: () => void;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggleSection?: () => void;
}

export function AppActions({
  highContrast,
  icon,
  onRate,
  onShare,
  onFeedback,
  onWhatsNew,
  collapsible,
  isExpanded,
  onToggleSection,
}: Props) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection collapsible={collapsible} highContrastMode={highContrast} icon={icon} isExpanded={isExpanded} title='Support' onToggle={onToggleSection}>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Star color={settings.star.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.star.bg}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Share2 color={settings.share.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.share.bg}
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<MessageSquare color={settings.feedback.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.feedback.bg}
        label='Send Feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Sparkles color={settings.whatsNew.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.whatsNew.bg}
        label="What's New"
        showBorder={false}
        type='navigation'
        onPress={onWhatsNew}
      />
    </SettingsSection>
  );
}
