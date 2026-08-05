/** Numeric day field for custom streak goal. */
import { Text, TextInput, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { chipMicroLabel } from './chipTextStyles';
import { clampStreakDays, CUSTOM_STREAK_MIN } from './streakGoal.constants';

interface Props {
  days: number;
  onDaysChange: (days: number) => void;
}

export function StreakGoalDayField({ days, onDaysChange }: Props) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        flex: 1,
        minHeight: 48,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 14,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
      }}
    >
      <TextInput
        accessibilityLabel='Custom streak days'
        inputMode='numeric'
        keyboardType='number-pad'
        maxLength={3}
        style={{
          ...typography.bodyBold,
          fontSize: 28,
          lineHeight: 32,
          color: colors.text.primary,
          textAlign: 'center',
          width: '100%',
          padding: 0,
          fontVariant: ['tabular-nums'],
        }}
        value={String(days)}
        onBlur={() => onDaysChange(clampStreakDays(days || CUSTOM_STREAK_MIN))}
        onChangeText={(t) => {
          const digits = t.replaceAll(/\D/g, '');
          if (digits === '') {
            onDaysChange(CUSTOM_STREAK_MIN);
            return;
          }
          const n = Number(digits);
          if (!Number.isNaN(n)) onDaysChange(clampStreakDays(n));
        }}
      />
      <Text style={{ ...chipMicroLabel, color: colors.text.tertiary }}>
        DAYS
      </Text>
    </View>
  );
}
