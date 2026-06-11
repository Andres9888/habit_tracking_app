/** SettingsRow - AnimatedPressable, haptics, toggle pulse */
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { highContrastColors } from '@/theme/highContrastColors';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import {
  useSettingsRowHandlers,
  useSettingsRowPulse,
} from './SettingsRow.hooks';
import { RowAccessory } from './components/RowAccessory';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useFocusRing } from '../../../utils/accessibility';
import type { SettingsRowProps } from './SettingsRow.types';

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  type,
  value,
  badge,
  onPress,
  onToggle,
  rightAccessory,
  showBorder = true,
  highContrastMode = false,
  hapticStyle,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(highContrastMode, isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const { pulseStyle, triggerPulse } = useSettingsRowPulse(isDark);
  const { handleNavPress, handleToggle } = useSettingsRowHandlers(
    { hapticStyle, onPress, onToggle },
    triggerPulse
  );

  const content = (
    <View
      className={`flex-row ${subtitle ? 'items-start' : 'items-center'} px-4 py-4 ${showBorder ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: showBorder ? colors.border : undefined,
        overflow: 'hidden',
      }}
    >
      {type === 'toggle' ? <Animated.View style={pulseStyle} /> : null}
      <View
        className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
        style={{
          backgroundColor: iconBackgroundColor,
          borderColor: highContrastMode
            ? highContrastColors.accent
            : 'transparent',
          borderWidth: highContrastMode ? 2 : 0,
        }}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
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
            style={{ ...typography.caption, color: themeColors.text.secondary }}
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
          themeColors={themeColors}
          type={type}
          value={value}
          onToggle={handleToggle}
        />
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
