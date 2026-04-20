import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useThemeColors } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function PrimaryCTA({
  label,
  onPress,
  disabled,
  loading,
  accessibilityLabel,
}: Props) {
  const { colors } = useThemeColors();
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole='button'
      accessibilityState={{ disabled: isInactive }}
      disabled={isInactive}
      hitSlop={8}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: colors.primary[600],
        borderRadius: 14,
        height: 56,
        justifyContent: 'center',
        opacity: isInactive ? 0.6 : pressed ? 0.85 : 1,
        paddingHorizontal: 24,
      })}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.inverse} />
      ) : (
        <Text
          style={{
            color: colors.text.inverse,
            fontSize: 17,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
