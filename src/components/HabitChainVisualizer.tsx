import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChainLinkIcon } from './ChainLinkIcon';
import type { Id } from '../../convex/_generated/dataModel';

type HabitStatus = 'done' | 'missed' | 'planned';

interface HabitChainVisualizerProps {
  weekStatus: HabitStatus[];
  streak: number;
  habitId: Id<"habits">;
  weekDateStrings: string[];
  onToggle: (args: { habitId: Id<"habits">; date: string }) => void;
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  weekStatus,
  streak,
  habitId,
  weekDateStrings,
  onToggle,
}) => {
  const renderConnectingLine = (index: number): boolean => {
    // Show connecting line if current day is done AND next day is done
    return (
      index < weekStatus.length - 1 &&
      weekStatus[index] === 'done' &&
      weekStatus[index + 1] === 'done'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chainContainer}>
        {weekStatus.map((status, index) => {
          const isCompleted = status === 'done';
          const showLine = renderConnectingLine(index);

          const dayLabel = `Day ${index + 1}`;
          const statusLabel = isCompleted ? 'Completed' : 'Not completed';
          const accessibilityLabel = `${dayLabel}: ${statusLabel}`;
          const accessibilityHint = 'Tap to toggle completion for this day';

          return (
            <View key={index} style={styles.dayContainer}>
              <Pressable
                style={[
                  styles.dayButton,
                  isCompleted && styles.dayButtonCompleted,
                ]}
                onPress={() => onToggle({ habitId, date: weekDateStrings[index] })}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole="button"
              >
                {isCompleted && (
                  <View style={styles.iconContainer}>
                    <ChainLinkIcon color="#ffffff" size={16} />
                  </View>
                )}
              </Pressable>
              {showLine && <View style={styles.connectingLine} />}
            </View>
          );
        })}
      </View>

      {streak > 0 && (
        <Text style={styles.streakLabel}>STREAK • {streak} DAYS</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  chainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dde3ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonCompleted: {
    backgroundColor: '#48bb78',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingLine: {
    width: 22,
    height: 2,
    backgroundColor: '#48bb78',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#a0aec0',
    textTransform: 'uppercase',
  },
});
