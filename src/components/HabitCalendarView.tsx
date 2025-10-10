import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";

type HabitStatus = "done" | "missed" | "planned" | "empty";

// Color theme constants
const COLORS = {
  primary: '#3B82F6',
  primaryLight: '#eff6ff',
  success: '#10B981',
  successLight: '#f0fdf4',
  dark: '#0f172a',
  neutral: '#64748b',
  neutralLight: '#cbd5e1',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  background: '#fff',
  backgroundGray: '#fafafa',
  backgroundLight: '#f8fafc',
} as const;

interface HabitCalendarViewProps {
  habitId: Id<"habits">;
  tracking: Array<{ habitId: Id<"habits">; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
}

export default function HabitCalendarView({
  habitId,
  tracking,
  toggleHabit,
}: HabitCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getHabitStatus = (dateString: string): HabitStatus => {
    const trackingEntry = tracking.find(
      (t) => t.habitId === habitId && t.date === dateString
    );

    // Parse date in local timezone to avoid timezone shifting
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (trackingEntry?.completed) return "done";
    if (date < today) return "missed";
    if (date.getTime() === today.getTime()) return "planned";
    return "empty";
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array of empty slots for days before the month starts
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handlePreviousMonth} style={styles.navButton}>
          <ChevronLeft size={20} color="#64748b" />
        </Pressable>

        <Pressable onPress={handleToday} style={styles.monthButton}>
          <Text style={styles.monthText}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
        </Pressable>

        <Pressable onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRight size={20} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendar}>
        {emptyDays.map((i) => (
          <View key={`empty-${i}`} style={styles.dayCell} />
        ))}

        {daysInMonth.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const status = getHabitStatus(dateString);
          const isCurrentDay = isToday(date);

          // Parse date in local timezone
          const [year, month, day] = dateString.split('-').map(Number);
          const checkDate = new Date(year, month - 1, day);
          const todayCheck = new Date();
          todayCheck.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);
          const isFuture = checkDate > todayCheck;

          return (
            <Pressable
              key={dateString}
              onPress={() => !isFuture && toggleHabit({ habitId, date: dateString })}
              disabled={isFuture}
              style={[
                styles.dayCell,
                styles.dayButton,
                status === "done" && styles.dayButtonDone,
                status === "missed" && styles.dayButtonMissed,
                status === "planned" && styles.dayButtonPlanned,
                isFuture && styles.dayButtonFuture,
                isCurrentDay && styles.dayButtonToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  status === "done" && styles.dayTextDone,
                  status === "missed" && styles.dayTextMissed,
                  isFuture && styles.dayTextFuture,
                  isCurrentDay && styles.dayTextToday,
                ]}
              >
                {format(date, 'd')}
              </Text>
              {status === "done" && (
                <View style={styles.completionDot} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotDone]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotMissed]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotPlanned]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  weekDays: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.neutral,
    letterSpacing: 1,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  dayButtonDone: {
    borderWidth: 2,
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  dayButtonMissed: {
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundGray,
    // Fallback: increased opacity + lighter bg for platforms without dashed support
    opacity: 0.7,
  },
  dayButtonPlanned: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  dayButtonFuture: {
    opacity: 0.3,
    borderColor: COLORS.borderLight,
  },
  dayButtonToday: {
    borderWidth: 2,
    borderColor: COLORS.dark,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.neutral,
  },
  dayTextDone: {
    color: COLORS.success,
    fontWeight: '600',
  },
  dayTextMissed: {
    color: COLORS.neutral,
  },
  dayTextFuture: {
    color: COLORS.neutralLight,
  },
  dayTextToday: {
    color: COLORS.dark,
    fontWeight: '700',
  },
  completionDot: {
    marginTop: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.success,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  legendDotDone: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  legendDotMissed: {
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.backgroundGray,
    opacity: 0.7,
  },
  legendDotPlanned: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.neutral,
  },
});
