import { Pressable, Text } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryTile({ emoji, label, selected, onPress }: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='checkbox'
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: selected ? colors.primary[100] : colors.card,
        borderColor: selected ? colors.primary[600] : colors.border,
        borderRadius: 16,
        borderWidth: selected ? 2 : 1,
        flex: 1,
        gap: 6,
        minHeight: 104,
        opacity: pressed ? 0.85 : 1,
        paddingHorizontal: 8,
        paddingVertical: 16,
      })}
      onPress={onPress}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text
        numberOfLines={2}
        style={{
          color: colors.text.primary,
          fontSize: 13,
          fontWeight: selected ? '600' : '500',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
