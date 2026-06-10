/** DetailHeroSchedule - Compact schedule chips under the hero stats row. */
import { CalendarDays, Moon, Sun, Sunrise } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { Habit } from '../HabitDetailScreen.types';
import { getScheduleParts } from './DetailHero.utils';

const TIME_ICONS = {
  afternoon: Sun,
  evening: Moon,
  morning: Sunrise,
} as const;

/** Chip-only dimensions with no shared token equivalent. */
const CHIP_ICON = 12;
const CHIP_PADDING_VERTICAL = 3;

interface ChipProps {
  icon: typeof CalendarDays;
  label: string;
}

function ScheduleChip({ icon: Icon, label }: ChipProps) {
  const { colors } = useThemeColors();
  return (
    <View
      className='flex-row items-center'
      style={{
        backgroundColor: colors.gray[50],
        borderColor: colors.border,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: CHIP_PADDING_VERTICAL,
      }}
    >
      <Icon color={colors.text.tertiary} size={CHIP_ICON} strokeWidth={2} />
      <Text
        numberOfLines={1}
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          fontSize: typography.overline.fontSize,
          letterSpacing: 0.2,
          lineHeight: typography.overline.lineHeight,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function DetailHeroSchedule({ habit }: { habit: Habit }) {
  const { frequencyLabel, time } = getScheduleParts(habit);
  if (!frequencyLabel && !time) return null;

  const labels = [frequencyLabel, time?.label].filter(Boolean).join(', ');

  return (
    <View
      accessibilityLabel={`Schedule: ${labels}`}
      className='flex-row items-center'
      style={{ gap: spacing.xs, marginTop: spacing.sm }}
    >
      {frequencyLabel ? (
        <ScheduleChip icon={CalendarDays} label={frequencyLabel} />
      ) : null}
      {time ? (
        <ScheduleChip icon={TIME_ICONS[time.key]} label={time.label} />
      ) : null}
    </View>
  );
}
