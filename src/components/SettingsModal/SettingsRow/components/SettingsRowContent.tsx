import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { typography, fontWeights } from '@/theme/typography';
import { RowAccessory } from './RowAccessory';
import type { SettingsRowColors } from '../SettingsRow.colors';
import type { SettingsRowProps } from '../SettingsRow.types';

interface SettingsRowContentProps {
  colors: SettingsRowColors;
  icon: SettingsRowProps['icon'];
  iconBackgroundColor: SettingsRowProps['iconBackgroundColor'];
  isInteractiveInfo: boolean;
  label: SettingsRowProps['label'];
  onToggle: (value: boolean) => void;
  pulseStyle: ReturnType<typeof useAnimatedStyle>;
  secondaryTextColor: string;
  showBorder: boolean;
  subtitle?: SettingsRowProps['subtitle'];
  type: SettingsRowProps['type'];
  value: SettingsRowProps['value'];
  badge: SettingsRowProps['badge'];
  rightAccessory: SettingsRowProps['rightAccessory'];
}

export function SettingsRowContent({
  badge,
  colors,
  icon,
  iconBackgroundColor,
  isInteractiveInfo,
  label,
  onToggle,
  pulseStyle,
  rightAccessory,
  secondaryTextColor,
  showBorder,
  subtitle,
  type,
  value,
}: SettingsRowContentProps) {
  return (
    <View
      accessible={isInteractiveInfo ? false : undefined}
      className={`flex-row ${subtitle ? 'items-start' : 'items-center'} px-4 py-4 ${showBorder ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
        overflow: 'hidden',
      }}
    >
      {type === 'toggle' ? <Animated.View style={pulseStyle} /> : null}
      <View
        accessible={isInteractiveInfo ? false : undefined}
        className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
        importantForAccessibility={
          isInteractiveInfo ? 'no-hide-descendants' : undefined
        }
        style={{ backgroundColor: iconBackgroundColor }}
      >
        {icon}
      </View>
      <View
        accessible={isInteractiveInfo ? false : undefined}
        className='flex-1'
      >
        <Text
          accessibilityRole={isInteractiveInfo ? 'header' : undefined}
          numberOfLines={type === 'toggle' || type === 'navigation' ? 2 : 1}
          ellipsizeMode='tail'
          style={{
            ...typography.body,
            fontWeight: fontWeights.semibold,
            color: colors.label,
          }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            className='mt-1'
            numberOfLines={2}
            style={{ ...typography.caption, color: secondaryTextColor }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightAccessory ?? (
        <RowAccessory
          badge={badge}
          colors={colors}
          label={label}
          type={type}
          value={value}
          onToggle={onToggle}
        />
      )}
    </View>
  );
}
