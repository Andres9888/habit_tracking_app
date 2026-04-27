import { Pressable, Text } from 'react-native';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useThemeColors } from '@/theme/ThemeContext';

interface CategoryTileProps {
  icon: string;
  label: string;
  onPress: () => void;
  selected: boolean;
}

export function CategoryTile({ icon, label, onPress, selected }: CategoryTileProps) {
  const { colors } = useThemeColors();
  const { triggerSelection } = useHapticFeedback({ isEnabled: true });

  const handlePress = () => {
    triggerSelection();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={handlePress}
      style={{
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderColor: selected ? colors.text.primary : colors.border,
        borderRadius: 16,
        borderWidth: 1.5,
        flex: 1,
        gap: 6,
        minWidth: 0,
        padding: 14,
      }}
    >
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 13,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
