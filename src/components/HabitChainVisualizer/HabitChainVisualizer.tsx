import React from "react";
import { View, Text, Pressable } from "react-native";
import { parse, format } from "date-fns";
import { ChainLinkIcon } from "../ChainLinkIcon";
import type { Id } from "../../../convex/_generated/dataModel";
import { useHabitChainVisualizerLogic } from "./HabitChainVisualizer.hooks";

type HabitStatus = "done" | "missed" | "planned";

interface HabitChainVisualizerProps {
  habitId: Id<"habits">;
  onToggle: (args: { habitId: Id<"habits">; date: string }) => void;
  streak: number;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  habitId,
  onToggle,
  streak,
  weekDateStrings,
  weekStatus,
}) => {
  const { getConnectorColor } = useHabitChainVisualizerLogic(weekStatus);

  return (
    <View className="gap-4">
      <View className="h-10 flex-row items-center">
        {weekStatus.map((status, index) => {
          const isCompleted = status === "done";
          const isLast = index === weekStatus.length - 1;
          const connectorColor = getConnectorColor(index);

          // Accessibility text with specific date
          const parsedDate = parse(weekDateStrings[index], "yyyy-MM-dd", new Date());
          const dateLabel = format(parsedDate, "MMM d, EEE").toUpperCase();
          const statusLabel = isCompleted ? "Completed" : "Not completed";
          const accessibilityLabel = `${dateLabel}: ${statusLabel}`;
          const accessibilityHint = `Tap to toggle completion for ${dateLabel}`;

          return (
            <View key={index} className="flex-row items-center">
              <Pressable
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  isCompleted ? "bg-[#48bb78]" : "bg-[#dde3ed]"
                }`}
                onPress={() =>
                  onToggle({ date: weekDateStrings[index], habitId })
                }
              >
                {isCompleted && (
                  <View className="items-center justify-center">
                    <ChainLinkIcon color="#ffffff" size={16} />
                  </View>
                )}
              </Pressable>
              {!isLast && (
                <View
                  className="h-[2px] w-[22px]"
                  style={{ backgroundColor: connectorColor }}
                />
              )}
            </View>
          );
        })}
      </View>

      {streak > 0 && (
        <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-[#a0aec0]">
          STREAK • {streak} DAYS
        </Text>
      )}
    </View>
  );
};
