import React from "react";
import { View, Text } from "react-native";
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
    <View className="bg-white rounded-2xl p-5 gap-4 shadow-sm">
      {/* Habit Header with Emoji + Name */}
      <View className="flex-row items-center gap-3">
        {emoji && <Text className="text-2xl leading-8">{emoji}</Text>}
        <Text className="text-lg font-semibold text-[#101727] flex-1">{name || habit.name}</Text>
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
