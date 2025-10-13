import React from "react";
import { View, Text, Pressable } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useHabitChainVisualizerLogic } from "./HabitChainVisualizer.hooks";

type HabitStatus = "done" | "missed" | "planned";

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
  const { getCircleFill } = useHabitChainVisualizerLogic(weekStatus);

  return (
    <View className="gap-4">
      <View className="h-10 flex-row items-center">
        {weekStatus.map((status, index) => {
          const isCompleted = status === "done";
          const fillClass = getCircleFill(index);

          const dayLabel = `Day ${index + 1}`;
          const statusLabel = isCompleted ? "Completed" : "Not completed";
          const accessibilityLabel = `${dayLabel}: ${statusLabel}`;
          const accessibilityHint = "Tap to toggle completion for this day";

          return (
            <View key={index} className="flex-row items-center">
              <Pressable
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                testID={`habit-status-${index}`}
                className={`mx-1 h-10 w-10 items-center justify-center rounded-full ${fillClass}`}
                onPress={() =>
                  onToggle({ date: weekDateStrings[index], habitId })
                }
              >
                {isCompleted && (
                  <View className="h-2 w-2 rounded-full bg-white" />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>

      {streak > 0 && (
        <Text
          className="text-xs font-semibold uppercase tracking-wider text-[#a0aec0]"
        >
          STREAK • {streak} DAYS
        </Text>
      )}
    </View>
  );
};
