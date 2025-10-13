import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChainLinkIcon } from "../ChainLinkIcon";
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
  const { getConnectorColor } = useHabitChainVisualizerLogic(weekStatus);

  return (
    <View className="gap-4">
      <View className="h-10 flex-row items-center">
        {weekStatus.map((status, index) => {
          const isCompleted = status === "done";
          const connectorColor = getConnectorColor(index);

          const dayLabel = `Day ${index + 1}`;
          const statusLabel = isCompleted ? "Completed" : "Not completed";
          const accessibilityLabel = `${dayLabel}: ${statusLabel}`;
          const accessibilityHint = `Tap to toggle completion for day ${index + 1}`;

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
                    <ChainLinkIcon
                      angleDeg={0}
                      color="#ffffff"
                      size={20}
                      variant="stroke"
                    />
                  </View>
                )}
              </Pressable>
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                className="h-[2px] w-[22px]"
                style={{ backgroundColor: connectorColor }}
              />
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
