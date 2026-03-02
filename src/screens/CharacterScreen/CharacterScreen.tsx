import { format, startOfDay, subDays } from 'date-fns';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMemo } from 'react';
import { useHabitData } from '../../features/habits/hooks/useHabitData';
import { useThemeColors } from '../../theme/ThemeContext';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  CharacterCard,
  AttributesSection,
  StatsSection,
  AchievementsSection,
} from './components';
import type { Achievement, CharacterData, CharacterScreenProps } from './types';

const STREAK_LOOKBACK_DAYS = 30;

interface HabitLike {
  _id: string | number;
}

interface TrackingLike {
  completed?: boolean;
  date: string;
  habitId: string | number;
}

function buildDateRange(): string[] {
  const today = startOfDay(new Date());
  return Array.from({ length: STREAK_LOOKBACK_DAYS }, (_, i) =>
    format(subDays(today, i), 'yyyy-MM-dd')
  );
}

function buildAttributes(
  activeHabits: number,
  dayStreak: number,
  totalCompletions: number
) {
  return {
    energy: Math.min(100, 20 + dayStreak * 4),
    strength: Math.min(100, 30 + activeHabits * 6),
    vitality: Math.min(100, 18 + totalCompletions * 2),
    wisdom: Math.min(
      100,
      20 + dayStreak * 3 + Math.floor(totalCompletions / 2)
    ),
  };
}

function buildAchievements(
  activeHabits: number,
  dayStreak: number,
  totalCompletions: number
): Achievement[] {
  const achievements: Achievement[] = [];

  if (activeHabits === 0) {
    return [
      {
        description: 'Add your first habit to unlock progress tracking',
        icon: '🌱',
        id: 'starter',
        title: 'Getting Started',
      },
    ];
  }

  achievements.push({
    description: 'You have an active habit set',
    icon: '🎯',
    id: 'active-habits',
    title: 'Habit Builder',
  });

  if (dayStreak >= 3) {
    achievements.push({
      description: 'Keep the streak going',
      icon: '🔥',
      id: 'streak',
      title: 'Consistent',
    });
  }

  if (totalCompletions >= 10) {
    achievements.push({
      description: 'Completed 10 total habits',
      icon: '🏅',
      id: 'completions',
      title: 'Steady Progress',
    });
  }

  return achievements;
}

function getHabitId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return null;
}

function buildCharacterData(
  habits: HabitLike[],
  tracking: TrackingLike[]
): CharacterData {
  const activeHabits = habits.length;

  const completedByDateByHabit = new Map<string, Set<string>>();
  for (const habit of habits) {
    const habitId = getHabitId(habit._id);
    if (!habitId) continue;
    completedByDateByHabit.set(habitId, new Set());
  }

  const totalCompletions = tracking.reduce((count, entry) => {
    if (!entry || typeof entry.date !== 'string' || !entry.completed) return count;
    const habitId = getHabitId(entry.habitId);
    if (!habitId) return count;
    const completedDates = completedByDateByHabit.get(habitId);
    if (!completedDates) return count;
    completedDates.add(entry.date);
    return count + 1;
  }, 0);

  const today = startOfDay(new Date());
  const todayString = format(today, 'yyyy-MM-dd');
  let dayStreak = 0;

  for (const habit of habits) {
    const habitId = getHabitId(habit._id);
    if (!habitId) continue;
    const completedDates = completedByDateByHabit.get(habitId);
    if (!completedDates) continue;

    let streak = 0;
    const cursor = new Date(today);

    while (completedDates.has(format(cursor, 'yyyy-MM-dd'))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    if (streak > dayStreak) dayStreak = streak;
  }

  const todayCompletions = tracking.reduce((count, entry) => {
    const habitId = getHabitId(entry.habitId);
    if (!habitId) return count;
    if (!completedByDateByHabit.has(habitId)) return count;
    return entry.completed && entry.date === todayString ? count + 1 : count;
  }, 0);
  const totalPower = Math.max(
    0,
    activeHabits * 4 + dayStreak * 6 + Math.floor(totalCompletions / 2)
  );
  const baseXp = Math.max(
    0,
    totalCompletions * 4 + dayStreak * 10 + todayCompletions
  );
  const xpToNextLevel = 120;
  const level = Math.max(1, Math.floor(baseXp / xpToNextLevel) + 1);

  return {
    attributes: buildAttributes(activeHabits, dayStreak, totalCompletions),
    level,
    recentAchievements: buildAchievements(
      activeHabits,
      dayStreak,
      totalCompletions
    ),
    stats: {
      activeHabits,
      dayStreak,
      totalPower,
    },
    title: 'Habit Hero',
    xp: baseXp % xpToNextLevel,
    xpToNextLevel,
  };
}

function CharacterScreenContent({ onBack }: CharacterScreenProps) {
  const dateRange = useMemo(() => buildDateRange(), []);
  const { habits, tracking } = useHabitData(dateRange);
  const characterData = useMemo(
    () =>
      buildCharacterData(
        habits as HabitLike[],
        tracking as TrackingLike[]
      ),
    [habits, tracking]
  );
  const { colors } = useThemeColors();

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <ScrollView className='flex-1'>
        <ScreenHeader title="Character" onBack={onBack} />
        <View className='w-full px-6'>
          <Animated.View entering={FadeInDown.delay(340).springify().damping(18)}>
            <CharacterCard data={characterData} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
            <AttributesSection attributes={characterData.attributes} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(460).springify().damping(18)}>
            <StatsSection stats={characterData.stats} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(520).springify().damping(18)}>
            <AchievementsSection
              achievements={characterData.recentAchievements}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function CharacterScreen({ onBack }: CharacterScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Character" onGoBack={onBack}>
      <CharacterScreenContent onBack={onBack} />
    </ScreenErrorBoundary>
  );
}
