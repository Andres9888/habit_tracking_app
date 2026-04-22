import { Pressable, Text } from 'react-native';
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
  const base = variant === 'brand' ? colors.primary[600] : colors.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: base,
        borderRadius: 14,
        opacity: disabled ? 0.4 : 1,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
