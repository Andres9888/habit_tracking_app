import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Id } from '../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { Archive, TrendingUp } from 'lucide-react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { StrengthProgressBar } from '../StrengthProgressBar';
import * as Haptics from 'expo-haptics';

type HabitStatus = 'done' | 'missed' | 'planned';

interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  icon?: string;
  iconColor?: string;
  order?: number;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
  strength?: number;
  strengthLevel?: string;
  strengthUpdatedAt?: number;
  bestStreak?: number;
}

interface DraggableHabitProps {
  celebrationsEnabled: boolean;
  habit: Habit;
  habitCompletionIcon?: 'chain' | 'checkbox';
  highContrastMode?: boolean;
  isCompactMode?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  onArchive?: (habitId: Id<'habits'>) => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onMorePress?: (habit: Habit) => void;
  onPress?: (habit: Habit) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
  isJustCreated?: boolean;
  previousStreak?: number; // For detecting new personal records
  isConnectedToPreviousWeek?: boolean;
}

export default function DraggableHabit({
  celebrationsEnabled,
  habit,
  habitCompletionIcon = 'chain',
  highContrastMode = false,
  isCompactMode: _isCompactMode = false,
  showHabitStrengthPercentage = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
  onArchive,
  onLongPress,
  onMorePress,
  onPress,
  onWeekComplete,
  reduceMotionPreference,
  isJustCreated = false,
  previousStreak,
  isConnectedToPreviousWeek = false,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const archiveFlash = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const highlightGlow = useRef(new Animated.Value(0)).current;
  const streakBadgeGlow = useRef(new Animated.Value(0)).current;
  const newRecordScale = useRef(new Animated.Value(0)).current;
  const newRecordOpacity = useRef(new Animated.Value(0)).current;

  const [showNewRecord, setShowNewRecord] = useState(false);

  const { triggerSelection, triggerWarning, triggerSuccess } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  // Calculate if week is complete for visual reward
  const weekCompleteCount = weekStatus.filter(status => status === 'done').length;
  const isWeekComplete = weekCompleteCount === 7;
  const bestStreak = habit.bestStreak || 0;
  const isNewPersonalRecord = previousStreak !== undefined && streak > bestStreak && streak > (previousStreak || 0);
  const hasSignificantStreak = streak >= 7;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translateY]);

  useEffect(() => {
    if (!isJustCreated || reduceMotionPreference) {
      highlightGlow.setValue(0);
      return;
    }
    highlightGlow.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.spring(cardScale, {
          toValue: 1.035,
          useNativeDriver: true,
          damping: 16,
          stiffness: 250,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 250,
        }),
      ]),
      Animated.sequence([
        Animated.timing(highlightGlow, {
          duration: 220,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.timing(highlightGlow, {
          duration: 320,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);

  // Pulse animation for icon when week is complete
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      iconPulse.setValue(1);
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);

  // Streak badge glow animation for significant streaks (7+ days)
  useEffect(() => {
    if (hasSignificantStreak && !reduceMotionPreference) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(streakBadgeGlow, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(streakBadgeGlow, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      streakBadgeGlow.setValue(0);
    }
  }, [hasSignificantStreak, streakBadgeGlow, reduceMotionPreference]);

  // New personal record celebration
  useEffect(() => {
    if (isNewPersonalRecord && !reduceMotionPreference) {
      setShowNewRecord(true);
      triggerSuccess();

      // Animate the "New Record!" badge
      Animated.parallel([
        Animated.spring(newRecordScale, {
          toValue: 1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(newRecordOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Extra bounce on card
        Animated.sequence([
          Animated.spring(cardScale, {
            toValue: 1.03,
            friction: 8,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            friction: 10,
            tension: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Hide the badge after 3 seconds
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(newRecordScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(newRecordOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setShowNewRecord(false));
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isNewPersonalRecord, reduceMotionPreference, triggerSuccess, newRecordScale, newRecordOpacity, cardScale]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <Animated.View
        className='flex-row items-center justify-end'
        style={{ transform: [{ translateX: trans }] }}
      >
        <View className='h-full w-[100px] items-center justify-center rounded-r-2xl bg-red-500'>
          <Archive color='white' size={24} />
          <Text className='mt-1 text-xs font-semibold text-white'>Archive</Text>
        </View>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = () => {
    triggerWarning();
    Animated.sequence([
      Animated.timing(archiveFlash, {
        duration: 120,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(archiveFlash, {
        duration: 220,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
    if (onArchive) {
      onArchive(habit._id);
    }
  };

  const colors = highContrastMode
    ? {
        border: '#facc15',
        cardBackground: '#111111',
        iconContainer: '#facc15',
        primaryText: '#ffffff',
        streakText: '#facc15',
        strengthBackground: '#10b981',
      }
    : {
        border: '#fafaf9', // stone-50
        cardBackground: '#fafaf9', // Warm stone-50 for cozy feel
        iconContainer: undefined as string | undefined,
        primaryText: '#1c1917', // stone-900
        streakText: '#c2410c', // orange-700 for richer streak
        strengthBackground: '#10b981',
      };

  const handleLongPress = () => {
    triggerSelection();
    onLongPress?.(habit);
  };

  const handlePressIn = () => {
    // Enhanced press feedback - more noticeable scale
    Animated.spring(cardScale, {
      toValue: 0.97,
      useNativeDriver: true,
      damping: 12,
      stiffness: 200,
    }).start();
  };

  const handlePressOut = () => {
    // Smooth spring back with subtle bounce
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 10,
      stiffness: 180,
    }).start();
  };

  // Get enhanced background color for icon based on accent color
  const getIconBackground = () => {
    if (highContrastMode) return colors.iconContainer;

    const colorMap: Record<string, string> = {
      '#2563eb': 'rgba(219, 234, 254, 0.85)', // blue-100
      '#ea580c': 'rgba(255, 237, 213, 0.85)', // orange-100
      '#059669': 'rgba(209, 250, 229, 0.85)', // emerald-100
      '#7c3aed': 'rgba(237, 233, 254, 0.85)', // violet-100
      '#0891b2': 'rgba(207, 250, 254, 0.85)', // cyan-100
      '#db2777': 'rgba(252, 231, 243, 0.85)', // pink-100
    };
    return colorMap[accentColor] || 'rgba(254, 249, 195, 0.85)'; // yellow-100 default
  };

  // Get streak badge colors based on streak length
  const getStreakBadgeColors = () => {
    if (streak >= 30) return { bg: '#7c3aed', glow: '#8b5cf6' }; // Purple for 30+
    if (streak >= 14) return { bg: '#ea580c', glow: '#f97316' }; // Orange for 14+
    if (streak >= 7) return { bg: '#dc2626', glow: '#ef4444' }; // Red for 7+
    return { bg: '#c2410c', glow: '#c2410c' }; // Default orange-700
  };

  const streakColors = getStreakBadgeColors();

  // Get strength as percentage (0-100) from decimal (0-1)
  const strengthPercent = Math.round((habit.strength ?? 0) * 100);

  // Get strength color based on percentage
  const getStrengthColor = () => {
    if (strengthPercent >= 80) return '#22c55e'; // green-500 (Automatic)
    if (strengthPercent >= 60) return '#84cc16'; // lime-500 (Strong)
    if (strengthPercent >= 40) return '#eab308'; // yellow-500 (Developing)
    if (strengthPercent >= 20) return '#f97316'; // orange-500 (Building)
    return '#ef4444'; // red-500 (Starting)
  };

  const habitCard = (
    <Pressable
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
      })}
      onLongPress={handleLongPress}
      onPress={() => onPress?.(habit)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='overflow-hidden rounded-3xl'
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: highContrastMode ? 2 : 0,
          opacity: fade,
          transform: [{ translateY }, { scale: cardScale }],
          // Premium elevated shadow
          shadowColor: '#44403c', // stone-700
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4, // Android
        }}
      >
        {/* Archive flash overlay */}
        <Animated.View
          pointerEvents='none'
          style={{
            backgroundColor: 'rgba(248, 113, 113, 0.18)',
            borderRadius: 24,
            opacity: archiveFlash,
            ...StyleSheet.absoluteFillObject,
          }}
        />
        {/* Just-created highlight glow */}
        <Animated.View
          pointerEvents='none'
          style={{
            borderColor: accentColor ?? '#a855f7',
            borderRadius: 24,
            borderWidth: 2,
            opacity: highlightGlow,
            ...StyleSheet.absoluteFillObject,
          }}
        />

        {/* Main card content with increased padding */}
        <View className='px-5 pb-5 pt-4'>
          {/* Title row with icon and streak */}
          <View className='mb-3 flex-row items-center justify-between'>
            <View className='flex-1 flex-row items-center gap-3'>
              {/* Icon container - larger and more prominent */}
              <Animated.View
                style={{
                  transform: [{ scale: iconPulse }],
                }}
              >
                <View
                  className='h-11 w-11 items-center justify-center rounded-xl'
                  style={{
                    backgroundColor: getIconBackground(),
                    borderColor: highContrastMode ? '#111111' : 'rgba(0,0,0,0.04)',
                    borderWidth: highContrastMode ? 2 : 1,
                    // Subtle inner glow
                    shadowColor: accentColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }}
                >
                  <Text className='text-[26px] leading-[30px]'>{emoji}</Text>
                </View>
              </Animated.View>

              {/* Habit name with better typography */}
              <View className='flex-1'>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  className='text-[17px] font-bold leading-[22px]'
                  style={{
                    color: colors.primaryText,
                    letterSpacing: -0.3,
                  }}
                >
                  {name || habit.name}
                </Text>
                {/* Best streak hint (only if not showing strength bar) */}
                {bestStreak > 0 && bestStreak > streak && !showHabitStrengthPercentage && (
                  <Text
                    className='mt-0.5 text-[12px] font-medium'
                    style={{ color: '#a8a29e' }} // stone-400
                  >
                    Best: {bestStreak} days
                  </Text>
                )}
              </View>
            </View>
            {onMorePress && (
              <Pressable
                accessibilityHint='Open habit actions'
                accessibilityLabel='Open habit actions'
                accessibilityRole='button'
                className='ml-3 h-10 w-10 items-center justify-center rounded-full bg-black/5'
                onPress={() => onMorePress(habit)}
              >
                <Text className='text-[20px] leading-[20px]' style={{ color: colors.primaryText }}>
                  ⋯
                </Text>
              </Pressable>
            )}
          </View>

          {/* New Personal Record celebration badge */}
          {showNewRecord && (
            <Animated.View
              className='mb-3 flex-row items-center justify-center gap-1.5 rounded-full bg-gradient-to-r py-2'
              style={{
                backgroundColor: '#fef3c7', // amber-100
                borderColor: '#fcd34d', // amber-300
                borderWidth: 1,
                opacity: newRecordOpacity,
                transform: [{ scale: newRecordScale }],
              }}
            >
              <TrendingUp color='#d97706' size={16} strokeWidth={2.5} />
              <Text
                className='text-[13px] font-bold uppercase tracking-wide'
                style={{ color: '#b45309' }} // amber-700
              >
                New Personal Record! 🎉
              </Text>
            </Animated.View>
          )}

          {/* Strength Progress Bar as divider - full width with milestone markers */}
          {showHabitStrengthPercentage && (
            <View className='mb-3'>
              <StrengthProgressBar
                showDividers
                showNextLevel={false}
                showPercentage
                size='large'
                strength={strengthPercent}
              />
            </View>
          )}
          {/* Fallback divider when strength is hidden */}
          {!showHabitStrengthPercentage && (
            <View
              className='mb-3 h-[1px]'
              style={{
                backgroundColor: 'rgba(120, 113, 108, 0.08)',
              }}
            />
          )}

          {/* Week status visualizer - full width */}
          <HabitChainVisualizer
            accentColor={accentColor}
            celebrationsEnabled={celebrationsEnabled}
            currentStreak={streak}
            habitId={habit._id}
            habitCompletionIcon={habitCompletionIcon}
            highContrastMode={highContrastMode}
            onWeekComplete={({ completedDate }) =>
              onWeekComplete?.({ completedDate, habit })
            }
            reduceMotionPreference={reduceMotionPreference}
            weekDateStrings={weekDateStrings}
            weekStatus={weekStatus}
            onToggle={toggleHabit}
            isConnectedToPreviousWeek={isConnectedToPreviousWeek}
          />

          {/* Completion reward indicator - enhanced */}
          {isWeekComplete && (
            <View
              className='mt-3 flex-row items-center justify-center gap-1.5 rounded-full py-1.5'
              style={{
                backgroundColor: `${accentColor}15`, // 15% opacity accent color
              }}
            >
              <Text className='text-[12px]'>✨</Text>
              <Text
                className='text-[12px] font-bold uppercase tracking-wider'
                style={{ color: accentColor }}
              >
                Perfect Week
              </Text>
              <Text className='text-[12px]'>✨</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );

  if (!onArchive) {
    return habitCard;
  }

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      onSwipeableOpen={handleSwipeableOpen}
    >
      {habitCard}
    </Swipeable>
  );
}
