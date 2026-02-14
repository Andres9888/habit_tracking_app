/**
 * Empty state for smart suggestions
 * Dark mode aware via useThemeColors
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme';

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ marginBottom: 12, fontSize: 14, fontWeight: '600', color: colors.text.secondary }}>{label}</Text>
      <View style={{ alignItems: 'center', borderRadius: 16, backgroundColor: isDark ? colors.gray[100] : colors.gray[50], paddingVertical: 24 }}>
        <Text style={{ fontSize: 30 }}>🎯</Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: colors.text.secondary }}>
          Create your own unique habit!
        </Text>
      </View>
    </View>
  );
}
