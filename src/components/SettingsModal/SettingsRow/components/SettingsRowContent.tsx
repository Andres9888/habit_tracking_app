import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { airy } from '@/theme/airyScale';
import { RowAccessory } from './RowAccessory';
import { RowBody } from './RowBody';
import type { SettingsRowColors } from '../SettingsRow.colors';
import type { SettingsRowProps } from '../SettingsRow.types';

interface SettingsRowContentProps {
  colors: SettingsRowColors;
  icon: SettingsRowProps['icon'];
  iconBackgroundColor: SettingsRowProps['iconBackgroundColor'];
  isInteractiveInfo: boolean;
  label: SettingsRowProps['label'];
  labelColor?: SettingsRowProps['labelColor'];
  onToggle: (value: boolean) => void;
  pulseStyle: ReturnType<typeof useAnimatedStyle>;
  secondaryTextColor: string;
  showTopBorder: boolean;
  showChevron?: boolean;
  expanded?: boolean;
  subtitle?: SettingsRowProps['subtitle'];
  subtitleStrong?: SettingsRowProps['subtitleStrong'];
  type: SettingsRowProps['type'];
  value: SettingsRowProps['value'];
  badge: SettingsRowProps['badge'];
  rightAccessory: SettingsRowProps['rightAccessory'];
  /** Screen-reader guidance for the pressable body region of a toggle row. */
  bodyAccessibilityHint?: string;
  onBodyPress?: SettingsRowProps['onBodyPress'];
}

export function SettingsRowContent({
  badge,
  bodyAccessibilityHint,
  colors,
  expanded,
  icon,
  iconBackgroundColor,
  isInteractiveInfo,
  label,
  labelColor,
  onBodyPress,
  onToggle,
  pulseStyle,
  rightAccessory,
  secondaryTextColor,
  showChevron,
  showTopBorder,
  subtitle,
  subtitleStrong,
  type,
  value,
}: SettingsRowContentProps) {
  return (
    <View
      accessible={isInteractiveInfo ? false : undefined}
      className={`flex-row ${subtitle ? 'items-start' : 'items-center'} px-4 py-4 ${showTopBorder ? 'border-t' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showTopBorder ? colors.border : undefined,
        overflow: 'hidden',
        paddingVertical: airy.rowPaddingV,
      }}
    >
      {type === 'toggle' ? <Animated.View style={pulseStyle} /> : null}
      <RowBody
        bodyAccessibilityHint={bodyAccessibilityHint}
        icon={icon}
        iconBackgroundColor={iconBackgroundColor}
        isInteractiveInfo={isInteractiveInfo}
        label={label}
        labelColor={labelColor ?? colors.label}
        primaryTextColor={colors.label}
        secondaryTextColor={secondaryTextColor}
        subtitle={subtitle}
        subtitleStrong={subtitleStrong}
        type={type}
        onBodyPress={onBodyPress}
      />
      {rightAccessory ?? (
        <RowAccessory
          badge={badge}
          colors={colors}
          expanded={expanded}
          label={label}
          showChevron={showChevron}
          type={type}
          value={value}
          onToggle={onToggle}
        />
      )}
    </View>
  );
}
