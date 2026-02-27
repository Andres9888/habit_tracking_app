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
import { AnimatedPressable } from './AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

interface ModalCloseButtonProps {
  /** Called when the button is pressed */
  onClose: () => void;
  /** Accessibility label override */
  label?: string;
  /** Icon size override (default 24) */
  iconSize?: number;
  /** Whether to trigger haptic feedback (default true) */
  haptic?: boolean;
}

export function ModalCloseButton({
  onClose,
  label = 'Close',
  iconSize = 24,
  haptic = true,
}: ModalCloseButtonProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    if (haptic) {
      triggerHaptic('tap');
    }
    onClose();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        backgroundColor: colors.surface,
      }}
      onPress={handlePress}
    >
      <X color={colors.text.secondary} size={iconSize} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}
