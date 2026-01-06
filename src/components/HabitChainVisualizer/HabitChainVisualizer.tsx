import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  View,
  type ViewStyle,
} from 'react-native';
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
 * - Day 1-2: Subtle connection (1.5px, 35% opacity)
 * - Day 3-4: Growing strength (1.8px, 45% opacity)
 * - Day 5-6: Stronger chain (2.1px, 55% opacity, accent glow begins)
 * - Day 7-13: Strong chain (2.4px, 65% opacity, accent glow)
 * - Day 14-20: Very strong (2.7px, 75% opacity, accent glow)
 * - Day 21+: Legendary status (3px, 85% opacity, accent glow)
 */
const getStrengthConfig = (streak: number) => {
  if (streak >= 21)
    return { height: 3, maxOpacity: 0.85, shimmerSpeed: 1000, useAccent: true };
  if (streak >= 14)
    return {
      height: 2.7,
      maxOpacity: 0.75,
      shimmerSpeed: 1200,
      useAccent: true,
    };
  if (streak >= 7)
    return {
      height: 2.4,
      maxOpacity: 0.65,
      shimmerSpeed: 1500,
      useAccent: true,
    };
  if (streak >= 5)
    return {
      height: 2.1,
      maxOpacity: 0.55,
      shimmerSpeed: 2000,
      useAccent: true,
    };
  if (streak >= 3)
    return { height: 1.8, maxOpacity: 0.45, shimmerSpeed: 0, useAccent: false };
  return { height: 1.5, maxOpacity: 0.35, shimmerSpeed: 0, useAccent: false };
};

const DayConnector: React.FC<DayConnectorProps> = ({
  accentColor,
  baseColor,
  currentStreak,
  style,
  visible,
}) => {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const shimmerPosition = useRef(new Animated.Value(0)).current;

  const strengthConfig = getStrengthConfig(currentStreak);
  const connectorColor = strengthConfig.useAccent ? accentColor : baseColor;

  useEffect(() => {
    const opacityAnimation = Animated.timing(opacity, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });
    opacityAnimation.start();

    return () => {
      opacityAnimation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- opacity is a stable ref from useRef
  }, [visible]);

  useEffect(() => {
    if (visible && strengthConfig.shimmerSpeed > 0) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerPosition, {
            duration: strengthConfig.shimmerSpeed,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerPosition, {
            duration: 0,
            toValue: 0,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    } else {
      shimmerPosition.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shimmerPosition is a stable ref from useRef
  }, [visible, strengthConfig.shimmerSpeed]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: connectorColor,
          borderRadius: strengthConfig.height / 2,
          height: strengthConfig.height,
          minWidth: 14,
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, strengthConfig.maxOpacity],
          }),
          overflow: 'hidden',
        },
        strengthConfig.useAccent &&
          currentStreak >= 30 && {
            shadowColor: accentColor,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
          },
        style,
      ]}
    >
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
                  outputRange: [-20, 34],
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

type DayShape = 'circle' | 'square';
type CompletionIcon = 'chain' | 'checkbox';

interface HabitDayToggleProps {
  accentColor: string;
  accessibilityHint?: string;
  accessibilityLabel: string;
  completionIcon: CompletionIcon;
  completed: boolean;
  currentStreak?: number;
  disabled: boolean;
  highContrastMode: boolean;
  isToday: boolean;
  onPress: () => void;
  shape: DayShape;
}

