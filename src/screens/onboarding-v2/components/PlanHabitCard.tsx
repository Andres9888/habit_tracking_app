import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface PlanHabitCardProps {
  daysToIron: number;
  icon: string;
  iconColor: string;
  name: string;
  timing: string;
}

export function PlanHabitCard({
  daysToIron,
  icon,
  iconColor,
  name,
  timing,
}: PlanHabitCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
        padding: 14,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: iconColor,
          borderRadius: 10,
          height: 44,
          justifyContent: 'center',
          width: 44,
        }}
      >
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}
        >
          {name}
        </Text>
        <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
          {timing} · ~{daysToIron} days to iron
        </Text>
      </View>
    </View>
  );
}
