import React from 'react';
import { Star, Share2, Mail } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { iconBg } from '../iconColors';
import { useThemeColors } from '../../../theme/ThemeContext';

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
  const { isDark } = useThemeColors();

  return (
    <SettingsSection highContrastMode={highContrast} title='App'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Star color={isDark ? '#fbbf24' : '#f59e0b'} size={16} />}
        iconBackgroundColor={iconBg('#fef3c7', isDark)}
        label='Rate Chain Day'
        type='navigation'
        onPress={onRate}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Share2 color={isDark ? '#34d399' : '#10b981'} size={16} />}
        iconBackgroundColor={iconBg('#d1fae5', isDark)}
        label='Share with Friends'
        type='navigation'
        onPress={onShare}
      />
      <SettingsRow
        highContrastMode={highContrast}
        icon={<Mail color={isDark ? '#818cf8' : '#6366f1'} size={16} />}
        iconBackgroundColor={iconBg('#e0e7ff', isDark)}
        label='Contact Support'
        showBorder={false}
        type='navigation'
        onPress={onSupport}
      />
    </SettingsSection>
  );
}
