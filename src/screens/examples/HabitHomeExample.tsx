import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { addDays, format } from 'date-fns';
import { BarChart3, Settings } from 'lucide-react-native';
import { DateSelector } from '../../components/DateSelector';
import CharacterScreen from '../CharacterScreen';
import CharacterIcon from '../../components/CharacterIcon';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type LocalHabit = {
  color: string;
  completedDates: string[];
  emoji: string;
  id: string;
  name: string;
};

const generateWeekDateStrings = () => {
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(today, i - today.getDay())
  );
  return weekDates.map((d) => format(d, 'yyyy-MM-dd'));
};

const ExampleHabitCard = ({
  habit,
  onDelete,
  onToggle,
  weekDates,
}: {
  habit: LocalHabit;
  weekDates: string[];
  onDelete: (habitId: string) => void;
  onToggle: (habitId: string, date: string) => void;
}) => {
  const isCompletedFor = (date: string) => habit.completedDates.includes(date);

  const streak = useMemo(() => {
    const sorted = [...habit.completedDates].sort().reverse();
    let s = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const iso of sorted) {
      const check = new Date(iso);
      check.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(today.getDate() - s);
      if (check.getTime() === expected.getTime()) s += 1;
      else break;
    }
    return s;
  }, [habit.completedDates]);

  const completionCount = weekDates.filter(isCompletedFor).length;

  // Animated progress bar width
  const containerWidth = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  useEffect(() => {
    const target = containerWidth.value * (completionCount / 7);
    progressWidth.value = withTiming(target, { duration: 500 });
  }, [completionCount, containerWidth, progressWidth]);
  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  // Card appear/disappear animation
  const cardLayout = Layout.springify();

  return (
    <Animated.View
      className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(150)}
      layout={cardLayout}
    >
      <View className='mb-4 flex-row items-start justify-between'>
        <View className='flex-row items-center gap-3'>
          <Text className='text-3xl'>{habit.emoji}</Text>
          <View>
            <Text className='text-[17px] font-semibold text-gray-900'>
              {habit.name}
            </Text>
            {streak > 0 && (
              <View className='mt-1 flex-row items-center gap-1'>
                <Text className='text-[11px] font-semibold uppercase tracking-wide text-orange-500'>
                  {streak} Day Streak
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text className='text-sm text-gray-500'>{completionCount}/7</Text>
      </View>

      <View className='flex-row justify-between gap-2'>
        {weekDates.map((date) => {
          const isFuture = new Date(date) > new Date();
          const isDone = isCompletedFor(date);
          const scale = useSharedValue(1);
          const scaleStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));
          return (
            <Pressable
              key={date}
              accessibilityRole='button'
              className={`h-9 w-9 items-center justify-center rounded-full ${isFuture ? 'bg-gray-100 opacity-50' : isDone ? 'bg-green-500' : 'bg-gray-200'}`}
              disabled={isFuture}
              onPress={() => !isFuture && onToggle(habit.id, date)}
              onPressIn={() => {
                scale.value = withSpring(0.9);
              }}
              onPressOut={() => {
                scale.value = withSpring(1);
              }}
            >
              <Animated.View style={scaleStyle}>
                {isDone ? <Text className='text-white'>✓</Text> : null}
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      <View
        className='mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100'
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          containerWidth.value = w;
          progressWidth.value = withTiming(w * (completionCount / 7), {
            duration: 500,
          });
        }}
      >
        <Animated.View
          className='rounded-full'
          style={[
            { backgroundColor: habit.color, height: '100%' },
            progressStyle,
          ]}
        />
      </View>

      <View className='mt-3 flex-row justify-end'>
        <Pressable
          accessibilityRole='button'
          onPress={() => onDelete(habit.id)}
        >
          <Text className='text-red-600'>Delete</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default function HabitHomeExample() {
  const [currentWeekDates] = useState<string[]>(generateWeekDateStrings());
  const [showCharacterScreen, setShowCharacterScreen] = useState(false);
  const [habits, setHabits] = useState<LocalHabit[]>([
    {
      color: '#4ADE80',
      completedDates: [],
      emoji: '🧘',
      id: '1',
      name: 'Meditation',
    },
    {
      color: '#60A5FA',
      completedDates: [],
      emoji: '📚',
      id: '2',
      name: 'Reading',
    },
    {
      color: '#F59E0B',
      completedDates: [],
      emoji: '💪',
      id: '3',
      name: 'Exercise',
    },
  ]);

  const handleToggle = (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completedDates: h.completedDates.includes(date)
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date].sort(),
            }
          : h
      )
    );
  };

  const handleDelete = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  if (showCharacterScreen) {
    return <CharacterScreen onBack={() => setShowCharacterScreen(false)} />;
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <ScrollView className='flex-1'>
        <View className='mx-auto w-full max-w-[448px] px-6 py-4'>
          <View className='flex-row items-center justify-between py-4'>
            <Text className='text-[28px] font-semibold'>Habits</Text>
            <View className='flex-row gap-3'>
              <Pressable
                accessibilityRole='button'
                onPress={() => setShowCharacterScreen(true)}
              >
                <CharacterIcon size={36} />
              </Pressable>
              <Pressable
                accessibilityRole='button'
                className='h-9 w-9 items-center justify-center rounded-full bg-gray-100'
              >
                <BarChart3 color={'#111'} size={18} />
              </Pressable>
              <Pressable
                accessibilityRole='button'
                className='h-9 w-9 items-center justify-center rounded-full bg-gray-100'
              >
                <Settings color={'#111'} size={18} />
              </Pressable>
            </View>
          </View>

          <DateSelector
            dates={currentWeekDates.map((d) => {
              const [y, m, da] = d.split('-').map(Number);
              return new Date(y, m - 1, da);
            })}
          />

          <View className='gap-4 py-4'>
            {habits.map((h) => (
              <ExampleHabitCard
                key={h.id}
                habit={h}
                weekDates={currentWeekDates}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
