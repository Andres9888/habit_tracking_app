/** SettingsRow - AnimatedPressable, haptics, toggle pulse */
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import {
  useSettingsRowHandlers,
  useSettingsRowPulse,
} from './SettingsRow.hooks';
import { SettingsRowContent } from './components/SettingsRowContent';
import { useSettingsRowDivider } from './SettingsRowDivider.provider';
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
  showChevron,
  hapticStyle,
  labelColor,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const { pulseStyle, triggerPulse } = useSettingsRowPulse(isDark);
  const { handleNavPress, handleToggle } = useSettingsRowHandlers(
    { hapticStyle, onPress, onToggle },
    triggerPulse
  );
  const showTopBorder = useSettingsRowDivider(true);

  const isInteractiveInfo =
    type === 'info' && (!!rightAccessory || !!showChevron || !!onPress);
  const content = (
    <SettingsRowContent
      badge={badge}
      colors={colors}
      icon={icon}
      labelColor={labelColor}
      iconBackgroundColor={iconBackgroundColor}
      isInteractiveInfo={isInteractiveInfo}
      label={label}
      onToggle={handleToggle}
      pulseStyle={pulseStyle}
      rightAccessory={rightAccessory}
      secondaryTextColor={themeColors.text.secondary}
      showChevron={showChevron}
      showTopBorder={showTopBorder}
      subtitle={subtitle}
      type={type}
      value={value}
    />
  );

  if (type === 'toggle' || (type === 'info' && !onPress)) return content;
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
