/** PausedHabitCard - Individual paused habit with resume action */
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { Id } from '../../../convex/_generated/dataModel';

interface PausedHabitCardProps {
  habit: {
    _id: Id<'habits'>;
    _creationTime: number;
    name: string;
    pausedAt?: number;
    strengthAtPause?: number;
  };
  index: number;
  onResume: (id: Id<'habits'>, name: string) => Promise<void>;
}

export function PausedHabitCard({
  habit,
  index,
  onResume,
}: PausedHabitCardProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      className='gap-3 rounded-2xl p-4'
      entering={FadeInUp.duration(280)
        .delay(60 + index * 60)
        .springify()
        .damping(18)}
      style={{
        backgroundColor: colors.card,
        elevation: 4,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='gap-1'>
        <Text
          className='font-semibold'
          style={{ color: colors.text.primary, fontSize: 17, lineHeight: 22 }}
        >
          {habit.name}
        </Text>
        <Text
          style={{ color: colors.text.tertiary, fontSize: 13, lineHeight: 18 }}
        >
          Paused{' '}
          {new Date(habit.pausedAt || habit._creationTime).toLocaleDateString()}
        </Text>
        {habit.strengthAtPause !== undefined && (
          <Text
            style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 18 }}
          >
            Strength preserved: {Math.round(habit.strengthAtPause * 100)}%
          </Text>
        )}
      </View>
      <Pressable
        accessibilityLabel={`Resume ${habit.name}`}
        accessibilityRole='button'
        className='items-center rounded-xl py-3 active:opacity-80'
        style={{ backgroundColor: colors.primary[300] }}
        onPress={() => onResume(habit._id, habit.name)}
      >
        <Text
          className='font-bold text-white'
          style={{ fontSize: 13, letterSpacing: 1.5 }}
        >
          RESUME
        </Text>
      </Pressable>
    </Animated.View>
  );
}
