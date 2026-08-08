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
import { useSettingsSearch, rowMatchesQuery } from '../search';
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
  expanded,
  onPress,
  onToggle,
  rightAccessory,
  showChevron,
  hapticStyle,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const { pulseStyle, triggerPulse } = useSettingsRowPulse(isDark);
  const { handleNavPress, handleToggle } = useSettingsRowHandlers(
    { hapticStyle, onPress, onToggle },
    triggerPulse
  );
  const { query } = useSettingsSearch();
  const rowVisible = rowMatchesQuery(query, label);
  const showTopBorder = useSettingsRowDivider(rowVisible);

  // Live search filter: hide rows whose label doesn't match the active query.
  if (!rowVisible) return null;

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

  if (type === 'toggle' || (type === 'info' && !onPress)) return content;
  return (
    <AnimatedPressable
      accessibilityHint={subtitle}
      accessibilityLabel={label}
      accessibilityRole='button'
      // Without these, VoiceOver announced "Sort order, button" — no current
      // value, no open/closed state. Both matter most on the rows that expand
      // a picker in place rather than pushing a sub-page.
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      accessibilityValue={
        typeof value === 'string' ? { text: value } : undefined
      }
      style={focusStyle}
      onPress={handleNavPress}
      {...focusHandlers}
    >
      {content}
    </AnimatedPressable>
  );
}
