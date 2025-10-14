import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import clsx from "clsx";
import type { Id } from "../../../convex/_generated/dataModel";
import { HabitChainVisualizer } from "../HabitChainVisualizer";
import { useDraggableHabitLogic } from "./DraggableHabit.hooks";
import { Flame } from "lucide-react-native";

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
}

interface DraggableHabitProps {
  habit: Habit;
  isCompactMode?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<"habits">; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export default function DraggableHabit({
  habit,
  isCompactMode = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);
  const completedCount = weekStatus.filter((s) => s === "done").length;
  const completionRatio =
    weekStatus.length === 0 ? 0 : completedCount / weekStatus.length;
  const [trackWidth, setTrackWidth] = useState(0);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (trackWidth === 0) return;

    const minWidth = Math.min(trackWidth * 0.08, 14);
    const hasProgress = completionRatio > 0;
    const targetWidth = hasProgress
      ? Math.max(minWidth, completionRatio * trackWidth)
      : minWidth;

    Animated.timing(progressWidth, {
      toValue: targetWidth,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [completionRatio, progressWidth, trackWidth]);

  useEffect(() => {
    if (trackWidth === 0) return;
    const minWidth = Math.min(trackWidth * 0.08, 14);
    progressWidth.setValue(
      completionRatio > 0
        ? Math.max(minWidth, completionRatio * trackWidth)
        : minWidth
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackWidth]);

  return (
    <Animated.View
      className={clsx(
        "rounded-2xl border border-[#e5e7eb] bg-white",
        isCompactMode ? "gap-4 px-[21px] pb-[1px] pt-[21px]" : "gap-4 px-[21px] pb-[1px] pt-[21px]"
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

      <View
        className="h-[6px] w-full overflow-hidden rounded-full bg-[#f3f4f6]"
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          className="h-full rounded-full"
          style={{
            backgroundColor: accentColor,
            width: progressWidth,
          }}
        />
      </View>
    </Animated.View>
  );
}
