/** SettingsSection - Card container with optional collapsible accordion behavior */
import { ReactNode } from 'react';
import { View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { useThemeColors } from '@/theme/ThemeContext';
import { StaticSectionLabel } from './StaticSectionLabel';
import { CollapsibleSectionCard } from './CollapsibleSectionCard';
import { getRaisedSurface } from './raisedSurface';
import { SettingsRowDividerProvider } from './SettingsRow/SettingsRowDivider.provider';

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
  const { colors: themeColors, isDark } = useThemeColors();

  const cardStyle = {
    backgroundColor: getRaisedSurface(isDark),
    borderColor: isDark ? themeColors.border : 'rgba(45,42,38,0.07)',
    borderRadius: airy.cardRadius,
    borderWidth: 1,
    shadowColor: '#2D2A26',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: isDark ? 0.18 : 0.05,
    shadowRadius: 9,
    elevation: 2,
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
        <SettingsRowDividerProvider>{children}</SettingsRowDividerProvider>
      </View>
    </View>
  );
}
