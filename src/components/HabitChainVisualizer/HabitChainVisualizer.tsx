import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { parse, format } from 'date-fns';
import { Check } from 'lucide-react-native';
import clsx from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitChainVisualizerLogic } from './HabitChainVisualizer.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayConnectorProps {
  visible: boolean;
}

/**
 * DayConnector - Visual link between consecutive completed days
 * Shows a horizontal gray line when both adjacent days are completed,
 * creating a visual "chain" effect for habit tracking.
 */
const DayConnector: React.FC<DayConnectorProps> = ({ visible }) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View
      style={{
        backgroundColor: '#e0e0e0',
        height: 1,
        opacity,
        width: 10,
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
  isToday,
}) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(completion, {
      duration: completed ? 220 : 180,
      easing: Easing.out(Easing.cubic),
      toValue: completed ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [completed, completion]);

  // For Figma design: future/uncompleted boxes have white bg with border
  const backgroundColor = completed
    ? accentColor
    : '#ffffff';

  const scale = completion.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className={clsx(
        'h-12 w-12 items-center justify-center rounded-[12px]',
        !completed && 'border-2 border-[#1a1a1a]'
      )}
      disabled={disabled}
      style={{
        backgroundColor,
        opacity: disabled ? 0.5 : 1,
        transform: [{ scale }],
      }}
      onPress={onPress}
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
        <Check color='#ffffff' size={18} strokeWidth={2.5} />
      </Animated.View>
    </AnimatedPressable>
  );
};

type HabitStatus = 'done' | 'missed' | 'planned';

interface HabitChainVisualizerProps {
  accentColor: string;
  habitId: Id<'habits'>;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
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

        const isLastItem = index === weekDateStrings.length - 1;
        // Show connector line only when both current and next day are completed
        const showConnector = !isLastItem && completed && isCompleted(index + 1);

        return (
          <React.Fragment key={dateString}>
            <HabitDayToggle
              accentColor={accentColor}
              accessibilityHint={accessibilityHint}
              accessibilityLabel={accessibilityLabel}
              completed={completed}
              disabled={disabled}
              isToday={isToday(index)}
              onPress={() => onToggle({ date: dateString, habitId })}
            />
            {!isLastItem && <DayConnector visible={showConnector} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};
