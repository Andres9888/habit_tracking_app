import { Text, View } from 'react-native';

import { useThemeColors } from '@/theme';
import { fontWeights } from '@/theme/typography';

interface Props {
  icon: string;
  name: string;
  description: string;
}

export function PlanHabitCard({ icon, name, description }: Props) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        marginBottom: 10,
        padding: 14,
      }}
    >
      <Text style={{ fontSize: 32 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 16,
            fontWeight: fontWeights.semibold,
          }}
        >
          {name}
        </Text>
        <Text
          numberOfLines={2}
          style={{ color: colors.text.secondary, fontSize: 13, marginTop: 2 }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
