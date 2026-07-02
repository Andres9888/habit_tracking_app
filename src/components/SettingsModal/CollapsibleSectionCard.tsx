/** CollapsibleSectionCard - Animated accordion card for settings sections */
import { ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { SettingsRowDividerProvider } from './SettingsRow/SettingsRowDivider.provider';
import { useSettingsSectionAccordion } from './useSettingsSectionAccordion';

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  cardStyle: ViewStyle;
}

export function CollapsibleSectionCard({
  title,
  subtitle,
  icon,
  children,
  isExpanded = true,
  onToggle,
  cardStyle,
}: Props) {
  const accordion = useSettingsSectionAccordion({ isExpanded });

  const handleToggle = useCallback(() => {
    onToggle?.();
  }, [onToggle]);

  return (
    <View className='overflow-hidden rounded-2xl' style={cardStyle}>
      <SettingsSectionHeader
        chevronStyle={accordion.chevronAnimatedStyle}
        icon={icon}
        isExpanded={isExpanded}
        subtitle={subtitle}
        title={title}
        onToggle={handleToggle}
      />
      <Animated.View style={accordion.contentAnimatedStyle}>
        <View onLayout={accordion.handleContentLayout}>
          <SettingsRowDividerProvider>{children}</SettingsRowDividerProvider>
        </View>
      </Animated.View>
    </View>
  );
}
