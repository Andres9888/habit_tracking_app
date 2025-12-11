import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View, Text } from 'react-native';
import { parse, format, getDay } from 'date-fns';
import { Check } from 'lucide-react-native';
import clsx from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitChainVisualizerLogic } from './HabitChainVisualizer.hooks';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { SparkleBurst } from '../microinteractions/SparkleBurst';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DayConnectorProps {
  accentColor: string;
  chainStrength: number; // 0-7 representing consecutive completed days
  isBroken: boolean; // Gap in the chain (missed day between completed days)
  visible: boolean;
}

/**
 * DayConnector - Enhanced visual chain link between consecutive days
 * 
 * Features:
 * - Thicker, more visible line (3px vs 1.5px)
 * - Accent color when chain is active
 * - Animated connection with spring physics
 * - Chain strength glow effect for longer streaks
 * - Dashed appearance for broken chains
 */
const DayConnector: React.FC<DayConnectorProps> = ({ 
  accentColor, 
  chainStrength,
  isBroken,
  visible, 
}) => {
  const scaleX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Animate connection/disconnection with spring physics
  useEffect(() => {
    if (visible) {
      // Chain connecting animation - satisfying spring
      Animated.parallel([
        Animated.spring(scaleX, {
          friction: 8,
          tension: 150,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 200,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect for strong chains (3+ consecutive)
      if (chainStrength >= 3) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowOpacity, {
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              toValue: 0.6,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              toValue: 0.2,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    } else {
      // Chain breaking animation
      Animated.parallel([
        Animated.spring(scaleX, {
          friction: 12,
          tension: 200,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 150,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
      glowOpacity.setValue(0);
    }
  }, [visible, chainStrength, scaleX, opacity, glowOpacity]);

  // Get chain color based on strength
  const getChainColor = () => {
    if (!visible) return '#d4d4d4'; // stone-300 for inactive
    if (chainStrength >= 5) return accentColor; // Full accent for strong chains
    if (chainStrength >= 3) return `${accentColor}CC`; // 80% opacity
    return `${accentColor}99`; // 60% opacity for new chains
  };

  const chainColor = getChainColor();

  return (
    <View className="items-center justify-center" style={{ width: 16 }}>
      {/* Glow layer for strong chains */}
      {chainStrength >= 3 && visible && (
        <Animated.View
          pointerEvents="none"
          style={{
            backgroundColor: accentColor,
            borderRadius: 3,
            height: 6,
            opacity: glowOpacity,
            position: 'absolute',
            shadowColor: accentColor,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
            width: 16,
          }}
        />
      )}

      {/* Main chain link line */}
      <Animated.View
        style={{
          backgroundColor: chainColor,
          borderRadius: 1.5,
          height: 3,
          opacity,
          transform: [{ scaleX }],
          width: 16,
        }}
      />

      {/* Broken chain indicator (dashed effect) */}
      {isBroken && !visible && (
        <View 
          className="absolute flex-row items-center justify-center" 
          style={{ width: 16 }}
        >
          <View style={{ backgroundColor: '#d4d4d4', borderRadius: 1, height: 2, width: 4 }} />
          <View style={{ width: 3 }} />
          <View style={{ backgroundColor: '#d4d4d4', borderRadius: 1, height: 2, width: 4 }} />
        </View>
      )}
    </View>
  );
};

interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  completed: boolean;
  currentStreak?: number;
  dayLabel: string;
  disabled: boolean;
  highContrastMode: boolean;
  isToday: boolean;
  onPress: () => void;
  showDayLabel?: boolean;
}

const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completed,
  currentStreak = 0,
  dayLabel,
  disabled,
  highContrastMode,
  isToday,
  onPress,
  showDayLabel = true,
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
          friction: 6,
          tension: 300,
          toValue: 1,
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
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.03,
            useNativeDriver: true,
          }),
          Animated.timing(breathingPulse, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
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
    let _brightnessAdjust = 0;
    if (hour >= 6 && hour < 12) _brightnessAdjust = 0.1; // Morning: brighter
    else if (hour >= 18 && hour < 24) _brightnessAdjust = -0.1; // Evening: darker

    // Streak-based saturation boost
    let _saturationBoost = 0;
    if (currentStreak >= 8 && currentStreak <= 30) _saturationBoost = 0.15;
    else if (currentStreak > 30) _saturationBoost = 0.3;

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
      friction: 20,
      tension: 300,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!completed) {
      Animated.spring(buttonScale, {
        friction: 20,
        tension: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    // Bounce up on tap
    Animated.sequence([
      Animated.spring(buttonScale, {
        friction: 6,
        tension: 300,
        toValue: 1.08,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        friction: 8,
        tension: 300,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <View className="items-center">
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        className={clsx(
          'h-9 w-9 items-center justify-center rounded-[10px]',
          !completed && 'border-2'
        )}
        disabled={disabled}
        style={{
          backgroundColor,
          borderColor: completed ? evolvedColor : borderColor,
          borderWidth: completed ? 0 : 2,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: buttonScale }, { scale: breathingPulse }],
          // Enhanced glow on completion - reward signal
          ...(completed && !highContrastMode && {
            elevation: 3,
            shadowColor: evolvedColor,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
          }),
          // Today indicator ring
          ...(isToday && !completed && {
            borderColor: `${accentColor}80`,
            borderWidth: 2.5,
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

      {/* Day label */}
      {showDayLabel && (
        <Text 
          className={clsx(
            'mt-1 text-[10px] font-medium',
            isToday ? 'text-stone-700' : 'text-stone-400'
          )}
          style={{
            letterSpacing: 0.3,
            ...(isToday && { fontWeight: '600' }),
          }}
        >
          {isToday ? 'TODAY' : dayLabel}
        </Text>
      )}
    </View>
  );
};

type HabitStatus = 'done' | 'missed' | 'planned';

// Day label abbreviations
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled: boolean;
  currentStreak?: number;
  habitId: Id<'habits'>;
  highContrastMode?: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference: boolean;
  showDayLabels?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

/**
 * Calculate chain strength at each position
 * Returns array of consecutive completion counts ending at each index
 */
const calculateChainStrengths = (weekStatus: HabitStatus[]): number[] => {
  const strengths: number[] = [];
  let currentStrength = 0;

  for (const status of weekStatus) {
    if (status === 'done') {
      currentStrength++;
    } else {
      currentStrength = 0;
    }
    strengths.push(currentStrength);
  }

  return strengths;
};

/**
 * Detect broken chains (gaps between completed days)
 */
const detectBrokenChains = (weekStatus: HabitStatus[]): boolean[] => {
  const broken: boolean[] = [];

  for (let i = 0; i < weekStatus.length - 1; i++) {
    // A chain is "broken" at position i if:
    // - Current day is missed AND there are completed days on both sides
    const hasCompletedBefore = weekStatus.slice(0, i + 1).includes('done');
    const hasCompletedAfter = weekStatus.slice(i + 1).includes('done');
    const isMissed = weekStatus[i] === 'missed';

    broken.push(isMissed && hasCompletedBefore && hasCompletedAfter);
  }

  return broken;
};

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled,
  currentStreak = 0,
  habitId,
  highContrastMode = false,
  onToggle,
  onWeekComplete,
  reduceMotionPreference,
  showDayLabels = true,
  weekDateStrings,
  weekStatus,
}) => {
  const { isFutureDate, isCompleted, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();

  const [activeBurst, setActiveBurst] = useState<string | null>(null);

  // Calculate chain strengths and broken positions
  const chainStrengths = useMemo(() => calculateChainStrengths(weekStatus), [weekStatus]);
  const brokenChains = useMemo(() => detectBrokenChains(weekStatus), [weekStatus]);

  // Check if week is complete for golden unification (used by parent component)
  const _isWeekComplete = weekStatus.every(status => status === 'done');

  // Get day label for each date
  const getDayLabel = useCallback((dateString: string): string => {
    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    const dayOfWeek = getDay(parsedDate); // 0 = Sunday, 6 = Saturday
    return DAY_LABELS[dayOfWeek];
  }, []);

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
    <View className='relative' style={{ paddingHorizontal: 2 }}>
      <View className='flex-row items-start justify-between'>
        {weekDateStrings.map((dateString, index) => {
          const completed = isCompleted(index);
          const disabled = isFutureDate(index);
          const dateLabel = dateLabels[index];
          const dayLabel = getDayLabel(dateString);
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
          
          // Chain strength is the minimum of current and next day's strength
          const chainStrength = showConnector 
            ? Math.min(chainStrengths[index], chainStrengths[index + 1])
            : 0;
          
          // Check if this position represents a broken chain
          const isBrokenChain = !isLastItem && brokenChains[index];

          return (
            <React.Fragment key={dateString}>
              <View className='items-center justify-center'>
                <HabitDayToggle
                  accentColor={accentColor}
                  accessibilityHint={accessibilityHint}
                  accessibilityLabel={accessibilityLabel}
                  completed={completed}
                  currentStreak={currentStreak}
                  dayLabel={dayLabel}
                  disabled={disabled}
                  highContrastMode={highContrastMode}
                  isToday={isToday(index)}
                  showDayLabel={showDayLabels}
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
                <View className="items-center justify-center" style={{ marginTop: 13 }}>
                  <DayConnector 
                    accentColor={accentColor}
                    chainStrength={chainStrength}
                    isBroken={isBrokenChain}
                    visible={showConnector} 
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
