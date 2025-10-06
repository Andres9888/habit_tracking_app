import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.pill} accessibilityLabel={`${streakDays} days`}>
          <Text style={styles.pillText}>{streakDays} days</Text>
        </View>
      </View>

      <View style={styles.chainRow}>
        {statuses.map((status, idx) => {
          const isDone = status === "done";
          const isFuture = status === "planned"; // treat planned as future/disabled
          const connectorActive = idx < statuses.length - 1 && isDone;

          return (
            <View key={idx} style={styles.chainItem}>
              <View
                style={[
                  styles.circle,
                  {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    backgroundColor: isDone ? "#3B82F6" : "#E5E7EB",
                    opacity: isFuture ? 0.5 : 1,
                  },
                ]}
              >
                <Feather name="link-2" size={iconSize} color={isDone ? "#FFFFFF" : "#64748B"} />
              </View>

              {idx < statuses.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: connectorActive ? "#93C5FD" : "#E5E7EB" },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  pillText: {
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "600",
  },
  chainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chainItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  connector: {
    width: 18,
    height: 3,
    marginHorizontal: 6,
    borderRadius: 2,
  },
});
