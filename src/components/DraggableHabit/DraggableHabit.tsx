import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';
import type { Id } from '../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { TrendingUp, Archive, ChevronRight } from 'lucide-react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { PhaseTag } from '../PhaseTag';
import * as Haptics from 'expo-haptics';
import {
  useHabitCardEntrance,
  type HabitCardEntranceVariant,
} from '../HabitCard/useHabitCardEntrance';

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
  preferredTime?: string;
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
  completionIcon?: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  /**
   * Delay before entrance animation starts (for stagger effects).
   * @default 0
   */
  entranceDelay?: number;
  /**
   * Animation variant for card entrance.
   * @default 'accentSlideDown'
   */
  entranceVariant?: HabitCardEntranceVariant;
  habit: Habit;
  highContrastMode?: boolean;
  isCompactMode?: boolean;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  isJustCreated?: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  /**
   * Callback fired when entrance animation completes.
   */
  onEntranceComplete?: () => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onPress?: (habit: Habit) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  previousStreak?: number; // For detecting new personal records
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  /**
   * Whether to trigger entrance animation.
   * @default true
   */
  triggerEntrance?: boolean;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
}

export default function DraggableHabit({
  celebrationsEnabled,
  completionIcon = 'chain',
  dayShape = 'square',
  entranceDelay = 0,
  entranceVariant = 'widthExpansion',
  habit,
  highContrastMode = false,
  isCompactMode: _isCompactMode = false,
  isConnectedToNextWeek = false,
  isConnectedToPreviousWeek = false,
  isJustCreated = false,
  onArchive,
  onEntranceComplete,
  onLongPress,
  onPress,
  onWeekComplete,
  previousStreak,
  reduceMotionPreference,
  showConnectors = true,
  showHabitStrengthPercentage = false,
  streak,
  toggleHabit,
  triggerEntrance = true,
  weekDateStrings,
  weekStatus,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  // Entrance animation hook for the accent bar and content
  const {
    cardStyle: entranceCardStyle,
    accentStyle: entranceAccentStyle,
    contentStyle: entranceContentStyle,
  } = useHabitCardEntrance({
    autoTrigger: triggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const archiveFlash = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const highlightGlow = useRef(new Animated.Value(0)).current;
  const newRecordScale = useRef(new Animated.Value(0)).current;
  const newRecordOpacity = useRef(new Animated.Value(0)).current;

  const [showNewRecord, setShowNewRecord] = useState(false);

  const { triggerSelection, triggerWarning, triggerSuccess } =
    useHapticFeedback({
      isEnabled: celebrationsEnabled,
      preference: reduceMotionPreference,
    });

  // Calculate if week is complete for visual reward
  const weekCompleteCount = weekStatus.filter(
    (status) => status === 'done'
  ).length;
  const isWeekComplete = weekCompleteCount === 7;
  const bestStreak = habit.bestStreak || 0;
  const isNewPersonalRecord =
    previousStreak !== undefined &&
    streak > bestStreak &&
    streak > (previousStreak || 0);

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

    // Enhanced highlight animation for newly created habits
    // Delay slightly to coordinate with the shared element transition
    const animationDelay = 200;

    highlightGlow.setValue(0);
    cardScale.setValue(0.95); // Start smaller for entrance effect

    const timeout = setTimeout(() => {
      Animated.parallel([
        // Scale entrance: 0.95 → 1.04 → 1.0 (bouncy)
        Animated.sequence([
          Animated.spring(cardScale, {
            damping: 12,
            stiffness: 200,
            toValue: 1.04,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            damping: 15,
            stiffness: 250,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
        // Glow pulse: 0 → 1 → 0.6 → 1 → 0 (double pulse)
        // Uses native driver - highlightGlow only animates opacity
        Animated.sequence([
          Animated.timing(highlightGlow, {
            duration: 300,
            easing: Easing.out(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(highlightGlow, {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            toValue: 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(highlightGlow, {
            duration: 300,
            easing: Easing.out(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(highlightGlow, {
            duration: 500,
            easing: Easing.in(Easing.ease),
            toValue: 0,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);

  // Pulse animation for icon when week is complete
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.05,
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      iconPulse.setValue(1);
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);

  // New personal record celebration
  useEffect(() => {
    if (isNewPersonalRecord && !reduceMotionPreference) {
      setShowNewRecord(true);
      triggerSuccess();

      // Animate the "New Record!" badge
      Animated.parallel([
        Animated.spring(newRecordScale, {
          friction: 5,
          tension: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(newRecordOpacity, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        // Extra bounce on card
        Animated.sequence([
          Animated.spring(cardScale, {
            friction: 8,
            tension: 200,
            toValue: 1.03,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            friction: 10,
            tension: 200,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Hide the badge after 3 seconds
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(newRecordScale, {
            duration: 200,
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(newRecordOpacity, {
            duration: 200,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start(() => setShowNewRecord(false));
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [
    isNewPersonalRecord,
    reduceMotionPreference,
    triggerSuccess,
    newRecordScale,
    newRecordOpacity,
    cardScale,
  ]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    // Progressive icon scale based on swipe progress (0.8 → 1.1)
    const iconScale = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-100, -60, -30, 0],
      outputRange: [1.1, 1, 0.85, 0.8],
    });

    // Progressive opacity for icon (0.6 → 1.0)
    const iconOpacity = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-100, -40, 0],
      outputRange: [1, 0.85, 0.6],
    });

    return (
      <Animated.View
        className='flex-row items-center justify-end'
        style={{ transform: [{ translateX: trans }] }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f59e0b',
            borderBottomRightRadius: 24,
            // amber-500
            borderTopRightRadius: 24,

            height: '100%',

            justifyContent: 'center',

            width: 100,
          }}
        >
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            }}
          >
            <Archive color='white' size={22} strokeWidth={2} />
            <Text
              style={{
                color: 'white',
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 0.2,
                marginTop: 4,
              }}
            >
              Archive
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = () => {
    // Success haptic instead of warning - archive is organizational, not destructive
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Uses native driver - archiveFlash only animates opacity
    Animated.sequence([
      Animated.timing(archiveFlash, {
        duration: 120,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(archiveFlash, {
        duration: 220,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
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
        border: '#f5f5f4', // stone-100 - subtle border
        cardBackground: '#ffffff', // Pure white for better contrast against beige bg
        iconContainer: undefined as string | undefined,
        primaryText: '#1c1917', // stone-900
        streakText: '#c2410c', // orange-700 for richer streak
        strengthBackground: '#10b981',
      };

  const handleLongPress = () => {
    if (!onLongPress) {
      return;
    }

    triggerSelection();
    onLongPress(habit);
  };

  const handlePressIn = () => {
    // Enhanced press feedback - more noticeable scale
    Animated.spring(cardScale, {
      damping: 12,
      stiffness: 200,
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Smooth spring back with subtle bounce
    Animated.spring(cardScale, {
      damping: 10,
      stiffness: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Get enhanced background color for icon based on accent color
  const getIconBackground = () => {
    if (highContrastMode) return colors.iconContainer;

    const colorMap: Record<string, string> = {
      // violet-100
      '#0891b2': 'rgba(207, 250, 254, 0.85)',

      // orange-100
      '#059669': 'rgba(209, 250, 229, 0.85)',

      // emerald-100
      '#7c3aed': 'rgba(237, 233, 254, 0.85)',

      '#2563eb': 'rgba(219, 234, 254, 0.85)',

      // cyan-100
      '#db2777': 'rgba(252, 231, 243, 0.85)',
      // blue-100
      '#ea580c': 'rgba(255, 237, 213, 0.85)', // pink-100
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
  const strengthPercent = (habit.strength ?? 0) * 100;

  // Get strength emoji based on percentage (matches StrengthProgressBar levels)
  const getStrengthEmoji = () => {
    if (strengthPercent >= 80) return '⚡'; // Automatic
    if (strengthPercent >= 60) return '💪'; // Strong
    if (strengthPercent >= 40) return '🌳'; // Developing
    if (strengthPercent >= 20) return '🌿'; // Building
    return '🌱'; // Starting
  };

  const getStrengthLabel = () => {
    if (strengthPercent >= 80) return 'Automatic';
    if (strengthPercent >= 60) return 'Strong';
    if (strengthPercent >= 40) return 'Developing';
    if (strengthPercent >= 20) return 'Building';
    return 'Starting';
  };

  // Animated emoji for strength indicator
  const strengthEmojiScale = useSharedValue(1);
  const strengthEmojiOpacity = useSharedValue(1);
  const strengthEmojiRotation = useSharedValue(0);
  const previousStrengthLevelRef = useRef(getStrengthLabel());

  useEffect(() => {
    const currentLabel = getStrengthLabel();
    const levelChanged = previousStrengthLevelRef.current !== currentLabel;
    previousStrengthLevelRef.current = currentLabel;

    if (reduceMotionPreference) return;

    if (levelChanged) {
      // Level-up animation: fade out + shrink, then fade in + grow with wobble
      strengthEmojiOpacity.value = withTiming(0.3, {
        duration: 150,
        easing: ReanimatedEasing.out(ReanimatedEasing.ease),
      });
      strengthEmojiScale.value = withTiming(0.6, {
        duration: 150,
        easing: ReanimatedEasing.out(ReanimatedEasing.ease),
      });
      strengthEmojiRotation.value = withSequence(
        withTiming(-8, {
          duration: 80,
          easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
        }),
        withTiming(8, {
          duration: 80,
          easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
        }),
        withTiming(0, {
          duration: 60,
          easing: ReanimatedEasing.out(ReanimatedEasing.ease),
        })
      );
      strengthEmojiOpacity.value = withDelay(
        150,
        withTiming(1, {
          duration: 200,
          easing: ReanimatedEasing.out(ReanimatedEasing.ease),
        })
      );
      strengthEmojiScale.value = withDelay(
        150,
        withSequence(
          withSpring(1.4, { damping: 6, stiffness: 120 }),
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );
    } else {
      // Subtle pulse for regular updates
      strengthEmojiScale.value = withSequence(
        withTiming(1.08, {
          duration: 100,
          easing: ReanimatedEasing.out(ReanimatedEasing.ease),
        }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }
  }, [strengthPercent, reduceMotionPreference]);

  const strengthEmojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: strengthEmojiOpacity.value,
    transform: [
      { scale: strengthEmojiScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
      { rotate: `${Math.round(strengthEmojiRotation.value)}deg` },
    ],
  }));

  // Default accent color fallback (violet-500)
  const DEFAULT_ACCENT_COLOR = '#8b5cf6';
  const effectiveAccentColor = accentColor || DEFAULT_ACCENT_COLOR;

  // In high contrast mode, use yellow accent for visibility
  const borderAccentColor = highContrastMode ? '#facc15' : effectiveAccentColor;

  const habitCard = (
    <ReAnimated.View style={entranceCardStyle}>
      <Pressable
        accessibilityHint='Tap to view habit details, long press for quick actions'
        accessibilityLabel={`${habit.name}, ${streak} day streak, ${Math.round(strengthPercent)}% strength`}
        accessibilityRole='button'
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
        })}
        onLongPress={handleLongPress}
        onPress={() => onPress?.(habit)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          className='flex-row overflow-hidden rounded-3xl'
          style={{
            // Celebratory green tint for perfect week, otherwise default white
            backgroundColor:
              isWeekComplete && !highContrastMode
                ? 'rgba(220, 252, 231, 0.3)' // emerald-50 with 30% opacity
                : colors.cardBackground,
            borderColor:
              isWeekComplete && !highContrastMode
                ? '#86efac' // emerald-300 for completed habits
                : colors.border,
            borderWidth: highContrastMode ? 2 : 1,
            elevation: 3,

            opacity: fade,

            // Enhanced shadow for perfect week
            shadowColor: isWeekComplete ? '#10b981' : '#78716c',
            // emerald-500 or stone-500
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isWeekComplete ? 0.12 : 0.06,
            shadowRadius: 12,
            transform: [{ translateY }, { scale: cardScale }], // Android
          }}
        >
          {/* Color accent left border - animated for entrance effect */}
          {/* Width is controlled by entranceAccentStyle for the expansion animation */}
          <ReAnimated.View
            style={[
              {
                alignSelf: 'stretch',
                backgroundColor: borderAccentColor,
                borderBottomLeftRadius: 24,
                borderTopLeftRadius: 24,
              },
              entranceAccentStyle,
            ]}
          />

          {/* Main card content wrapper - animated for entrance effect */}
          <ReAnimated.View className='flex-1' style={entranceContentStyle}>
            {/* Archive flash overlay - amber for organizational action */}
            <Animated.View
              pointerEvents='none'
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
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

            {/* Main card content - header section */}
            <View className='pt-4'>
              {/* Title row - 5-column grid matching calendar/chain visualizer exactly */}
              <View className='relative mb-3 flex-row items-center justify-between px-3'>
                {/* Column 1: emoji centered (aligns with first calendar date & habit circle) */}
                <View className='flex-1 items-center'>
                  <Animated.View
                    style={{
                      transform: [{ scale: iconPulse }],
                    }}
                  >
                    <View
                      className='h-9 w-9 items-center justify-center rounded-xl'
                      style={{
                        backgroundColor: getIconBackground(),
                        borderColor: highContrastMode
                          ? '#111111'
                          : 'rgba(0,0,0,0.04)',
                        borderWidth: highContrastMode ? 2 : 1,
                        shadowColor: accentColor,
                        shadowOffset: { height: 0, width: 0 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                      }}
                    >
                      <Text className='text-[22px] leading-[26px]'>
                        {emoji}
                      </Text>
                    </View>
                  </Animated.View>
                </View>
                {/* Columns 2-5: empty flex spacers to maintain 5-column grid */}
                <View className='flex-1' />
                <View className='flex-1' />
                <View className='flex-1' />
                <View className='flex-1' />
                {/* Title overlay - positioned from column 2 to end */}
                <View
                  style={{
                    bottom: 0,
                    justifyContent: 'center',
                    left: '20%',
                    paddingLeft: 8,
                    paddingRight: 12,
                    position: 'absolute',
                    right: 12,
                    top: 0,
                  }}
                >
                  <View className='flex-row items-center gap-2'>
                    <Text
                      className='shrink text-[17px] font-bold leading-[22px]'
                      ellipsizeMode='tail'
                      numberOfLines={1}
                      style={{
                        color: colors.primaryText,
                        letterSpacing: -0.3,
                      }}
                    >
                      {name || habit.name}
                    </Text>
                    {habit.preferredTime && (
                      <PhaseTag compact preferredTime={habit.preferredTime} />
                    )}
                    {/* Chevron indicator for tap-to-view-details affordance */}
                    <View className='ml-auto'>
                      <ChevronRight
                        color={highContrastMode ? '#facc15' : '#a8a29e'}
                        size={18}
                        strokeWidth={2}
                      />
                    </View>
                  </View>
                  {bestStreak > 0 &&
                    bestStreak > streak &&
                    !showHabitStrengthPercentage && (
                      <Text
                        className='mt-0.5 text-[13px] font-medium'
                        style={{ color: '#a8a29e' }}
                      >
                        Best: {bestStreak} days
                      </Text>
                    )}
                </View>
              </View>

              {/* New Personal Record celebration badge */}
              {showNewRecord && (
                <Animated.View
                  className='mx-3 mb-3 flex-row items-center justify-center gap-1.5 rounded-full bg-gradient-to-r py-2'
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

              {/* Strength Progress Bar - 5-column grid for alignment */}
              {showHabitStrengthPercentage && (
                <View className='relative mb-3 flex-row items-center justify-between px-3'>
                  {/* Column 1: Animated plant emoji centered (aligns with first habit circle) */}
                  <View className='flex-1 items-center justify-center'>
                    <ReAnimated.Text
                      style={[
                        { fontSize: 20, textAlign: 'center' },
                        strengthEmojiAnimatedStyle,
                      ]}
                    >
                      {getStrengthEmoji()}
                    </ReAnimated.Text>
                  </View>
                  {/* Column 2 */}
                  <View className='flex-1' />
                  {/* Column 3 */}
                  <View className='flex-1' />
                  {/* Column 4 */}
                  <View className='flex-1' />
                  {/* Column 5: Percentage centered (aligns with last habit circle) */}
                  <View className='flex-1 items-center'>
                    <Text
                      className='text-[13px] font-bold'
                      style={{ color: '#65a30d', marginLeft: 12 }}
                    >
                      {Math.round(strengthPercent)}%
                    </Text>
                  </View>
                  {/* Progress bar overlay spanning columns 2-4 */}
                  <View
                    pointerEvents='none'
                    style={{
                      bottom: 0,
                      justifyContent: 'center',
                      left: '20%',
                      position: 'absolute',
                      right: '20%',
                      top: 0,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#e5e7eb',
                        borderRadius: 4,
                        height: 8,
                        marginHorizontal: 8,
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {/* Progress fill */}
                      <View
                        style={{
                          backgroundColor: '#65a30d',
                          borderRadius: 4,
                          height: '100%',
                          width: `${strengthPercent}%`,
                        }}
                      />
                      {/* Dividers at 20%, 40%, 60%, 80% */}
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          height: '100%',
                          left: '20%',
                          position: 'absolute',
                          top: 0,
                          width: 1,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          height: '100%',
                          left: '40%',
                          position: 'absolute',
                          top: 0,
                          width: 1,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          height: '100%',
                          left: '60%',
                          position: 'absolute',
                          top: 0,
                          width: 1,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          height: '100%',
                          left: '80%',
                          position: 'absolute',
                          top: 0,
                          width: 1,
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
              {/* Fallback divider when strength is hidden - using stone-100 for consistency */}
              {!showHabitStrengthPercentage && (
                <View
                  className='mx-3 mb-3 h-[1.5px] rounded-full'
                  style={{
                    backgroundColor: '#f5f5f4', // stone-100
                  }}
                />
              )}
            </View>

            {/* Week status visualizer - px-3 to align with CalendarTimeline dates */}
            <View className='px-3 pb-5'>
              <HabitChainVisualizer
                accentColor={accentColor}
                celebrationsEnabled={celebrationsEnabled}
                completionIcon={completionIcon}
                currentStreak={streak}
                habitId={habit._id}
                highContrastMode={highContrastMode}
                isConnectedToNextWeek={isConnectedToNextWeek}
                isConnectedToPreviousWeek={isConnectedToPreviousWeek}
                reduceMotionPreference={reduceMotionPreference}
                shape={dayShape}
                showConnectors={showConnectors}
                weekDateStrings={weekDateStrings}
                weekStatus={weekStatus}
                onToggle={toggleHabit}
                onWeekComplete={({ completedDate }) =>
                  onWeekComplete?.({ completedDate, habit })
                }
              />

              {/* Completion reward indicator - enhanced */}
              {isWeekComplete && (
                <View
                  className='mt-3 flex-row items-center justify-center gap-1.5 rounded-full py-1.5'
                  style={{
                    backgroundColor: `${effectiveAccentColor}15`, // 15% opacity accent color
                  }}
                >
                  <Text className='text-[10px]'>✨</Text>
                  <Text
                    className='text-[10px] font-medium uppercase tracking-wider'
                    style={{ color: effectiveAccentColor }}
                  >
                    Perfect Week
                  </Text>
                  <Text className='text-[10px]'>✨</Text>
                </View>
              )}
            </View>
          </ReAnimated.View>
        </Animated.View>
      </Pressable>
    </ReAnimated.View>
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
