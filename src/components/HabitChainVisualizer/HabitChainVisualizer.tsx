import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { parse, format } from "date-fns";
import { Check } from "lucide-react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useHabitChainVisualizerLogic } from "./HabitChainVisualizer.hooks";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayConnectorProps {
  accentColor: string;
  visible: boolean;
}

/**
 * DayConnector - Visual link between consecutive completed days
 * Shows a horizontal bar when both adjacent days are completed,
 * creating a visual "chain" effect for habit tracking.
 */
const DayConnector: React.FC<DayConnectorProps> = ({ accentColor, visible }) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View
      style={{
        width: 12,
        height: 4,
        backgroundColor: accentColor,
        borderRadius: 2,
        opacity,
      }}
    />
  );
};

interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
  completed: boolean;
  isToday: boolean;
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
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className={clsx(
        'h-12 w-12 items-center justify-center rounded-2xl shadow-sm',
        isToday && 'border-2 border-black'
      )}
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
        <Check color="#ffffff" size={20} strokeWidth={2.25} />
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
  const { isFutureDate, isCompleted, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();

  return (
    <View className='flex-row items-center justify-between'>
      {weekDateStrings.map((dateString, index) => {
        const completed = isCompleted(index);
        const disabled = isFutureDate(index);

        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        const dateLabel = format(parsedDate, 'MMM d, EEE').toUpperCase();
        const statusLabel = completed ? 'Completed' : 'Not completed';
        const toggleInstruction = `Tap to toggle completion for ${dateLabel}`;
        const accessibilityLabel =
          dateLabel === todayLabel
            ? `Today, ${statusLabel}`
            : `${dateLabel}: ${statusLabel}`;
        const accessibilityHint = disabled
          ? 'Future dates are unavailable'
          : toggleInstruction;

        // Check if this day and the next day are both completed (for connector)
        const showConnector =
          index < weekDateStrings.length - 1 &&
          isCompleted(index) &&
          isCompleted(index + 1);

        return (
          <React.Fragment key={dateString}>
            <HabitDayToggle
              accessibilityHint={accessibilityHint}
              accessibilityLabel={accessibilityLabel}
              accentColor={accentColor}
              completed={completed}
              disabled={disabled}
              isToday={isToday(index)}
              onPress={() => onToggle({ date: dateString, habitId })}
            />
            {index < weekDateStrings.length - 1 && (
              <DayConnector accentColor={accentColor} visible={showConnector} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
