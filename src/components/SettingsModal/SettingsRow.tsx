/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

/**
 * SettingsRow Component
 *
 * A single row in the settings list. Supports multiple types:
 * - toggle: Switch control for boolean settings
 * - navigation: Chevron indicating tappable row
 * - selection: Shows current value with chevron
 * - info: Display-only row without interaction
 *
 * Includes icon, label, and appropriate right-side control.
 * Supports high contrast mode for accessibility.
 */

import { ReactNode } from 'react';
import { Switch, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';

interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showBorder?: boolean;
  highContrastMode?: boolean;
}

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  type,
  value,
  onPress,
  onToggle,
  showBorder = true,
  highContrastMode = false,
}: SettingsRowProps) {
  const colors = getSettingsRowColors(highContrastMode);

  const handleToggle = (newValue: boolean) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle?.(newValue);
  };

  const handleNavPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b border-stone-100' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
      }}
    >
      {/* Icon */}
      <View
        className='mr-4 size-10 items-center justify-center rounded-xl'
        style={{
          backgroundColor: iconBackgroundColor,
          borderColor: highContrastMode ? '#facc15' : 'transparent',
          borderWidth: highContrastMode ? 2 : 0,
        }}
      >
        {icon}
      </View>

      {/* Label */}
      <Text
        className='flex-1 text-[17px] font-semibold'
        style={{ color: colors.label }}
      >
        {label}
      </Text>

      {/* Right side content */}
      {type === 'toggle' && (
        <Switch
          accessibilityLabel={label}
          ios_backgroundColor={colors.switchTrackFalse}
          thumbColor={colors.switchThumb}
          trackColor={{
            false: colors.switchTrackFalse,
            true: colors.switchTrackTrue,
          }}
          value={value as boolean}
          onValueChange={handleToggle}
        />
      )}

      {type === 'selection' && (
        <View className='flex-row items-center gap-1'>
          <Text
            className='text-[17px] font-medium'
            style={{ color: colors.value }}
          >
            {value as string}
          </Text>
          <ChevronRight color={colors.chevron} size={16} strokeWidth={2} />
        </View>
      )}

      {type === 'navigation' && (
        <ChevronRight color={colors.chevron} size={16} strokeWidth={2} />
      )}

      {/* Info type shows nothing on the right - just displays the label */}
    </View>
  );

  // Info and toggle types are not pressable
  if (type === 'toggle' || type === 'info') {
    return content;
  }

  return (
    <AnimatedPressable accessibilityRole='button' onPress={handleNavPress}>
      {content}
    </AnimatedPressable>
  );
}
