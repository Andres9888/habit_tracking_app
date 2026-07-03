/** SettingsRow - AnimatedPressable, haptics, toggle pulse */
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { getSettingsRowColors } from './SettingsRow.colors';
import {
  useSettingsRowHandlers,
  useSettingsRowPulse,
  useSettingsRowWash,
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
  subtitle,
  type,
  value,
  badge,
  onPress,
  onToggle,
  rightAccessory,
  showChevron,
  hapticStyle,
  toggleVariant,
}: SettingsRowProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const colors = getSettingsRowColors(isDark);
  const { focusStyle, focusHandlers } = useFocusRing({ compact: true });
  const { pulseStyle, triggerPulse } = useSettingsRowPulse(isDark);
  const { washStyle, handlePressIn, handlePressOut } =
    useSettingsRowWash(isDark);
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
  const isPressable = type !== 'toggle' && !(type === 'info' && !onPress);
  const content = (
    <SettingsRowContent
      badge={badge}
      colors={colors}
      icon={icon}
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
      toggleVariant={toggleVariant}
      type={type}
      value={value}
      washStyle={isPressable ? washStyle : undefined}
    />
  );

  if (!isPressable) return content;
  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      disableAnimation
      style={focusStyle}
      onPress={handleNavPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...focusHandlers}
    >
      {content}
    </AnimatedPressable>
  );
}
