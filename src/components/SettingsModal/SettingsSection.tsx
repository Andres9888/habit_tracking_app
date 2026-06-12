/** SettingsSection - Card container with optional collapsible accordion behavior */
import { ReactNode } from 'react';
import { View } from 'react-native';
import { shadows } from '@/theme';
import { useThemeColors } from '@/theme/ThemeContext';
import { StaticSectionLabel } from './StaticSectionLabel';
import { CollapsibleSectionCard } from './CollapsibleSectionCard';

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function SettingsSection({
  title,
  subtitle,
  icon,
  children,
  collapsible = false,
  isExpanded = true,
  onToggle,
}: Props) {
  const { colors: themeColors } = useThemeColors();

  const cardStyle = {
    backgroundColor: themeColors.card,
    borderColor: themeColors.border,
    borderWidth: 1,
    ...shadows.card,
  };

  if (collapsible) {
    return (
      <CollapsibleSectionCard
        cardStyle={cardStyle}
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
    <View className='gap-2'>
      <StaticSectionLabel icon={icon} subtitle={subtitle} title={title} />
      <View className='overflow-hidden rounded-2xl' style={cardStyle}>
        {children}
      </View>
    </View>
  );
}
