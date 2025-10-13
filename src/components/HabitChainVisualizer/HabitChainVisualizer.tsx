import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChainLinkIcon } from "../ChainLinkIcon";
import type { Id } from "../../../convex/_generated/dataModel";
import clsx from "clsx";
import { useHabitChainVisualizerLogic } from "./HabitChainVisualizer.hooks";

type HabitStatus = "done" | "missed" | "planned";

interface HabitChainVisualizerProps {
  weekStatus: HabitStatus[];
  streak: number;
  habitId: Id<"habits">;
  weekDateStrings: string[];
  onToggle: (args: { habitId: Id<"habits">; date: string }) => void;
  isCompactMode?: boolean;
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  weekStatus,
  streak,
  habitId,
  weekDateStrings,
  onToggle,
  isCompactMode = false,
}) => {
  const { renderConnectingLine } = useHabitChainVisualizerLogic(weekStatus);

  return (
    <View className="gap-4">
      <View className={isCompactMode ? "h-8 flex-row items-center" : "h-10 flex-row items-center"}>
        {weekStatus.map((status, index) => {
          const isCompleted = status === "done";
          const showLine = renderConnectingLine(index);

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
                className={clsx(
                  isCompactMode ? "h-8 w-8" : "h-10 w-10",
                  "items-center justify-center rounded-full",
                  isCompleted ? "bg-[#48bb78]" : "bg-[#dde3ed]"
                )}
                onPress={() =>
                  onToggle({ date: weekDateStrings[index], habitId })
                }
              >
                {isCompleted && (
                  <View className="items-center justify-center">
                    <ChainLinkIcon color="#ffffff" size={isCompactMode ? 14 : 16} />
                  </View>
                )}
              </Pressable>
              {showLine && (
                <View
                  className={
                    isCompactMode
                      ? "h-[2px] w-[18px] bg-[#48bb78]"
                      : "h-[2px] w-[22px] bg-[#48bb78]"
                  }
                />
              )}
            </View>
          );
        })}
      </View>

      {streak > 0 && (
        <Text
          className={
            isCompactMode
              ? "text-[10px] font-semibold uppercase tracking-wider text-[#a0aec0]"
              : "text-xs font-semibold uppercase tracking-wider text-[#a0aec0]"
          }
        >
          STREAK • {streak} DAYS
        </Text>
      )}
    </View>
  );
};
