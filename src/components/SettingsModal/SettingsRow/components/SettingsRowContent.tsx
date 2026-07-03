import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { airy } from '@/theme/airyScale';
import { useSettingsScale } from '../../useSettingsScale';
import { RowAccessory } from './RowAccessory';
import { RowLabel } from './RowLabel';
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
  washStyle?: ReturnType<typeof useAnimatedStyle>;
  secondaryTextColor: string;
  showTopBorder: boolean;
  showChevron?: boolean;
  subtitle?: SettingsRowProps['subtitle'];
  type: SettingsRowProps['type'];
  value: SettingsRowProps['value'];
  badge: SettingsRowProps['badge'];
  rightAccessory: SettingsRowProps['rightAccessory'];
  toggleVariant?: SettingsRowProps['toggleVariant'];
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
  washStyle,
  rightAccessory,
  secondaryTextColor,
  showChevron,
  showTopBorder,
  subtitle,
  type,
  toggleVariant,
  value,
}: SettingsRowContentProps) {
  const k = useSettingsScale();
  return (
    <View
      accessible={isInteractiveInfo ? false : undefined}
      className={`flex-row ${subtitle ? 'items-start' : 'items-center'} px-4 py-4 ${showTopBorder ? 'border-t' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showTopBorder ? colors.border : undefined,
        overflow: 'hidden',
        paddingVertical: k(airy.rowPaddingV),
      }}
    >
      {type === 'toggle' ? <Animated.View style={pulseStyle} /> : null}
      {washStyle ? <Animated.View style={washStyle} /> : null}
      <View
        accessible={isInteractiveInfo ? false : undefined}
        className='mr-4 items-center justify-center'
        importantForAccessibility={
          isInteractiveInfo ? 'no-hide-descendants' : undefined
        }
        style={{
          backgroundColor: iconBackgroundColor,
          width: k(airy.tileSize),
          height: k(airy.tileSize),
          borderRadius: k(airy.tileRadius),
        }}
      >
        {icon}
      </View>
      <RowLabel
        isInteractiveInfo={isInteractiveInfo}
        label={label}
        labelColor={colors.label}
        secondaryTextColor={secondaryTextColor}
        subtitle={subtitle}
        type={type}
      />
      {rightAccessory ?? (
        <RowAccessory
          badge={badge}
          colors={colors}
          label={label}
          showChevron={showChevron}
          toggleVariant={toggleVariant}
          type={type}
          value={value}
          onToggle={onToggle}
        />
      )}
    </View>
  );
}
