/** StreakGoalNumeral — compact baseline row: serif streak count + "of N days · M left". */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';

const STREAK_NUMBER_SIZE = 26;

interface StreakGoalNumeralProps {
  animatedStreak: number;
  daysRemaining: number;
  goalLabel: string;
}

export function StreakGoalNumeral({
  animatedStreak,
  daysRemaining,
  goalLabel,
}: StreakGoalNumeralProps) {
  const { colors } = useThemeColors();
  return (
    <View className='flex-row items-baseline' style={{ gap: 6 }}>
      <Text
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: STREAK_NUMBER_SIZE,
          fontWeight: fontWeights.bold,
        }}
      >
        {animatedStreak}
      </Text>
      <Text style={{ ...typography.bodySmall, color: colors.text.secondary }}>
        of {goalLabel} · {daysRemaining} left
      </Text>
    </View>
  );
}
