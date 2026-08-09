/**
 * ModalCloseButton - Shared close button for modal headers
 *
 * Provides a consistent, theme-aware close button with spring press feedback.
 * Used across all modals (Settings, StatsNotes, TemplatePreview, etc.)
 *
 * Design system: 44×44 (Apple HIG minimum), rounded-full, surface background, X icon size 24
 */

import { X } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { borderRadius } from '@/theme/spacing';
import { AnimatedPressable } from './AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

type CloseButtonPalette = {
  backgroundColor: string;
  iconColor: string;
  iconSize: number;
  strokeWidth: number;
};

export const getSubtleCloseButtonVisuals = (
  isDark: boolean,
  colors: { text: { tertiary: string } }
): CloseButtonPalette => ({
  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  iconColor: colors.text.tertiary,
  iconSize: 20,
  strokeWidth: 2,
});

interface ModalCloseButtonProps {
  /** Called when the button is pressed */
  onClose: () => void;
  /** Inert + dimmed — for moments when leaving would strand in-flight work */
  disabled?: boolean;
  /** Accessibility label override */
  label?: string;
  /** Accessibility hint — use when "Close" alone doesn't say where it lands */
  hint?: string;
  /** Extra touch area beyond the 44×44 frame (edge-adjacent headers) */
  hitSlop?: number;
  /** Stable selector for device-level tests */
  testID?: string;
  /** Icon size override (default 24 solid / 20 subtle) */
  iconSize?: number;
  /** Whether to trigger haptic feedback (default true) */
  haptic?: boolean;
  /**
   * Visual weight. `solid` = surface-filled chip (default).
   * `subtle` = faint overlay chip for secondary dismiss affordances
   * where a primary back button is already visible in the header.
   */
  variant?: 'solid' | 'subtle';
}

export function ModalCloseButton({
  onClose,
  disabled = false,
  label = 'Close',
  hint,
  hitSlop,
  testID,
  iconSize,
  haptic = true,
  variant = 'solid',
}: ModalCloseButtonProps) {
  const { colors, isDark } = useThemeColors();
  const isSubtle = variant === 'subtle';
  const subtleVisual = getSubtleCloseButtonVisuals(isDark, colors);
  const resolvedIconSize = iconSize ?? (isSubtle ? subtleVisual.iconSize : 24);

  const handlePress = () => {
    if (haptic) {
      triggerHaptic('tap');
    }
    onClose();
  };

  return (
    <AnimatedPressable
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={hitSlop}
      testID={testID}
      style={{
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: isSubtle ? subtleVisual.backgroundColor : colors.surface,
        opacity: disabled ? 0.4 : 1,
      }}
      onPress={handlePress}
    >
      <X
        color={isSubtle ? subtleVisual.iconColor : colors.text.secondary}
        size={resolvedIconSize}
        strokeWidth={isSubtle ? subtleVisual.strokeWidth : 2.5}
      />
    </AnimatedPressable>
  );
}
