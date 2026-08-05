/* eslint-disable max-lines -- weekday cells are intentionally kept with the strip */
/** DetailWeekStrip — Mon–Sun chain strip for the hero (this week at a glance). */
import { Check } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { addDays, format, isAfter, startOfDay, startOfWeek } from 'date-fns';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { colors as palette, withAlpha } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';
import { getLocalDateString } from '../../../utils/getLocalDateString';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function DetailWeekStrip({
  completedDates,
  habitColor,
  habitCreatedAt,
  onDayPress,
}: Props) {
  const { colors, isDark } = useThemeColors();
  const today = getLocalDateString();
  const createdDay = habitCreatedAt
    ? startOfDay(new Date(habitCreatedAt))
    : null;

  const days = useMemo(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(monday, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const done = completedDates.has(dateString);
      const isToday = dateString === today;
      const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));
      const beforeStart = createdDay
        ? isAfter(createdDay, startOfDay(date))
        : false;
      const miss = !done && !isToday && !isFuture && !beforeStart;
      return { dateString, done, isToday, isFuture, miss };
    });
  }, [completedDates, today, createdDay]);

  const doneCount = days.filter((d) => d.done).length;

  return (
    <View
      className='mx-5 mt-3 rounded-2xl p-3'
      style={{
        ...shadows.subtle,
        backgroundColor: isDark ? colors.card : palette.light.cardElevated,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      <View className='mb-2 flex-row items-center justify-between px-1'>
        <Text style={{ ...typography.overline, color: colors.text.secondary }}>
          This week
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {doneCount} of 7
        </Text>
      </View>
      <View className='flex-row justify-between'>
        {days.map((d, i) => (
          <Pressable
            key={d.dateString}
            accessibilityLabel={`${d.dateString}${d.done ? ', completed' : d.miss ? ', missed' : ''}`}
            className='items-center'
            disabled={d.isFuture}
            style={{ gap: spacing.xs, opacity: d.isFuture ? 0.4 : 1 }}
            onPress={() => onDayPress(d.dateString, d.done)}
          >
            <Text
              style={{
                ...typography.caption,
                color: d.isToday ? colors.text.primary : colors.text.tertiary,
                fontWeight: fontWeights.bold,
              }}
            >
              {DOW[i]}
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: borderRadius.full,
                backgroundColor: d.done ? habitColor : colors.background,
                borderWidth: d.done ? 0 : 1.5,
                borderColor: d.miss
                  ? withAlpha(colors.status.error, 0.5)
                  : colors.border,
                borderStyle: d.miss ? 'dashed' : 'solid',
                ...(d.isToday && !d.done
                  ? { borderColor: habitColor, borderWidth: 2 }
                  : null),
              }}
            >
              {d.done ? (
                <Check color={colors.text.inverse} size={16} strokeWidth={3} />
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
