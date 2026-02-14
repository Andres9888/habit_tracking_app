/**
 * SmartSuggestions EmptyState
 * Dark mode aware via useThemeColors
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      <Animated.Text
        entering={anim(0)}
        style={{ marginBottom: 12, fontSize: 14, fontWeight: '600', color: colors.text.secondary }}
      >
        {label}
      </Animated.Text>
      <Animated.View
        entering={anim(60)}
        style={{
          alignItems: 'center',
          borderRadius: 16,
          backgroundColor: colors.gray[100],
          paddingVertical: 24,
        }}
      >
        <Text style={{ fontSize: 30 }}>🎯</Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: colors.text.secondary }}>
          Create your own unique habit!
        </Text>
      </Animated.View>
    </View>
  );
}
