import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import clsx from "clsx";
import type { Id } from "../../../convex/_generated/dataModel";
import { HabitChainVisualizer } from "../HabitChainVisualizer";
import { useDraggableHabitLogic } from "./DraggableHabit.hooks";
import { Flame, Archive } from "lucide-react-native";
import { HabitStrengthIndicator, type StrengthLevel } from "../HabitStrengthIndicator";

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
  strength?: number;
  strengthLevel?: StrengthLevel;
  strengthUpdatedAt?: number;
}

interface DraggableHabitProps {
  habit: Habit;
  isCompactMode?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  onArchive?: (habitId: Id<"habits">) => void;
}

export default function DraggableHabit({
  habit,
  isCompactMode = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
  onArchive,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);
  const completedCount = weekStatus.filter((s) => s === "done").length;

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translateY]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        className="flex-row items-center justify-end"
        style={{ transform: [{ translateX: trans }] }}
      >
        <View className="h-full w-[100px] items-center justify-center rounded-r-2xl bg-red-500">
          <Archive color="white" size={24} />
          <Text className="mt-1 text-xs font-semibold text-white">Archive</Text>
        </View>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = () => {
    if (onArchive) {
      onArchive(habit._id);
    }
  };

  const habitCard = (
    <Animated.View
      className={clsx(
        "rounded-2xl border border-[#e5e7eb] bg-white",
        isCompactMode ? "gap-4 px-[21px] pb-4 pt-[21px]" : "gap-4 px-[21px] pb-4 pt-[21px]"
      )}
      style={{
        opacity: fade,
        transform: [{ translateY }],
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text className="text-[30px] leading-9">{emoji}</Text>
          <Text className="text-[17px] font-semibold leading-[25.5px] tracking-[-0.43px] text-[#0f172a]">
            {name || habit.name}
          </Text>
        </View>
        <Text className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#6a7282]">
          {completedCount}/{weekStatus.length}
        </Text>
      </View>

      <HabitChainVisualizer
        accentColor={accentColor}
        habitId={habit._id}
        onToggle={toggleHabit}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />

      {/* Habit Strength Indicator */}
      {habit.strength !== undefined && habit.strength > 0 && (
        <View className="pt-1">
          <HabitStrengthIndicator
            strength={habit.strength}
            strengthLevel={habit.strengthLevel}
            compact={true}
            showLabel={false}
          />
        </View>
      )}
    </Animated.View>
  );

  if (!onArchive) {
    return habitCard;
  }

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeableOpen}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      {habitCard}
    </Swipeable>
  );
}
