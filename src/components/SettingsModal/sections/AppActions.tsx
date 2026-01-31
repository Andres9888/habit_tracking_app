import React from 'react';
import { Star, Share2, Mail } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

interface Props {
  highContrast: boolean;
  onRate: () => void;
  onShare: () => void;
  onSupport: () => void;
}

export function AppActions({
  highContrast,
  onRate,
  onShare,
  onSupport,
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
        icon={<Mail color='#6366f1' size={16} />}
        iconBackgroundColor='#e0e7ff'
        label='Contact Support'
        showBorder={false}
        type='navigation'
        onPress={onSupport}
      />
    </SettingsSection>
  );
}
