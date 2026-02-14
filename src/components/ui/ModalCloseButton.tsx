/**
 * ModalCloseButton - Shared close button for modal headers
 *
 * Provides a consistent, theme-aware close button with spring press feedback.
 * Used across all modals (Settings, StatsNotes, TemplatePreview, etc.)
 *
 * Design system: 40×40, borderRadius 20, surface background, X icon size 20
 */

import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from './AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

interface ModalCloseButtonProps {
  /** Called when the button is pressed */
  onClose: () => void;
  /** Accessibility label override */
  label?: string;
  /** Icon size override (default 20) */
  iconSize?: number;
  /** Whether to trigger haptic feedback (default true) */
  haptic?: boolean;
}

export function ModalCloseButton({
  onClose,
  label = 'Close',
  iconSize = 20,
  haptic = true,
}: ModalCloseButtonProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: colors.surface,
      }}
      onPress={handlePress}
    >
      <X color={colors.text.secondary} size={iconSize} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}
