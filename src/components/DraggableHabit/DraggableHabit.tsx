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
  isCompactMode?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
}

export default function DraggableHabit({
  habit,
  isCompactMode = false,
  weekDateStrings,
  weekStatus,
  streak,
  toggleHabit,
}: DraggableHabitProps) {
  const { emoji, name } = useDraggableHabitLogic(habit);

  return (
    <View
      className={
        isCompactMode
          ? "gap-2 rounded-[16px] bg-white px-5 py-3 shadow-sm"
          : "gap-4 rounded-[16px] bg-white p-5 shadow-sm"
      }
    >
      {/* Habit Header with Emoji + Name */}
      <View className="flex-row items-center gap-3">
        {emoji && (
          <Text className={isCompactMode ? "text-xl leading-7" : "text-2xl leading-8"}>
            {emoji}
          </Text>
        )}
        <Text
          className={
            isCompactMode
              ? "flex-1 text-base font-semibold text-[#101727]"
              : "flex-1 text-lg font-semibold text-[#101727]"
          }
        >
          {name || habit.name}
        </Text>
      </View>

      {/* Chain Visualization */}
      <HabitChainVisualizer
        habitId={habit._id}
        isCompactMode={isCompactMode}
        streak={streak}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onToggle={toggleHabit}
      />
    </View>
  );
}
