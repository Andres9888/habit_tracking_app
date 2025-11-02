import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { parse, format } from 'date-fns';
import { Check } from 'lucide-react-native';
import clsx from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitChainVisualizerLogic } from './HabitChainVisualizer.hooks';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { SparkleBurst } from '../microinteractions/SparkleBurst';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayConnectorProps {
  color: string;
  visible: boolean;
}

/**
 * DayConnector - Visual link between consecutive completed days
 * Shows a horizontal gray line when both adjacent days are completed,
 * creating a visual "chain" effect for habit tracking.
 */
const DayConnector: React.FC<DayConnectorProps> = ({ color, visible }) => {
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
        backgroundColor: color,
        height: 1,
        opacity: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.4], // Reduced from full opacity to 40% for premium subtlety
        }),
        width: 12,
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
  highContrastMode: boolean;
}

const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  disabled,
  onPress,
  completed,
  isToday,
  highContrastMode,
}) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (completed) {
      // PREMIUM ANIMATION: Simple, polished bounce
      Animated.parallel([
        // Gentle bounce - iOS native feel
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 6,
          tension: 300,
          useNativeDriver: true,
        }),

        // Checkmark smooth scale-in
        Animated.timing(completion, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Gentle fade out
      Animated.timing(completion, {
        duration: 150,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [completed, completion, buttonScale]);

  // Premium design: uncompleted boxes have warm gray bg with soft border
  const backgroundColor = completed
    ? accentColor
    : highContrastMode
      ? '#000000'
      : '#f5f5f5'; // Warm gray instead of white

  const borderColor = highContrastMode ? '#facc15' : '#6b7280'; // Softer gray instead of dark

  // Press feedback handlers
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 20,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!completed) {
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 20,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    // Bounce up on tap
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 1.08,
        friction: 6,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 8,
        tension: 300,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className={clsx(
        'h-7 w-7 items-center justify-center rounded-[7px]',
        !completed && 'border-2'
      )}
      disabled={disabled}
      style={{
        backgroundColor,
        borderColor: completed ? accentColor : borderColor,
        borderWidth: completed ? 0 : 2,
        opacity: disabled ? 0.5 : 1,
        transform: [{ scale: buttonScale }],
      }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Checkmark - clean and simple */}
      <Animated.View
        style={{
          opacity: completion,
          transform: [
            {
              scale: completion.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
        }}
      >
        <Check color='#ffffff' size={14} strokeWidth={2.5} />
      </Animated.View>
    </AnimatedPressable>
  );
};

type HabitStatus = 'done' | 'missed' | 'planned';

interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled: boolean;
  highContrastMode?: boolean;
  habitId: Id<'habits'>;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled,
  highContrastMode = false,
  habitId,
  onWeekComplete,
  onToggle,
  reduceMotionPreference,
  weekDateStrings,
  weekStatus,
}) => {
  const { isFutureDate, isCompleted, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();

  const connectorColor = highContrastMode ? '#facc15' : '#e0e0e0';
  const [activeBurst, setActiveBurst] = useState<string | null>(null);

  const {
    triggerSelection,
    triggerSuccess,
  } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const shouldReduceMotion = useMemo(
    () => reduceMotionPreference || !celebrationsEnabled,
    [celebrationsEnabled, reduceMotionPreference]
  );

  const dateLabels = useMemo(
    () =>
      weekDateStrings.map((dateString) => {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'MMM d, EEE').toUpperCase();
      }),
    [weekDateStrings]
  );

  const handleToggleDay = useCallback(
    (
      dateString: string,
      completed: boolean,
      disabled: boolean,
      index: number
    ) => {
      if (disabled) {
        triggerSelection();
        return;
      }

      const isTogglingToComplete = !completed;
      const willCompleteWeek =
        isTogglingToComplete &&
        weekStatus.every((status, statusIndex) =>
          statusIndex === index ? true : status === 'done'
        );

      if (completed || !celebrationsEnabled) {
        triggerSelection();
      } else {
        triggerSuccess();
        // Only show sparkles for week completion (premium feel)
        if (willCompleteWeek) {
          setActiveBurst(dateString);
        }
      }

      onToggle({ date: dateString, habitId });

      if (willCompleteWeek) {
        onWeekComplete?.({ completedDate: dateString });
      }
    },
    [
      celebrationsEnabled,
      habitId,
      onToggle,
      onWeekComplete,
      triggerSelection,
      triggerSuccess,
      weekStatus,
    ]
  );

  return (
    <View className='flex-row items-center justify-between'>
      {weekDateStrings.map((dateString, index) => {
        const completed = isCompleted(index);
        const disabled = isFutureDate(index);
        const dateLabel = dateLabels[index];
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
        const showConnector =
          !isLastItem && completed && isCompleted(index + 1);

        return (
          <React.Fragment key={dateString}>
            <View className='items-center justify-center'>
              <HabitDayToggle
                accentColor={accentColor}
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel}
                completed={completed}
                disabled={disabled}
                highContrastMode={highContrastMode}
                isToday={isToday(index)}
                onPress={() =>
                  handleToggleDay(dateString, completed, disabled, index)
                }
              />
              <SparkleBurst
                color={accentColor}
                isActive={activeBurst === dateString && celebrationsEnabled}
                reduceMotion={shouldReduceMotion}
                onComplete={() => setActiveBurst(null)}
              />
            </View>
            {!isLastItem && (
              <DayConnector color={connectorColor} visible={showConnector} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
