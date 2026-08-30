/** SettingsRow - AnimatedPressable, haptics, toggle pulse.
 *  Accessibility contract: every row exposes its label; toggle rows expose
 *  On/Off as their value, selection rows expose the current value string;
 *  expandable rows expose expanded state and a disclosure hint; disabled/busy
 *  reach assistive tech via accessibilityState. */
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
import { getSettingsRowA11y } from './SettingsRow.a11y';
import type { SettingsRowProps } from './SettingsRow.types';

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  labelColor,
  subtitle,
  type,
  value,
  badge,
  onPress,
  onToggle,
  rightAccessory,
  showChevron,
  hapticStyle,
  accessibilityLabel,
  accessibilityHint,
  expanded,
  disabled,
  busy,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const { pulseStyle, triggerPulse } = useSettingsRowPulse(isDark);
  const { handleNavPress, handleToggle } = useSettingsRowHandlers(
    { hapticStyle, onPress, onToggle },
    triggerPulse
  );
  const showTopBorder = useSettingsRowDivider(true, label);

  const isInteractiveInfo =
    type === 'info' && (!!rightAccessory || !!showChevron || !!onPress);
  const content = (
    <SettingsRowContent
      badge={badge}
      colors={colors}
      expanded={expanded}
      icon={icon}
      iconBackgroundColor={iconBackgroundColor}
      isInteractiveInfo={isInteractiveInfo}
      label={label}
      labelColor={labelColor}
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

  const a11y = getSettingsRowA11y({
    accessibilityHint,
    accessibilityLabel,
    busy,
    disabled,
    expanded,
    label,
    type,
    value,
  });

  // Rows that render without a pressable wrapper (pure toggles) already get
  // their full announcement from the inner AnimatedToggle switch — label,
  // role, checked state, On/Off value — so the wrapper stays transparent to
  // avoid duplicate accessibility nodes.
  if ((type === 'toggle' || type === 'info') && !onPress) {
    return content;
  }

  return (
    <AnimatedPressable
      {...a11y}
      accessibilityRole='button'
      disabled={disabled}
      style={focusStyle}
      onPress={handleNavPress}
      {...focusHandlers}
    >
      {content}
    </AnimatedPressable>
  );
}
