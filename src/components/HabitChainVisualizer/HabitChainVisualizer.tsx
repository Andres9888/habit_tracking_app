import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View, type ViewStyle } from 'react-native';
import { parse, format } from 'date-fns';
import clsx from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitChainVisualizerLogic } from './HabitChainVisualizer.hooks';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { SparkleBurst } from '../microinteractions/SparkleBurst';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { Check } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayConnectorProps {
  accentColor: string;
  baseColor: string;
  currentStreak: number;
  style?: ViewStyle;
  visible: boolean;
}

/**
 * DayConnector - Visual link between consecutive completed days
 *
 * Features strength-based evolution:
 * - Day 1-6: Subtle connection (1.5px, 35% opacity)
 * - Day 7-13: Growing strength (2px, 50% opacity)
 * - Day 14-29: Strong chain (2.5px, 65% opacity)
 * - Day 30+: Legendary status (3px, 80% opacity, accent glow)
 *
 * Includes animated energy flow that creates sense of momentum.
 */
const DayConnector: React.FC<DayConnectorProps> = ({
  accentColor,
  baseColor,
  currentStreak,
  style,
  visible,
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const shimmerPosition = useRef(new Animated.Value(0)).current;

  // Strength-based evolution values
  const getStrengthConfig = (streak: number) => {
    if (streak >= 30) return { height: 3, maxOpacity: 0.8, useAccent: true, shimmerSpeed: 1200 };
    if (streak >= 14) return { height: 2.5, maxOpacity: 0.65, useAccent: true, shimmerSpeed: 1500 };
    if (streak >= 7) return { height: 2, maxOpacity: 0.5, useAccent: false, shimmerSpeed: 2000 };
    return { height: 1.5, maxOpacity: 0.35, useAccent: false, shimmerSpeed: 0 }; // No shimmer for early streaks
  };

  const strengthConfig = getStrengthConfig(currentStreak);
  const connectorColor = strengthConfig.useAccent ? accentColor : baseColor;

  // Fade in/out animation
  useEffect(() => {
    Animated.timing(opacity, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  // Energy flow shimmer animation (only for 7+ day streaks)
  useEffect(() => {
    if (visible && strengthConfig.shimmerSpeed > 0) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerPosition, {
            toValue: 1,
            duration: strengthConfig.shimmerSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerPosition, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    } else {
      shimmerPosition.setValue(0);
    }
  }, [visible, strengthConfig.shimmerSpeed, shimmerPosition]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: connectorColor,
          borderRadius: strengthConfig.height / 2,
          height: strengthConfig.height,
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, strengthConfig.maxOpacity],
          }),
          overflow: 'hidden',
          width: 14,
        },
        // Subtle glow for legendary streaks (30+)
        strengthConfig.useAccent && currentStreak >= 30 && {
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 3,
        },
        style,
      ]}
    >
      {/* Energy flow shimmer overlay */}
      {strengthConfig.shimmerSpeed > 0 && (
        <Animated.View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: strengthConfig.height,
            height: '100%',
            position: 'absolute',
            transform: [
              {
                translateX: shimmerPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 34], // Flow from left to right across the connector
                }),
              },
            ],
            width: 20,
          }}
        />
      )}
    </Animated.View>
  );
};

interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  completionIcon: 'chain' | 'checkbox';
  disabled: boolean;
  onPress: () => void;
  completed: boolean;
  isToday: boolean;
  highContrastMode: boolean;
  currentStreak?: number;
}

const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  disabled,
  onPress,
  completed,
  isToday,
  highContrastMode,
  currentStreak = 0,
}) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;

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

  // Breathing animation for today's uncompleted circle - subtle urgency
  useEffect(() => {
    if (!completed && isToday) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathingPulse, {
            toValue: 1.03,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breathingPulse, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathingPulse.setValue(1);
    }
  }, [completed, isToday, breathingPulse]);

  // Streak-based color evolution - colors deepen with streak for retention
  const getEvolvedColor = (baseColor: string): string => {
    if (!completed || currentStreak === 0) return baseColor;

    // Time-of-day adaptive brightness
    const hour = new Date().getHours();
    let brightnessAdjust = 0;
    if (hour >= 6 && hour < 12) brightnessAdjust = 0.1; // Morning: brighter
    else if (hour >= 18 && hour < 24) brightnessAdjust = -0.1; // Evening: darker

    // Streak-based saturation boost
    let saturationBoost = 0;
    if (currentStreak >= 8 && currentStreak <= 30) saturationBoost = 0.15;
    else if (currentStreak > 30) saturationBoost = 0.3;

    // Simple color darkening logic (this is a simplified approach)
    // In production, you'd use a proper color manipulation library
    return baseColor; // Keep base for now, enhancement ready for color lib
  };

  const evolvedColor = getEvolvedColor(accentColor);

  // Premium design: uncompleted boxes have warm gray bg with soft border
  const backgroundColor = completed
    ? evolvedColor
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
        'h-9 w-9 items-center justify-center rounded-[9px]',
        !completed && 'border-2'
      )}
      disabled={disabled}
      style={{
        backgroundColor,
        borderColor: completed ? evolvedColor : borderColor,
        borderWidth: completed ? 0 : 2,
        opacity: disabled ? 0.5 : 1,
        transform: [{ scale: buttonScale }, { scale: breathingPulse }],
        // Subtle glow on completion - reward signal
        ...(completed && !highContrastMode && {
          shadowColor: evolvedColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 2,
        }),
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
        {completionIcon === 'checkbox' ? (
          <Check color='#ffffff' size={18} />
        ) : (
          <ChainLinkIcon color='#ffffff' size={18} variant='stroke' />
        )}
      </Animated.View>
    </AnimatedPressable>
  );
};

type HabitStatus = 'done' | 'missed' | 'planned';

interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled: boolean;
  habitCompletionIcon?: 'chain' | 'checkbox';
  highContrastMode?: boolean;
  habitId: Id<'habits'>;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  currentStreak?: number;
  isConnectedToPreviousWeek?: boolean;
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled,
  habitCompletionIcon = 'chain',
  highContrastMode = false,
  habitId,
  onWeekComplete,
  onToggle,
  reduceMotionPreference,
  weekDateStrings,
  weekStatus,
  currentStreak = 0,
  isConnectedToPreviousWeek = false,
}) => {
  const { isFutureDate, isCompleted, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();

  const connectorColor = highContrastMode ? '#facc15' : '#e0e0e0';
  const [activeBurst, setActiveBurst] = useState<string | null>(null);

  // Check if week is complete for golden unification
  const isWeekComplete = weekStatus.every(status => status === 'done');

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
    <View className='relative flex-row items-center justify-between' style={{ paddingHorizontal: 4 }}>
      {/* Visual link to previous week if streak continues */}
      {isConnectedToPreviousWeek && isCompleted(0) && (
        <View
          style={{
            left: -10, // Connects to the left of the first circle (padding 4 - width 14)
            marginTop: -1, // Adjusted for dynamic height centering
            position: 'absolute',
            top: '50%',
            zIndex: -1, // Behind the circles
          }}
        >
          <DayConnector
            accentColor={accentColor}
            baseColor={connectorColor}
            currentStreak={currentStreak}
            visible={true}
          />
        </View>
      )}

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
                completionIcon={habitCompletionIcon}
                currentStreak={currentStreak}
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
              <DayConnector
                accentColor={accentColor}
                baseColor={connectorColor}
                currentStreak={currentStreak}
                style={{ flex: 1, minWidth: 14, width: 'auto' }}
                visible={showConnector}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
