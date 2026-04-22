import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface CategoryTileProps {
  icon: string;
  label: string;
  onPress: () => void;
  selected: boolean;
}

export function CategoryTile({ icon, label, onPress, selected }: CategoryTileProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
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
