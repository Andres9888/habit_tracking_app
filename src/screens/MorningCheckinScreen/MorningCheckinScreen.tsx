/**
 * MorningCheckinScreen Component
 *
 * A dedicated screen shown when opening the app in the morning (6-10am)
 * that displays:
 * - Yesterday's habit completion summary
 * - Today's habits list
 * - A motivational message
 *
 * Features:
 * - Dismissable via swipe or button
 * - Remembers per day if it was shown
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors/core';
import type { MorningCheckinData } from '../useMorningCheckin';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MorningCheckinScreenProps {
  data: MorningCheckinData;
  onDismiss: () => void;
}

export function MorningCheckinScreen({ data, onDismiss }: MorningCheckinScreenProps) {
  const themeColors = useThemeColors();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return 'Good morning';
    return 'Good morning';
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return colors.primary[600];
    if (percentage >= 50) return colors.streak[500];
    return colors.warning;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.light.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}! 🌅</Text>
          <Text style={styles.title}>Your Daily Check-in</Text>
        </View>

        {/* Yesterday's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday's Progress</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.light.card }]}>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: getCompletionColor(data.yesterdaySummary.percentage) }]}>
                  {data.yesterdaySummary.completed}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {data.yesterdaySummary.total}
                </Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: getCompletionColor(data.yesterdaySummary.percentage) }]}>
                  {data.yesterdaySummary.percentage}%
                </Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${data.yesterdaySummary.percentage}%`,
                    backgroundColor: getCompletionColor(data.yesterdaySummary.percentage),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Today's Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <View style={[styles.habitsCard, { backgroundColor: colors.light.card }]}>
            {data.todayHabits.map((habit, index) => (
              <View
                key={habit.id}
                style={[
                  styles.habitRow,
                  index < data.todayHabits.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <Text
                  style={[
                    styles.habitName,
                    habit.completed && styles.habitCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {habit.name}
                </Text>
                {habit.completed && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Inspiration</Text>
          <View style={[styles.quoteCard, { backgroundColor: colors.primary[100] }]}>
            <Text style={styles.quoteText}>"{data.motivationalMessage.text}"</Text>
            <Text style={styles.quoteAuthor}>— {data.motivationalMessage.author}</Text>
          </View>
        </View>

        {/* Dismiss Button */}
        <Pressable
          style={[styles.dismissButton, { backgroundColor: colors.primary[600] }]}
          onPress={onDismiss}
        >
          <Text style={styles.dismissButtonText}>Let's Go!</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.gray[800],
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 12,
    marginLeft: 4,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[800],
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  habitsCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitName: {
    flex: 1,
    fontSize: 17,
    color: colors.gray[800],
    fontWeight: '500',
  },
  habitCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray[400],
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary[600],
    fontWeight: '700',
  },
  quoteCard: {
    borderRadius: 16,
    padding: 20,
  },
  quoteText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.primary[700],
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
    textAlign: 'right',
  },
  dismissButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  dismissButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default MorningCheckinScreen;
