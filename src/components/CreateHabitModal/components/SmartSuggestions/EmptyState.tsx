import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

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
          fontFamily: fontFamilies.primary.text,
          fontSize: 14,
          fontWeight: fontWeights.semibold,
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
            fontFamily: fontFamilies.primary.text,
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Create your own unique habit!
        </Text>
      </Animated.View>
    </View>
  );
}
