import { Button } from '@/components/Button';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useThemeColors } from '@/theme/ThemeContext';

interface PrimaryCTAProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'dark' | 'brand';
}

export function PrimaryCTA({
  disabled = false,
  label,
  onPress,
  variant = 'dark',
}: PrimaryCTAProps) {
  const { colors } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback({ isEnabled: true });

  const handlePress = () => {
    if (disabled) return;
    triggerLightImpact();
    onPress();
  };

  return (
    <Button
      disabled={disabled}
      fullWidth
      size="large"
      variant="primary"
      style={
        variant === 'dark'
          ? { backgroundColor: colors.text.primary }
          : undefined
      }
      onPress={handlePress}
    >
      {label}
    </Button>
  );
}
