import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { parse, format } from "date-fns";
import { Check } from "lucide-react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useHabitChainVisualizerLogic } from "./HabitChainVisualizer.hooks";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
  completed: boolean;
}

const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  disabled,
  onPress,
  completed,
}) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(completion, {
      toValue: completed ? 1 : 0,
      duration: completed ? 220 : 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [completed, completion]);

  const backgroundColor = completion.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e5e7eb", accentColor],
  });

  const scale = completion.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className="h-10 w-10 items-center justify-center rounded-full"
      disabled={disabled}
      onPress={onPress}
      style={{
        opacity: disabled ? 0.4 : 1,
        backgroundColor,
        transform: [{ scale }],
      }}
    >
      <Animated.View
        style={{
          opacity: completion,
          transform: [
            {
              scale: completion.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
            },
          ],
        }}
      >
        <Check color="#ffffff" size={16} strokeWidth={2.25} />
      </Animated.View>
    </AnimatedPressable>
  );
};

type HabitStatus = "done" | "missed" | "planned";

interface HabitChainVisualizerProps {
  accentColor: string;
  habitId: Id<"habits">;
  onToggle: (args: { habitId: Id<"habits">; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  habitId,
  onToggle,
  weekDateStrings,
  weekStatus,
}) => {
  const { isFutureDate, isCompleted } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), "MMM d, EEE").toUpperCase();

  return (
    <View className="flex-row items-center justify-between gap-3">
      {weekDateStrings.map((dateString, index) => {
        const completed = isCompleted(index);
        const disabled = isFutureDate(index);

        const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
        const dateLabel = format(parsedDate, "MMM d, EEE").toUpperCase();
        const statusLabel = completed ? "Completed" : "Not completed";
        const toggleInstruction = `Tap to toggle completion for ${dateLabel}`;
        const accessibilityLabel =
          dateLabel === todayLabel
            ? `Today, ${statusLabel}`
            : `${dateLabel}: ${statusLabel}`;
        const accessibilityHint = disabled
          ? "Future dates are unavailable"
          : toggleInstruction;

        return (
          <HabitDayToggle
            key={dateString}
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accentColor={accentColor}
            completed={completed}
            disabled={disabled}
            onPress={() => onToggle({ date: dateString, habitId })}
          />
        );
      })}
    </View>
  );
};
