/** SettingsSection - Card container with optional collapsible accordion behavior */
import { ReactNode } from 'react';
import { View } from 'react-native';
import { shadows } from '@/theme';
import { useThemeColors } from '@/theme/ThemeContext';
import { StaticSectionLabel } from './StaticSectionLabel';
import { CollapsibleSectionCard } from './CollapsibleSectionCard';
import { getRaisedSurface } from './raisedSurface';

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
  const { isDark } = useThemeColors();

  // Calm: one soft shadow shared with the profile hero; borderless float.
  const cardStyle = {
    backgroundColor: getRaisedSurface(isDark),
    ...shadows.floatingActionButton,
    shadowOpacity: 0.06,
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
