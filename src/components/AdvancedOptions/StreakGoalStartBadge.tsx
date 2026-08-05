/** Green START badge on recommended streak chip (primary background pill). */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { chipMicroLabel } from './chipTextStyles';

export function StreakGoalStartBadge() {
  const { colors } = useThemeColors();
  return (
    <View
      pointerEvents='none'
      style={{
        position: 'absolute',
        top: -8,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <View
        style={{
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 999,
          backgroundColor: colors.primary[600],
        }}
      >
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{ ...chipMicroLabel, color: colors.text.inverse }}
        >
          START
        </Text>
      </View>
    </View>
  );
}
