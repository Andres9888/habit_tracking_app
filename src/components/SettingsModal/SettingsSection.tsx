/** SettingsSection - Card container with optional collapsible accordion behavior */
import { ReactNode } from 'react';
import { View } from 'react-native';
import { shadows } from '@/theme';
import { highContrastColors } from '@/theme/highContrastColors';
import { useThemeColors } from '@/theme/ThemeContext';
import { StaticSectionLabel } from './StaticSectionLabel';
import { CollapsibleSectionCard } from './CollapsibleSectionCard';

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  highContrastMode?: boolean;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function SettingsSection({
  title, subtitle, icon, children, highContrastMode = false,
  collapsible = false, isExpanded = true, onToggle,
}: Props) {
  const { colors: themeColors } = useThemeColors();
  const hc = highContrastMode;

  const cardStyle = {
    backgroundColor: hc ? highContrastColors.background : themeColors.card,
    borderColor: hc ? highContrastColors.border : undefined,
    borderWidth: hc ? 1 : 0,
    ...(hc ? { elevation: 0, shadowColor: 'transparent' } : shadows.card),
  };

  if (collapsible) {
    return (
      <CollapsibleSectionCard
        cardStyle={cardStyle}
        highContrastMode={hc}
        icon={icon}
        isExpanded={isExpanded}
        subtitle={subtitle}
        title={title}
        onToggle={onToggle}
      >
        {children}
      </CollapsibleSectionCard>
    );
  }

  return (
    <View className="gap-2">
      <StaticSectionLabel highContrastMode={hc} icon={icon} subtitle={subtitle} title={title} />
      <View className="overflow-hidden rounded-2xl" style={cardStyle}>{children}</View>
    </View>
  );
}
