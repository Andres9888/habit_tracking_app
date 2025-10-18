import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import clsx from "clsx";
import type { Id } from "../../../convex/_generated/dataModel";
import { HabitChainVisualizer } from "../HabitChainVisualizer";
import { useDraggableHabitLogic } from "./DraggableHabit.hooks";
import { Archive } from "lucide-react-native";
import type { StrengthLevel } from "../HabitStrengthIndicator";

// UI Constants
const MAX_GRADIENT_HEIGHT = 36; // Maximum height of strength gradient in pixels
const GRADIENT_OPACITY = 0.7; // Opacity of the strength gradient
const GRADIENT_ANIMATION_DURATION = 600; // Duration of gradient height animation in ms

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

  const strengthPercentage = Math.round((habit.strength || 0) * 100);
  const gradientHeight = useRef(
    new Animated.Value((habit.strength || 0) * MAX_GRADIENT_HEIGHT)
  ).current;

  useEffect(() => {
    Animated.timing(gradientHeight, {
      toValue: (habit.strength || 0) * MAX_GRADIENT_HEIGHT,
      duration: GRADIENT_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [habit.strength, gradientHeight]);

  const habitCard = (
    <Animated.View
      className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
      style={{
        opacity: fade,
        transform: [{ translateY }],
      }}
    >
      <View className="px-5 pt-5">
        {/* Header with icon, title and strength badge */}
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            {/* Icon container with shadow */}
            <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-sm">
              <Text className="text-[32px]">{emoji}</Text>
            </View>
            <View className="flex-col">
              <Text className="text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]">
                {name || habit.name}
              </Text>
              {streak > 0 && (
                <Text className="mt-1 text-xs font-semibold uppercase leading-4 tracking-wide text-[#ff6900]">
                  🔥 {streak} Day Streak
                </Text>
              )}
            </View>
          </View>
          {habit.strength !== undefined && habit.strength > 0 && (
            <View className="h-8 rounded-full bg-[#10b981] px-3 shadow-sm">
              <Text className="text-sm font-normal leading-8 tracking-[-0.15px] text-white">
                {strengthPercentage}%
              </Text>
            </View>
          )}
        </View>

        {/* Week status visualizer */}
        <View className="mb-5">
          <HabitChainVisualizer
            accentColor={accentColor}
            habitId={habit._id}
            onToggle={toggleHabit}
            weekDateStrings={weekDateStrings}
            weekStatus={weekStatus}
          />
        </View>
      </View>

      {/* Gradient fill based on habit strength - full width at bottom */}
      {habit.strength !== undefined && habit.strength > 0 && (
        <Animated.View
          style={{
            width: '100%',
            height: gradientHeight,
            opacity: GRADIENT_OPACITY,
          }}
        >
          <LinearGradient
            colors={['#fee685', '#fef3c6', '#fff7ed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.5, 1]}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>
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
