import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 12,
        }}
      >
        {label}
      </Text>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          alignItems: 'center',
          backgroundColor: colors.gray[50],
          borderRadius: 16,
          paddingVertical: 24,
        }}
      >
        <Text style={{ fontSize: 32 }}>🎯</Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            marginTop: 8,
          }}
        >
          Create your own unique habit!
        </Text>
      </Animated.View>
    </View>
  );
}
