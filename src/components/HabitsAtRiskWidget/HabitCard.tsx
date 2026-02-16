import { View, Text, Pressable } from 'react-native';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { getInterventionSuggestion } from './utils';
import { styles } from './styles';
import type { AtRiskHabit } from './types';
import type { Id } from '../../../convex/_generated/dataModel';

interface HabitCardProps {
  habit: AtRiskHabit;
  onPress: (habitId: Id<'habits'>) => void;
}

export function HabitCard({ habit, onPress }: HabitCardProps) {
  const theme = useAppTheme();
  const { colors, isDark } = useThemeColors();

  return (
    <Pressable
      accessibilityHint={`This habit has ${Math.round(habit.predictedProbability * 100)}% chance of completion tomorrow`}
      accessibilityLabel={`View ${habit.name} habit details`}
      accessibilityRole='button'
      style={({ pressed }) => [
        styles.habitCard,
        { backgroundColor: isDark ? colors.gray[100] : '#FFFBEB' },
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => onPress(habit._id)}
    >
      <View style={styles.habitInfo}>
        <Text
          style={[styles.habitName, { color: theme.custom.colors.gray[900] }]}
        >
          {habit.icon} {habit.name}
        </Text>
        <Text
          style={[
            styles.prediction,
            { color: theme.custom.colors.warning[700] },
          ]}
        >
          {Math.round(habit.predictedProbability * 100)}% chance tomorrow
        </Text>
      </View>

      <View style={styles.interventionBadge}>
        <Text
          style={[
            styles.interventionText,
            { color: theme.custom.colors.warning[700] },
          ]}
        >
          {getInterventionSuggestion(habit.strength)}
        </Text>
      </View>
    </Pressable>
  );
}