const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  completed,
  currentStreak = 0,
  disabled,
  highContrastMode,
  isToday,
  onPress,
  shape,
}) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;

  // Combine scale values using Animated.multiply to avoid multiple scale transforms
  // which can cause the second to override the first in some React Native versions
  const combinedScale = useMemo(
    () => Animated.multiply(buttonScale, breathingPulse),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- buttonScale and breathingPulse are stable refs from useRef
    []
  );

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    animation = completed
      ? Animated.parallel([
          Animated.spring(buttonScale, {
            friction: 6,
            tension: 300,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(completion, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      : Animated.timing(completion, {
          duration: 150,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        });

    animation.start();

    return () => {
      animation?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion & buttonScale are stable refs from useRef
  }, [completed]);

  useEffect(() => {
    if (!completed && isToday) {
      const breathingAnimation = Animated.loop(
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
      );
      breathingAnimation.start();

      return () => {
        breathingAnimation.stop();
      };
    } else {
      breathingPulse.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- breathingPulse is a stable ref from useRef
  }, [completed, isToday]);

  const backgroundColor = completed
    ? accentColor
    : highContrastMode
      ? '#000000'
      : '#f5f5f5';
  const borderColor = highContrastMode ? '#facc15' : '#78716c';

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

  const isCircle = shape === 'circle';
  const borderRadius = isCircle ? 20 : 9;

  // Warm golden glow color for today's habit (softer amber)
  const goldenGlowColor = '#FBBF24'; // amber-400 - warmer, softer

  return (
    <Animated.View
      style={
        isToday
          ? {
              borderRadius: borderRadius + 3,
              elevation: 4,
              shadowColor: goldenGlowColor,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
            }
          : undefined
      }
    >
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        className={clsx(
          'h-9 w-9 items-center justify-center',
          !completed && 'border-2'
        )}
        disabled={disabled}
        style={{
          backgroundColor,
          borderColor: completed
            ? accentColor
            : isToday
              ? goldenGlowColor
              : borderColor,
          borderRadius,
          borderWidth: completed ? 0 : 2,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: combinedScale }],
          ...(completed &&
            !highContrastMode && {
              elevation: 2,
              shadowColor: isToday ? goldenGlowColor : accentColor,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }),
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
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
            <Check color='#ffffff' size={20} strokeWidth={2.25} />
          ) : (
            <ChainLinkIcon color='#ffffff' size={20} variant='stroke' />
          )}
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
};

type HabitStatus = 'done' | 'missed' | 'planned';

interface HabitChainVisualizerProps {
  accentColor: string;
  celebrationsEnabled?: boolean;
  completionIcon?: CompletionIcon;
  currentStreak?: number;
  habitId: Id<'habits'>;
  highContrastMode?: boolean;
  isConnectedToPreviousWeek?: boolean;
  onToggle: (args: { habitId: Id<'habits'>; date: string }) => void;
  onWeekComplete?: (args: { completedDate: string }) => void;
  reduceMotionPreference?: boolean;
  shape?: DayShape;
  showConnectors?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export const HabitChainVisualizer: React.FC<HabitChainVisualizerProps> = ({
  accentColor,
  celebrationsEnabled = true,
  completionIcon = 'chain',
  currentStreak = 0,
  habitId,
  highContrastMode = false,
  isConnectedToPreviousWeek = false,
  onToggle,
  onWeekComplete,
  reduceMotionPreference = false,
  shape = 'square',
  showConnectors = true,
  weekDateStrings,
  weekStatus,
}) => {
  const { isCompleted, isFutureDate, isToday } = useHabitChainVisualizerLogic(
    weekDateStrings,
    weekStatus
  );
  const todayLabel = format(new Date(), 'MMM d, EEE').toUpperCase();
  const connectorColor = highContrastMode ? '#facc15' : '#e0e0e0';
  const [activeBurst, setActiveBurst] = useState<string | null>(null);

  // Use ref to always access latest weekStatus in callbacks (avoids stale closure issues)
  const weekStatusRef = useRef(weekStatus);
  weekStatusRef.current = weekStatus;

  const { triggerSelection, triggerSuccess } = useHapticFeedback({
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
      // Use ref to get latest weekStatus, avoiding stale closure issues with rapid taps
      const currentWeekStatus = weekStatusRef.current;
      const willCompleteWeek =
        isTogglingToComplete &&
        currentWeekStatus.every((status, statusIndex) =>
          statusIndex === index ? true : status === 'done'
        );

      if (completed || !celebrationsEnabled) {
        triggerSelection();
      } else {
        triggerSuccess();
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
    ]
  );

  return (
    <View className='flex-row items-center justify-between'>
      {/* Visual link to previous week if streak continues */}
      {showConnectors && isConnectedToPreviousWeek && isCompleted(0) && (
        <View
          style={{
            left: -10,
            marginTop: -1,
            position: 'absolute',
            top: '50%',
            zIndex: -1,
          }}
        >
          <DayConnector
            visible
            accentColor={accentColor}
            baseColor={connectorColor}
            currentStreak={currentStreak}
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
        const showConnector =
          showConnectors && !isLastItem && completed && isCompleted(index + 1);

        return (
          <View key={dateString} className='relative flex-1 items-center'>
            <HabitDayToggle
              accentColor={accentColor}
              accessibilityHint={accessibilityHint}
              accessibilityLabel={accessibilityLabel}
              completed={completed}
              completionIcon={completionIcon}
              currentStreak={currentStreak}
              disabled={disabled}
              highContrastMode={highContrastMode}
              isToday={isToday(index)}
              shape={shape}
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
            {/* Connector to next day - positioned to span from this circle to next */}
            {showConnector && (
              <View
                pointerEvents='none'
                style={{
                  // Extend 18px into next flex-1 container
                  height: 3,

                  // Start at center + half circle width (right edge of circle)
                  // left: 50% + 18px, right: -18px (into next container to its circle's left edge)
                  left: '50%',

                  marginLeft: 18,

                  position: 'absolute',

                  // Half of 36px circle
                  right: -18,

                  top: 16,
                  zIndex: 1,
                }}
              >
                <DayConnector
                  visible
                  accentColor={accentColor}
                  baseColor={connectorColor}
                  currentStreak={currentStreak}
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
