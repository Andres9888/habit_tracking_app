/** SettingsRow - AnimatedPressable, haptics, toggle pulse */
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import {
  useSettingsRowHandlers,
  useSettingsRowPulse,
} from './SettingsRow.hooks';
import { SettingsRowContent } from './components/SettingsRowContent';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useFocusRing } from '../../../utils/accessibility';
import { useSettingsSearch, rowMatchesQuery } from '../search';
import type { SettingsRowProps } from './SettingsRow.types';

export function SettingsRow({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  help,
  type,
  value,
  badge,
  onPress,
  onToggle,
  rightAccessory,
  showBorder = true,
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

  // Live search filter: hide rows whose label doesn't match the active query.
  if (!rowMatchesQuery(query, label)) return null;

  const isInteractiveInfo = type === 'info' && !!rightAccessory;

  const content = (
    <SettingsRowContent
      badge={badge}
      colors={colors}
      help={help}
      icon={icon}
      iconBackgroundColor={iconBackgroundColor}
      isInteractiveInfo={isInteractiveInfo}
      label={label}
      onToggle={handleToggle}
      pulseStyle={pulseStyle}
      rightAccessory={rightAccessory}
      secondaryTextColor={themeColors.text.secondary}
      // While searching, drop inner dividers — the matched subset is dynamic,
      // so a row's "last in section" border would otherwise orphan under it.
      showBorder={query ? false : showBorder}
      subtitle={subtitle}
      type={type}
      value={value}
    />
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
