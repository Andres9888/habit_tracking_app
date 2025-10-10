import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

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
export default function StreakChain({ label, statuses, size = 28 }: StreakChainProps) {
  const circleSize = size;
  const iconSize = Math.max(12, Math.floor(circleSize * 0.55));

  // Compute current streak (consecutive "done" from end)
  let streakDays = 0;
  for (let i = statuses.length - 1; i >= 0; i -= 1) {
    if (statuses[i] === "done") streakDays += 1; else break;
  }

  return (
    <View className="pt-1 pb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-bold text-slate-900 tracking-tight">{label}</Text>
        <View className="px-2.5 py-1 rounded-full bg-indigo-50" accessibilityLabel={`${streakDays} days`}>
          <Text className="text-xs text-slate-900 font-semibold">{streakDays} days</Text>
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
                <Feather name="link-2" size={iconSize} color={isDone ? "#FFFFFF" : "#64748B"} />
              </View>

              {idx < statuses.length - 1 && (
                <View
                  className="w-[18px] h-0.5 mx-1.5 rounded-sm"
                  style={{ backgroundColor: connectorActive ? "#93C5FD" : "#E5E7EB" }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
