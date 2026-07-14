/** Streak goal chip — calm flat chip language (amber streak / emerald accent). */
import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { chipMicroLabel, chipValueText } from './chipTextStyles';
import { StreakGoalStartBadge } from './StreakGoalStartBadge';
import { usePressed } from './usePressed';

interface Props {
  valueLabel: string;
  chipLabel: string;
  selected: boolean;
  accent?: 'streak' | 'emerald';
  recommended?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

export function StreakGoalChip({
  valueLabel,
  chipLabel,
  selected,
  accent = 'streak',
  recommended = false,
  onPress,
  accessibilityLabel,
}: Props) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();
  const emerald = accent === 'emerald';
  const bg = selected
    ? emerald
      ? colors.primary[100]
      : colors.status.streakLight
    : colors.card;
  const border = selected
    ? emerald
      ? colors.primary[500]
      : colors.status.streak
    : colors.cardBorder;
  const fg = selected
    ? emerald
      ? colors.primary[700]
      : colors.status.streakText
    : colors.text.primary;
  const meta = selected ? fg : colors.text.tertiary;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      {...pressProps}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 66,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 2,
        borderRadius: 14,
        backgroundColor: bg,
        borderWidth: selected ? 2 : 1,
        borderColor: border,
        opacity: pressed ? 0.92 : 1,
        overflow: 'visible',
      }}
      onPress={onPress}
    >
      {recommended ? <StreakGoalStartBadge /> : null}
      <Text style={{ ...chipValueText, color: fg }}>{valueLabel}</Text>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        numberOfLines={1}
        style={{
          ...chipMicroLabel,
          color: meta,
          marginTop: 2,
          textAlign: 'center',
          width: '100%',
        }}
      >
        {chipLabel}
      </Text>
    </Pressable>
  );
}
