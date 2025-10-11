import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useStreakChainLogic } from "./StreakChain.hooks";

export type DayStatus = "done" | "missed" | "planned";

export interface StreakChainProps {
  label: string;
  statuses: DayStatus[];
  size?: number;
}

/**
 * StreakChain renders a compact chain visualization similar to the provided design.
 * - Left: label (e.g., "Reading Chain")
 * - Right: rounded pill with streak days
 * - Below: row of circles with link icon, connected by short bars
 *
 * Design language:
 * - Typography and colors align with existing app styles (#0f172a titles, #64748b secondary, #e2e8f0 borders)
 * - Primary color uses #3B82F6 (blue)
 */
export default function StreakChain({
  label,
  statuses,
  size = 28,
}: StreakChainProps) {
  const { circleSize, iconSize, streakDays } = useStreakChainLogic(
    statuses,
    size
  );

  return (
    <View className="pb-3 pt-1">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-bold tracking-tight text-slate-900">
          {label}
        </Text>
        <View
          accessibilityLabel={`${streakDays} days`}
          className="rounded-full bg-indigo-50 px-2.5 py-1"
        >
          <Text className="text-xs font-semibold text-slate-900">
            {streakDays} days
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {statuses.map((status, idx) => {
          const isDone = status === "done";
          const isFuture = status === "planned"; // treat planned as future/disabled
          const connectorActive = idx < statuses.length - 1 && isDone;

          return (
            <View key={idx} className="flex-row items-center">
              <View
                className="items-center justify-center"
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  backgroundColor: isDone ? "#3B82F6" : "#E5E7EB",
                  opacity: isFuture ? 0.5 : 1,
                }}
              >
                <Feather
                  color={isDone ? "#FFFFFF" : "#64748B"}
                  name="link-2"
                  size={iconSize}
                />
              </View>

              {idx < statuses.length - 1 && (
                <View
                  className="mx-1.5 h-0.5 w-[18px] rounded-sm"
                  style={{
                    backgroundColor: connectorActive ? "#93C5FD" : "#E5E7EB",
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
