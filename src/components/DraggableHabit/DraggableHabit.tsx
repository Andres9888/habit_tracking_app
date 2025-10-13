import React from "react";
import { View, Text } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { HabitChainVisualizer } from "../HabitChainVisualizer";
import { useDraggableHabitLogic } from "./DraggableHabit.hooks";

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

export default function DraggableHabit({
  habit,
  weekDateStrings,
  weekStatus,
  streak,
  toggleHabit,
}: DraggableHabitProps) {
  const { emoji, name } = useDraggableHabitLogic(habit);

  return (
    <View className="gap-4 rounded-[16px] bg-white p-5 shadow-sm">
      {/* Habit Header with Emoji + Name */}
      <View className="flex-row items-center gap-3">
        {emoji && <Text className="text-2xl leading-8">{emoji}</Text>}
        <Text className="flex-1 text-lg font-semibold text-[#101727]">
          {name || habit.name}
        </Text>
      </View>

      {/* Chain Visualization */}
      <HabitChainVisualizer
        habitId={habit._id}
        streak={streak}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onToggle={toggleHabit}
      />
    </View>
  );
}
