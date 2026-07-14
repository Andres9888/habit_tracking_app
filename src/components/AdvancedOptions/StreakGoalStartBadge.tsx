/** Green START badge on recommended streak chip (primary background pill). */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';

/** Dedicated style — do not reuse chipMicroLabel (parent width makes it wrap). */
const startLabelStyle = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 8,
  fontWeight: fontWeights.bold,
  letterSpacing: 0.3,
  lineHeight: 10,
} as const;

export function StreakGoalStartBadge() {
  const { colors } = useThemeColors();
  return (
    // Full-width overlay so the pill can hug content and stay centered
    // without inheriting the chip's flex width (which wraps "START" → STAR/T).
    <View
      pointerEvents='none'
      style={{
        position: 'absolute',
        top: -7,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <View
        style={{
          paddingHorizontal: 5,
          paddingVertical: 2,
          borderRadius: 6,
          backgroundColor: colors.primary[600],
        }}
      >
        <Text numberOfLines={1} style={{ ...startLabelStyle, color: colors.text.inverse }}>
          START
        </Text>
      </View>
    </View>
  );
}
