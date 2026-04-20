import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  multiSelect?: boolean;
  onPress: () => void;
}

export function OptionRow({
  emoji,
  label,
  selected,
  multiSelect,
  onPress,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={multiSelect ? 'checkbox' : 'radio'}
      accessibilityState={{
        checked: multiSelect ? selected : undefined,
        selected: multiSelect ? undefined : selected,
      }}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: selected ? colors.primary[100] : colors.card,
        borderColor: selected ? colors.primary[600] : colors.border,
        borderRadius: 14,
        borderWidth: selected ? 2 : 1,
        flexDirection: 'row',
        gap: 14,
        marginBottom: 10,
        opacity: pressed ? 0.85 : 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
      })}
      onPress={onPress}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        style={{
          color: colors.text.primary,
          flex: 1,
          fontSize: 16,
          fontWeight: selected ? '600' : '500',
        }}
      >
        {label}
      </Text>
      {multiSelect ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: selected ? colors.primary[600] : 'transparent',
            borderColor: selected ? colors.primary[600] : colors.border,
            borderRadius: 6,
            borderWidth: 2,
            height: 22,
            justifyContent: 'center',
            width: 22,
          }}
        >
          {selected ? (
            <Text style={{ color: colors.text.inverse, fontSize: 14 }}>✓</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
