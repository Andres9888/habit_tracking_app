/**
 * ModalCloseButton - Shared close button for modal headers
 *
 * Provides a consistent, theme-aware close button with spring press feedback.
 * Used across all modals (Settings, StatsNotes, TemplatePreview, etc.)
 *
 * Design system: 44×44 (Apple HIG minimum), rounded-full, surface background, X icon size 24
 */

import { X } from 'lucide-react-native';
import { borderRadius } from '@/theme/spacing';
import { AnimatedPressable } from './AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

interface ModalCloseButtonProps {
  /** Called when the button is pressed */
  onClose: () => void;
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
  const resolvedIconSize = iconSize ?? (isSubtle ? 20 : 24);
  const subtleBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <AnimatedPressable
      animationConfig={{ enableHaptics: haptic }}
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={hitSlop}
      testID={testID}
      style={{
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: isSubtle ? subtleBg : colors.surface,
      }}
      onPress={onClose}
    >
      <X
        color={isSubtle ? colors.text.tertiary : colors.text.secondary}
        size={resolvedIconSize}
        strokeWidth={isSubtle ? 2 : 2.5}
      />
    </AnimatedPressable>
  );
}
