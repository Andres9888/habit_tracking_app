/** StreakGoalNumeral — oversized serif streak count over "of N days". */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';

/** Oversized hero numeral — intentionally larger than any typography token. */
const STREAK_NUMBER_SIZE = 72;
const STREAK_NUMBER_LINE = 76;

interface StreakGoalNumeralProps {
  currentStreak: number;
  goalLabel: string;
}

export function StreakGoalNumeral({
  currentStreak,
  goalLabel,
}: StreakGoalNumeralProps) {
  const { colors } = useThemeColors();
  return (
    <View className='items-center'>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        Current streak
      </Text>
      <Text
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: STREAK_NUMBER_SIZE,
          fontWeight: fontWeights.semibold,
          letterSpacing: -2,
          lineHeight: STREAK_NUMBER_LINE,
          marginTop: 6,
        }}
      >
        {currentStreak}
      </Text>
      <Text
        style={{
          ...typography.body,
          color: colors.text.secondary,
          marginTop: 8,
        }}
      >
        of{' '}
        <Text
          style={{
            color: colors.text.primary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {goalLabel}
        </Text>
      </Text>
    </View>
  );
}
