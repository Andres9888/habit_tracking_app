/** AccessibilitySection — accessibility preferences (dyslexia-friendly font) */
import { Type } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { useThemeColors } from '../../../theme/ThemeContext';

interface AccessibilitySectionProps {
  icon?: ReactNode;
  useDyslexicFont: boolean;
  onChangeUseDyslexicFont: (value: boolean) => void | Promise<void>;
}

export function AccessibilitySection(p: AccessibilitySectionProps) {
  const { settings } = useThemeColors();

  return (
    <SettingsSection icon={p.icon} title='Accessibility'>
      <SettingsRow
        icon={<Type color={settings.dayMarker.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.dayMarker.bg}
        label='Dyslexia-friendly font'
        subtitle='Use OpenDyslexic across the app'
        type='toggle'
        value={p.useDyslexicFont}
        onToggle={(v) => void p.onChangeUseDyslexicFont(v)}
      />
    </SettingsSection>
  );
}
