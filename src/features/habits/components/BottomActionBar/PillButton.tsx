/**
 * PillButton — Frosted glass pill with variant support.
 *
 * Variants:
 *   default — frosted glass (Settings + Templates original look)
 *   ghost   — faint frosted glass, de-emphasized (Settings in new layout)
 *   gold    — tinted streak gold, frosted glass (Explore pill)
 */

import {
  Text,
  Pressable,
  type TextStyle,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { colors as palette } from '../../../../theme/colors';
import { borderRadius } from '../../../../theme/spacing';
import { styles } from './BottomActionBar.styles';

export type PillVariant = 'default' | 'ghost' | 'gold';

interface PillButtonProps {
  accessibilityLabel: string;
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  pressOverlayStyle?: AnimatedStyle;
  variant?: PillVariant;
}

const PILL_BG_LIGHT = 'rgba(255,255,255,0.55)';
const PILL_BG_DARK = 'rgba(31,41,55,0.4)';
const PRESS_OVERLAY_LIGHT = 'rgba(255,255,255,0.25)';
const PRESS_OVERLAY_DARK = 'rgba(255,255,255,0.08)';

// Ghost: faint frosted glass — visible but de-emphasized
const GHOST_BG_LIGHT = 'rgba(255,255,255,0.35)';
const GHOST_BG_DARK = 'rgba(31,41,55,0.25)';
const GHOST_BORDER_LIGHT = 'rgba(221,216,210,0.4)';
const GHOST_BORDER_DARK = 'rgba(55,65,81,0.3)';

// Gold: streak-tinted frosted glass — warm but not solid
const GOLD_BG_LIGHT = 'rgba(254,243,205,0.45)';
const GOLD_BG_DARK = 'rgba(139,98,8,0.1)';
const GOLD_BORDER_LIGHT = 'rgba(139,98,8,0.15)';
const GOLD_BORDER_DARK = 'rgba(232,185,77,0.12)';

function getVariantStyle(
  variant: PillVariant,
  isDark: boolean,
  borderColor: string
): ViewStyle {
  if (variant === 'ghost') {
    return {
      backgroundColor: isDark ? GHOST_BG_DARK : GHOST_BG_LIGHT,
      borderColor: isDark ? GHOST_BORDER_DARK : GHOST_BORDER_LIGHT,
    };
  }
  if (variant === 'gold') {
    return {
      backgroundColor: isDark ? GOLD_BG_DARK : GOLD_BG_LIGHT,
      borderColor: isDark ? GOLD_BORDER_DARK : GOLD_BORDER_LIGHT,
    };
  }
  return {
    backgroundColor: isDark ? PILL_BG_DARK : PILL_BG_LIGHT,
    borderColor,
  };
}

export function PillButton(props: PillButtonProps) {
  const { colors, isDark } = useThemeColors();
  const variant = props.variant ?? 'default';
  const labelStyle: TextStyle = { color: props.labelColor };
  const variantStyle = getVariantStyle(variant, isDark, colors.border);

  return (
    <Pressable
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole='button'
      style={[styles.pill, variantStyle]}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
    >
      {props.pressOverlayStyle && (
        <Animated.View
          pointerEvents='none'
          style={[
            overlay.fill,
            {
              backgroundColor: isDark
                ? PRESS_OVERLAY_DARK
                : PRESS_OVERLAY_LIGHT,
            },
            props.pressOverlayStyle,
          ]}
        />
      )}
      {props.icon}
      <Text style={[styles.pillLabel, labelStyle]}>{props.label}</Text>
    </Pressable>
  );
}

const overlay = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, borderRadius: borderRadius.button },
});
