import React from "react";
import { View, Text } from "react-native";
import clsx from "clsx";
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
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export default function DraggableHabit({
  habit,
  isCompactMode = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
}: DraggableHabitProps) {
  const { emoji, name } = useDraggableHabitLogic(habit);

  return (
    <View
      className={clsx(
        "gap-4 rounded-[16px] bg-white px-5 shadow-sm",
        isCompactMode ? "py-3" : "py-5"
      )}
    >
      {/* Habit Header with Emoji + Name */}
      <View className="flex-row items-center gap-3">
        {emoji && (
          <Text
            className="text-2xl leading-8 text-[#101727]"
          >
            {emoji}
          </Text>
        )}
        <Text
          className="flex-1 text-lg font-semibold text-[#101727]"
        >
          {name || habit.name}
        </Text>
      </View>

      {/* Chain Visualization */}
      <HabitChainVisualizer
        habitId={habit._id}
        onToggle={toggleHabit}
        streak={streak}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />
    </View>
  );
}
