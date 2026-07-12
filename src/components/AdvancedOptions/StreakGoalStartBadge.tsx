/** Green START badge on recommended streak chip (primary background pill). */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { chipMicroLabel } from './chipTextStyles';

export function StreakGoalStartBadge() {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        position: 'absolute',
        top: -8,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: colors.primary[600],
        zIndex: 2,
      }}
    >
      <Text style={{ ...chipMicroLabel, color: colors.text.inverse }}>
        START
      </Text>
    </View>
  );
}
