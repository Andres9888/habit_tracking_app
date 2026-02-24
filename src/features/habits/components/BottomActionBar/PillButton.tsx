/**
 * PillButton — Frosted glass pill used for Settings and Templates.
 * Both pills share identical visual treatment for free-to-3 symmetry.
 */

import { Text, Pressable, type TextStyle } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './BottomActionBar.styles';

interface PillButtonProps {
  accessibilityLabel: string;
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

const PILL_BG_LIGHT = 'rgba(255,255,255,0.55)';
const PILL_BG_DARK = 'rgba(31,41,55,0.4)';

export function PillButton(props: PillButtonProps) {
  const { colors, isDark } = useThemeColors();
  const labelStyle: TextStyle = { color: props.labelColor };

  return (
    <Pressable
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole='button'
      style={[
        styles.pill,
        {
          backgroundColor: isDark ? PILL_BG_DARK : PILL_BG_LIGHT,
          borderColor: colors.border,
        },
      ]}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
    >
      {props.icon}
      <Text style={[styles.pillLabel, labelStyle]}>{props.label}</Text>
    </Pressable>
  );
}
