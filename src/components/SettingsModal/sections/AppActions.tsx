import React from 'react';
import { Star, Share2, MessageSquare, Sparkles } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

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
  return (
    <SettingsSection highContrastMode={highContrast} title='App'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Star color='#f59e0b' size={16} />}
        iconBackgroundColor='#fef3c7'
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Share2 color='#10b981' size={16} />}
        iconBackgroundColor='#d1fae5'
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<MessageSquare color='#8b5cf6' size={16} />}
        iconBackgroundColor='#ede9fe'
        label='Send Feedback'
        type='navigation'
        onPress={onFeedback}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Sparkles color='#a855f7' size={16} />}
        iconBackgroundColor='#f3e8ff'
        label="What's New"
        showBorder={false}
        type='navigation'
        onPress={onWhatsNew}
      />
    </SettingsSection>
  );
}
