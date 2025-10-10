import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { HabitChainVisualizer } from "./HabitChainVisualizer";

type HabitStatus = "done" | "missed" | "planned";

interface Habit {
  _id: Id<"habits">;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  order?: number;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
}

interface DraggableHabitProps {
  habit: Habit;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
}

// Extract emoji from habit name (if present)
const getEmojiAndName = (fullName: string): { emoji: string; name: string } => {
  const emojiRegex = /\p{Emoji}/u;
  const match = fullName.match(emojiRegex);

  if (match && match.index === 0) {
    const emoji = match[0];
    const name = fullName.slice(emoji.length).trim();
    return { emoji, name };
  }

  return { emoji: '', name: fullName };
};

export default function DraggableHabit({
  habit,
  weekDateStrings,
  weekStatus,
  streak,
  toggleHabit,
}: DraggableHabitProps) {
  const { emoji, name } = getEmojiAndName(habit.name);

  return (
    <View style={styles.habitCard}>
      {/* Habit Header with Emoji + Name */}
      <View style={styles.habitHeader}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.habitName}>{name || habit.name}</Text>
      </View>

      {/* Chain Visualization */}
      <HabitChainVisualizer
        habitId={habit._id}
        weekStatus={weekStatus}
        streak={streak}
        weekDateStrings={weekDateStrings}
        onToggle={toggleHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  habitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 32,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101727',
    flex: 1,
  },
});
