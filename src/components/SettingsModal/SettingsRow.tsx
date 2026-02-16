/* eslint-disable max-lines */
/** SettingsRow - OPTIMIZED: AnimatedPressable, scale animation, haptics */
import { ReactNode } from 'react';
import { Switch, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { useFocusRing } from '../../utils/accessibility';

interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  badge?: number;
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
  badge,
  onPress,
  onToggle,
  showBorder = true,
  highContrastMode = false,
}: SettingsRowProps) {
  const { isDark, colors: themeColors } = useThemeColors();
  const colors = getSettingsRowColors(highContrastMode, isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });

  const handleToggle = (v: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle?.(v);
  };

  const handleNavPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const content = (
    <View
      className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
      }}
    >
      <View
        className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
        style={{
          backgroundColor: iconBackgroundColor,
          borderColor: highContrastMode ? themeColors.accent.highContrastBorder : 'transparent',
          borderWidth: highContrastMode ? 2 : 0,
        }}
      >
        {icon}
      </View>
      <Text
        className='flex-1 text-[17px] font-semibold'
        style={{ color: colors.label }}
      >
        {label}
      </Text>
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
        <View className='flex-row items-center gap-2'>
          {badge != null && badge > 0 && (
            <View
              className='min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5'
              style={{ backgroundColor: themeColors.gray[200] }}
            >
              <Text
                className='text-[12px] font-bold'
                style={{ color: themeColors.text.secondary }}
              >
                {badge}
              </Text>
            </View>
          )}
          <ChevronRight color={colors.chevron} size={16} strokeWidth={2} />
        </View>
      )}
    </View>
  );

  if (type === 'toggle' || type === 'info') return content;

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      style={focusStyle}
      onPress={handleNavPress}
      {...focusHandlers}
    >
      {content}
    </AnimatedPressable>
  );
}
