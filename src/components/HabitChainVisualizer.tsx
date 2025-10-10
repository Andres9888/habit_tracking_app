import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChainLinkIcon } from './ChainLinkIcon';
import type { Id } from '../../convex/_generated/dataModel';
import clsx from 'clsx';

type HabitStatus = 'done' | 'missed' | 'planned';

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
  const renderConnectingLine = (index: number): boolean => {
    // Show connecting line if current day is done AND next day is done
    return (
      index < weekStatus.length - 1 &&
      weekStatus[index] === 'done' &&
      weekStatus[index + 1] === 'done'
    );
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center h-10">
        {weekStatus.map((status, index) => {
          const isCompleted = status === 'done';
          const showLine = renderConnectingLine(index);

          const dayLabel = `Day ${index + 1}`;
          const statusLabel = isCompleted ? 'Completed' : 'Not completed';
          const accessibilityLabel = `${dayLabel}: ${statusLabel}`;
          const accessibilityHint = 'Tap to toggle completion for this day';

          return (
            <View key={index} className="flex-row items-center">
              <Pressable
                className={clsx(
                  "w-10 h-10 rounded-full items-center justify-center",
                  isCompleted ? "bg-[#48bb78]" : "bg-[#dde3ed]"
                )}
                onPress={() => onToggle({ habitId, date: weekDateStrings[index] })}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole="button"
              >
                {isCompleted && (
                  <View className="items-center justify-center">
                    <ChainLinkIcon color="#ffffff" size={16} />
                  </View>
                )}
              </Pressable>
              {showLine && <View className="w-[22px] h-0.5 bg-[#48bb78]" />}
            </View>
          );
        })}
      </View>

      {streak > 0 && (
        <Text className="text-xs font-semibold tracking-wider text-[#a0aec0] uppercase">
          STREAK • {streak} DAYS
        </Text>
      )}
    </View>
  );
};
