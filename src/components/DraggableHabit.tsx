import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import type { Id } from '../../convex/_generated/dataModel';

type HabitStatus = 'done' | 'missed' | 'planned';

interface DraggableHabitProps {
  habit: any;
  showHabitStrengthPercentage: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  onArchive: (habitId: Id<'habits'>) => void;
  onLongPress: (habit: any) => void;
}

// Extract emoji from habit name or use default
function extractEmoji(name: string): { emoji: string; cleanName: string } {
  const emojiRegex = /^(\p{Emoji}+)\s*/u;
  const match = name.match(emojiRegex);
  if (match) {
    return {
      emoji: match[1],
      cleanName: name.substring(match[0].length).trim(),
    };
  }
  return { emoji: '✨', cleanName: name };
}

// Get habit color based on index or name hash
function getHabitColor(habitId: string): {
  bgLight: string;
  bgDark: string;
  textColor: string;
} {
  // Simple hash to generate consistent color per habit
  const hash = habitId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const colorSchemes = [
    { bgLight: 'bg-blue-100', bgDark: 'bg-blue-500', textColor: 'text-blue-500' },
    { bgLight: 'bg-orange-100', bgDark: 'bg-orange-500', textColor: 'text-orange-500' },
    { bgLight: 'bg-purple-100', bgDark: 'bg-purple-500', textColor: 'text-purple-500' },
    { bgLight: 'bg-green-100', bgDark: 'bg-green-500', textColor: 'text-green-500' },
    { bgLight: 'bg-pink-100', bgDark: 'bg-pink-500', textColor: 'text-pink-500' },
  ];

  return colorSchemes[Math.abs(hash) % colorSchemes.length];
}

export default function DraggableHabit({
  habit,
  showHabitStrengthPercentage,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
  onLongPress,
}: DraggableHabitProps) {
  const { emoji, cleanName } = extractEmoji(habit.name);
  const colors = getHabitColor(habit._id);

  // Calculate completion rate for the week
  const completedCount = weekStatus.filter((s) => s === 'done').length;
  const completionRate = Math.round((completedCount / weekStatus.length) * 100);

  // Check if a date is in the future
  const isFutureDate = (dateString: string): boolean => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  return (
    <Pressable
      className='rounded-2xl bg-white p-4'
      onLongPress={() => onLongPress(habit)}
    >
      {/* Top section: Emoji, Name, Streak, Percentage */}
      <View className='mb-5 flex-row items-center justify-between'>
        {/* Left: Emoji + Name + Streak */}
        <View className='flex-1 flex-row items-center gap-4'>
          {/* Emoji Circle */}
          <View className={`h-12 w-12 items-center justify-center rounded-xl ${colors.bgLight}`}>
            <Text className='text-2xl'>{emoji}</Text>
          </View>

          {/* Name and Streak */}
          <View className='flex-1'>
            <Text className='text-lg font-semibold text-[#1a1a1a]'>{cleanName}</Text>
            {streak > 0 && (
              <View className='flex-row items-center gap-1'>
                <Text className='text-sm font-bold uppercase text-orange-500'>
                  🔥 {streak} DAY STREAK
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: Percentage Badge */}
        {showHabitStrengthPercentage && (
          <View className='h-7 items-center justify-center rounded-full bg-emerald-500 px-3'>
            <Text className='text-sm font-semibold text-white'>{completionRate}%</Text>
          </View>
        )}
      </View>

      {/* Bottom section: Day Checkmarks */}
      <View className='flex-row items-center justify-between gap-2'>
        {weekStatus.map((status, idx) => {
          const dateString = weekDateStrings[idx];
          const isFuture = isFutureDate(dateString);
          const isDone = status === 'done';

          return (
            <Pressable
              key={dateString}
              className={`h-12 w-12 items-center justify-center rounded-xl ${
                isDone
                  ? colors.bgDark
                  : isFuture
                    ? 'border-2 border-[#1a1a1a] bg-white'
                    : 'border-2 border-[#1a1a1a] bg-white'
              }`}
              disabled={isFuture}
              onPress={() => !isFuture && toggleHabit({ habitId: habit._id, date: dateString })}
            >
              {isDone && <Check color='#ffffff' size={20} strokeWidth={3} />}
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}
