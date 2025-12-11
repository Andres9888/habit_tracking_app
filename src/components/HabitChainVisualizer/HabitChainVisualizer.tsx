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
  currentStreak?: number;
  highContrastMode: boolean;
  isPartOfWeekComplete: boolean;
  visible: boolean;
}

/**
 * DayConnector - Visual link between consecutive completed days
 * Shows an enhanced horizontal line when both adjacent days are completed,
 * creating a visual "chain" effect for habit tracking.
 * 
 * Features:
 * - Progressive thickness based on streak length
 * - Enhanced visibility with gradient effects
 * - Golden highlight for complete weeks
 * - Celebration pulse when chain forms
 */
const DayConnector: React.FC<DayConnectorProps> = ({ 
  color, 
  currentStreak = 0,
  highContrastMode,
  isPartOfWeekComplete,
  visible 
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  // Enhanced fade in/out with scale animation
  useEffect(() => {
    if (visible) {
      // Celebration when chain link forms
      Animated.parallel([
        Animated.timing(opacity, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(scale, {
            friction: 5,
            tension: 200,
            toValue: 1.2,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            friction: 8,
            tension: 200,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(opacity, {
        duration: 150,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, opacity, scale]);

  // Subtle pulse for complete weeks
  useEffect(() => {
    if (isPartOfWeekComplete && visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            toValue: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(0);
    }
  }, [isPartOfWeekComplete, visible, pulseAnimation]);

  // Progressive thickness based on streak (2.5px base, up to 4px for long streaks)
  const getLineHeight = (): number => {
    if (currentStreak >= 30) return 4;
    if (currentStreak >= 14) return 3.5;
    if (currentStreak >= 7) return 3;
    return 2.5;
  };

  // Enhanced opacity for better visibility (60% base, 75% for complete weeks)
  const baseOpacity = isPartOfWeekComplete ? 0.75 : 0.6;
  
  // Golden glow for complete weeks
  const glowOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const lineHeight = getLineHeight();
  const lineColor = isPartOfWeekComplete && !highContrastMode 
    ? '#fbbf24' // Golden for complete weeks
    : color;

  return (
    <View className='relative items-center justify-center'>
      {/* Golden glow layer for complete weeks */}
      {isPartOfWeekComplete && !highContrastMode && (
        <Animated.View
          style={{
            backgroundColor: '#fef3c7',
            borderRadius: 2,
            height: lineHeight + 4,
            opacity: glowOpacity,
            position: 'absolute',
            width: 18,
          }}
        />
      )}
      
      {/* Main connector line */}
      <Animated.View
        style={{
          backgroundColor: lineColor,
          borderRadius: lineHeight / 2,
          height: lineHeight,
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, baseOpacity],
          }),
          transform: [{ scaleX: scale }],
          width: 14,
          // Subtle shadow for depth
          ...(visible && !highContrastMode && {
            shadowColor: lineColor,
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }),
        }}
      />
    </View>
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
  currentStreak?: number;
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
        <Check color='#ffffff' size={17} strokeWidth={2.5} />
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
  currentStreak?: number;
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
  currentStreak = 0,
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
                color={connectorColor} 
                currentStreak={currentStreak}
                highContrastMode={highContrastMode}
                isPartOfWeekComplete={isWeekComplete}
                visible={showConnector} 
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
