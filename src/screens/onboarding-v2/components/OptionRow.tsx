import { Pressable, Text, View } from 'react-native';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useThemeColors } from '@/theme/ThemeContext';

interface OptionRowProps {
  icon?: string;
  label: string;
  onPress: () => void;
  selected: boolean;
  sub?: string;
}

export function OptionRow({ icon, label, onPress, selected, sub }: OptionRowProps) {
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
        borderRadius: 14,
        borderWidth: 1.5,
        flexDirection: 'row',
        gap: 14,
        marginBottom: 10,
        padding: 14,
      }}
    >
      {icon ? <Text style={{ fontSize: 22 }}>{icon}</Text> : null}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 15,
            fontWeight: '500',
            lineHeight: 20,
          }}
        >
          {label}
        </Text>
        {sub ? (
          <Text
            style={{ color: colors.text.tertiary, fontSize: 13, marginTop: 2 }}
          >
            {sub}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: selected ? colors.text.primary : 'transparent',
          borderColor: selected ? colors.text.primary : colors.border,
          borderRadius: 11,
          borderWidth: 1.5,
          height: 22,
          justifyContent: 'center',
          width: 22,
        }}
      >
        {selected ? (
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
