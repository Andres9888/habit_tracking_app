/**
 * HabitCard Component
 * Based on UX Specification Section 4.2
 *
 * Purpose: Display individual habit with all tracking info
 * Variants: Default (not completed), Completed (checkmark, muted), At Risk (warning, <40% prediction)
 * States: Default, Pressed, Swiping, Long-press, Disabled
 * Includes: Habit name + icon, color accent bar, strength indicator (compact), today's status, swipe handlers
 * Usage: Main list item on Home screen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useAppTheme } from '../../theme';
import { StrengthRing } from '../StrengthRing';
import { getStrengthLevel } from '../HabitStrengthIndicator/HabitStrengthIndicator';
import FloatingXPText from '../FloatingXPText/FloatingXPText';
import * as Haptics from 'expo-haptics';

export interface HabitCardProps {
  /** Habit ID */
  id: Id<'habits'>;

  /** Habit name */
  name: string;

  /** Habit icon/emoji */
  icon?: string;

  /** Habit color (hex) */
  color?: string;

  /** Habit strength (0-100) */
  strength: number;

  /** Current streak (Story 1.4) */
  currentStreak?: number;

  /** Best streak (Story 1.4) */
  bestStreak?: number;

  /** Is completed today */
  completed?: boolean;

  /** Is at risk (prediction <40%) */
  atRisk?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** On tap handler (complete habit) - DEPRECATED: Component now calls toggleCompletion mutation directly */
  onPress?: () => void;

  /** On long press handler (quick actions menu) */
  onLongPress?: () => void;

  /** On edit handler (swipe action) */
  onEdit?: () => void;

  /** On delete handler (swipe action) */
  onDelete?: () => void;

  /** Custom style */
  style?: ViewStyle;
}

const SWIPE_THRESHOLD = -100; // Distance to reveal actions
const ACTION_WIDTH = 80; // Width of each action button

export function HabitCard({
  id,
  name,
  icon = '📝',
  color,
  strength,
  currentStreak = 0,
  bestStreak = 0,
  completed: completedProp = false,
  atRisk = false,
  disabled = false,
  onPress,
  onLongPress,
  onEdit,
  onDelete,
  style,
}: HabitCardProps) {
  const theme = useAppTheme();
  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);

  // Strength fill animation - fills card background based on habit strength percentage
  const strengthFillWidth = useSharedValue(strength);

  // Enhanced animation values for completion
  const checkmarkScale = useSharedValue(completedProp ? 1 : 0);
  const checkmarkRotate = useSharedValue(completedProp ? 360 : 0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  // Floating XP text state
  const [showFloatingXP, setShowFloatingXP] = React.useState(false);
  const [xpPosition, setXPPosition] = React.useState({ x: 0, y: 0 });

  // Prevent rapid-fire toggles with debounce flag
  const [isToggling, setIsToggling] = React.useState(false);
  const [completed, setCompleted] = React.useState(completedProp);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Animate strength fill when strength changes
  useEffect(() => {
    strengthFillWidth.value = withSpring(strength, {
      damping: 15,
      stiffness: 100,
    });
  }, [strength]);

  // Get strength color based on current level
  const getStrengthColor = (): string => {
    const level = getStrengthLevel(strength);
    switch (level) {
      case 'starting':
        return theme.custom.colors.strength.starting;
      case 'building':
        return theme.custom.colors.strength.building;
      case 'developing':
        return theme.custom.colors.strength.developing;
      case 'strong':
        return theme.custom.colors.strength.strong;
      case 'automatic':
        return theme.custom.colors.strength.automatic;
      default:
        return theme.custom.colors.primary[500];
    }
  };

  // Convex mutation for toggling completion
  const toggleCompletionMutation = useMutation(api.tracking.toggleCompletion);

  // Query current completion status for conditional haptic feedback
  // Returns true if completed, false if not completed, undefined while loading
  const isCompleted = useQuery(api.tracking.getCompletionStatus, {
    date: today,
    habitId: id,
  });

  // Note: Haptic feedback will be called inline with runOnJS wrapper
  // This pattern is required for Reanimated worklets

  // ========================================
  // ENHANCED COMPLETION ANIMATION (Part B: Micro-Transitions)
  // ========================================
  const triggerCompletionCelebration = () => {
    'worklet';

    // Phase 1: Card bounce (100-400ms)
    cardScale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 200 }),
      withSpring(1.0, { damping: 12, stiffness: 180 })
    );

    // Phase 2: Checkmark animation (0-400ms)
    // Scale: 0 → 1.2 → 1.0 (elastic spring)
    checkmarkScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1.0, { damping: 10, stiffness: 180 })
    );

    // Rotation: 0 → 360deg
    checkmarkRotate.value = withTiming(360, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Phase 3: Ripple effect (100-500ms)
    rippleScale.value = 0;
    rippleOpacity.value = 0.3;

    rippleScale.value = withTiming(2, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    rippleOpacity.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Phase 4: Trigger floating XP text
    runOnJS(setShowFloatingXP)(true);
    runOnJS(() => {
      // Calculate position (center of card)
      setXPPosition({ x: 150, y: 20 });

      // Hide after animation completes
      setTimeout(() => setShowFloatingXP(false), 1000);
    })();
  };

  const triggerUncheckAnimation = () => {
    'worklet';

    // Simple fade out for checkmark
    checkmarkScale.value = withTiming(0, {
      duration: 200,
      easing: Easing.in(Easing.cubic),
    });

    checkmarkRotate.value = 0;
  };

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow left swipe (negative translateX)
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      // If swiped past threshold, snap to open position
      if (event.translationX < SWIPE_THRESHOLD) {
        console.log('🟢 SWIPE: Actions revealed - triggering Light haptic');
        translateX.value = withSpring(ACTION_WIDTH * -2, {
          damping: 15,
          stiffness: 150,
        });
        // Haptic feedback when actions revealed
        runOnJS(() => {
          console.log('🟢 SWIPE: Inside runOnJS - calling Light haptic');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            .then(() => console.log('✅ SWIPE haptic SUCCESS'))
            .catch((error) => console.error('❌ SWIPE haptic FAILED:', error));
        })();
      } else {
        console.log('🟢 SWIPE: Below threshold - no haptic');
        // Otherwise spring back to closed
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  // Tap gesture handler with enhanced press feedback
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      console.log('🔴 TAP GESTURE BEGIN');
      // Enhanced press state - more noticeable scale down
      cardScale.value = withSpring(0.96, {
        damping: 12,
        stiffness: 200,
      });
    })
    .onFinalize(() => {
      console.log('🔴 TAP GESTURE FINALIZE');
      // Smooth spring back with slight bounce
      cardScale.value = withSpring(1, {
        damping: 10,
        stiffness: 180,
      });
    })
    .onEnd(() => {
      console.log('🔴 ========================================');
      console.log('🔴 TAP GESTURE FIRED!!!');
      console.log('🔴 Habit:', name);
      console.log('🔴 isCompleted:', isCompleted);
      console.log('🔴 disabled:', disabled);
      console.log('🔴 isToggling:', isToggling);
      console.log('🔴 Timestamp:', new Date().toISOString());

      if (!disabled && !isToggling) {
        console.log('🔴 ✓ Passed disabled/toggling check');
        console.log('🔴 isCompleted value:', isCompleted);

        // Haptic feedback BEFORE mutation for best UX
        // Different intensity based on current completion state:
        // - If currently completed (true) → unchecking → Light haptic (softer)
        // - If not completed (false) → checking → Medium haptic (stronger)
        // - If loading (undefined) → default to Medium

        // Directly call haptic with ternary to avoid variable capture issues
        if (isCompleted === true) {
          // Unchecking - Light haptic + simple animation
          console.log('🔴 Triggering LIGHT haptic (unchecking)');
          runOnJS(() => {
            console.log('🔴 Inside runOnJS - LIGHT haptic');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              .then(() => console.log('✅ LIGHT Haptic SUCCESS'))
              .catch((error) => console.error('❌ LIGHT Haptic FAILED:', error));
          })();
          triggerUncheckAnimation();
        } else {
          // Checking or loading - Medium haptic + CELEBRATION!
          console.log('🔴 Triggering MEDIUM haptic (checking) + CELEBRATION');
          runOnJS(() => {
            console.log('🔴 Inside runOnJS - MEDIUM haptic');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              .then(() => console.log('✅ MEDIUM Haptic SUCCESS'))
              .catch((error) => console.error('❌ MEDIUM Haptic FAILED:', error));
          })();
          triggerCompletionCelebration();
        }

        // Set debounce flag to prevent rapid toggles
        runOnJS(setIsToggling)(true);
        console.log('🔴 Toggling flag set to true');

        // Call Convex mutation with error handling
        runOnJS(async () => {
          console.log('🔴 Starting mutation...');
          try {
            await toggleCompletionMutation({ date: today, habitId: id });
            console.log('🔴 Mutation SUCCESS');

            // Update local state to reflect new completion status
            setCompleted(!isCompleted);
          } catch (error) {
            console.error('🔴 Toggle completion failed:', error);
            // TODO: Show toast notification when toast system is available
            // Toast.show({ message: "Connection issue, please try again", type: "error" })
          } finally {
            // Reset debounce flag after 300ms cooldown
            setTimeout(() => {
              setIsToggling(false);
              console.log('🔴 Toggling flag reset to false');
            }, 300);
          }
        })();

        // Keep backward compatibility with onPress prop if provided
        if (onPress) {
          console.log('🔴 Calling onPress callback');
          runOnJS(onPress)();
        }
      } else {
        console.log(
          '🔴 ✗ BLOCKED - disabled:',
          disabled,
          'isToggling:',
          isToggling
        );
      }
      console.log('🔴 ========================================');
    });

  // Long press gesture handler
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      console.log('🟡 LONG PRESS triggered');
      console.log('🟡 onLongPress exists:', !!onLongPress);
      console.log('🟡 disabled:', disabled);

      if (onLongPress && !disabled) {
        console.log('🟡 Calling Heavy haptic for long press');
        // Haptic feedback for long press
        runOnJS(() => {
          console.log('🟡 LONG PRESS: Inside runOnJS - calling Heavy haptic');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            .then(() => console.log('✅ LONG PRESS haptic SUCCESS'))
            .catch((error) => console.error('❌ LONG PRESS haptic FAILED:', error));
        })();
        runOnJS(onLongPress)();
      } else {
        console.log('🟡 LONG PRESS blocked - no handler or disabled');
      }
    });

  // Combine gestures (tap, long press, pan)
  const composedGesture = Gesture.Race(
    longPressGesture,
    Gesture.Simultaneous(tapGesture, panGesture)
  );

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: cardScale.value }],
  }));

  const actionsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Checkmark animation (Part B: scale + rotation)
  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkmarkScale.value },
      { rotate: `${checkmarkRotate.value}deg` },
    ],
  }));

  // Ripple effect animation
  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  // Strength fill animation - width based on strength percentage
  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${strengthFillWidth.value}%`,
  }));

  // Get card background based on state
  const getBackgroundColor = () => {
    if (completed) {
      return theme.custom.colors.primary[400] + '20'; // 20% opacity muted green
    }
    if (atRisk) {
      return theme.custom.colors.warning[500] + '10'; // 10% opacity warning
    }
    return theme.custom.colors.light.card;
  };

  // Get accent color
  const accentColor = color || theme.custom.colors.primary[500];

  return (
    <View style={[styles.container, style]}>
      {/* Swipe Actions (Edit, Delete) */}
      <Animated.View style={[styles.actionsContainer, actionsAnimatedStyle]}>
        <Pressable
          accessibilityLabel={`Edit ${name}`}
          accessibilityRole='button'
          style={[
            styles.actionButton,
            { backgroundColor: theme.custom.colors.secondary[500] },
          ]}
          onPress={() => {
            translateX.value = withSpring(0);
            onEdit?.();
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>

        <Pressable
          accessibilityLabel={`Delete ${name}`}
          accessibilityRole='button'
          style={[
            styles.actionButton,
            { backgroundColor: theme.custom.colors.error },
          ]}
          onPress={() => {
            translateX.value = withSpring(0);
            onDelete?.();
          }}
        >
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </Animated.View>

      {/* Main Card */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          accessible
          accessibilityHint='Tap to complete, swipe left for edit and delete options, long press for quick actions'
          accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength, ${completed ? 'completed today' : 'not completed'}`}
          accessibilityRole='button'
          accessibilityState={{
            checked: completed,
            disabled,
          }}
          style={[
            styles.card,
            {
              backgroundColor: getBackgroundColor(),
              borderRadius: theme.custom.borderRadius.large,
              // Refined iOS-style shadow - more defined depth
              elevation: 3,
              shadowColor: '#000000',
              shadowOffset: { height: 3, width: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            disabled && styles.disabled,
            cardAnimatedStyle,
          ]}
        >
          {/* Strength Fill Background - fills from left based on habit strength % with organic gradient fade */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.strengthFill,
              strengthFillStyle,
              {
                borderBottomLeftRadius: theme.custom.borderRadius.large,
                borderTopLeftRadius: theme.custom.borderRadius.large,
                overflow: 'hidden',
              },
            ]}
          >
            <LinearGradient
              colors={[
                getStrengthColor() + '30', // 19% opacity at the start (left)
                getStrengthColor() + '18', // 9% opacity in middle
                getStrengthColor() + '00', // Fully transparent at end (right)
              ]}
              end={{ x: 1, y: 0.5 }}
              locations={[0, 0.6, 1]} // Gradient stops: solid → fade → transparent
              start={{ x: 0, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Color Accent Bar (Left edge) */}
          <View
            style={[
              styles.accentBar,
              {
                backgroundColor: accentColor,
                borderBottomLeftRadius: theme.custom.borderRadius.large,
                borderTopLeftRadius: theme.custom.borderRadius.large,
              },
            ]}
          />

          {/* Card Content */}
          <View style={styles.content}>
            {/* Top Row: Icon, Name, Status */}
            <View style={styles.topRow}>
              <View style={styles.habitInfo}>
                <Text style={styles.icon}>{icon}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    theme.custom.typography.heading3,
                    { color: theme.custom.colors.gray[900] },
                    completed && styles.completedText,
                  ]}
                >
                  {name}
                </Text>
              </View>

              {/* Status Indicator */}
              <View style={styles.statusContainer}>
                {completed ? (
                  <Animated.View
                    style={[
                      styles.checkmark,
                      { backgroundColor: theme.custom.colors.primary[500] },
                      checkmarkAnimatedStyle,
                    ]}
                  >
                    <Text style={styles.checkmarkText}>✓</Text>
                  </Animated.View>
                ) : atRisk ? (
                  <View
                    style={[
                      styles.warningBadge,
                      { backgroundColor: theme.custom.colors.warning[500] },
                    ]}
                  >
                    <Text style={styles.warningText}>⚠️</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Streak Badge Row - Prominent placement for motivation */}
            {currentStreak > 0 && (
              <View style={styles.streakRow}>
                <View style={[styles.streakBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.streakFireIcon}>🔥</Text>
                  <Text style={[styles.streakText, { color: theme.custom.colors.warning[700] }]}>
                    {currentStreak} Day{currentStreak !== 1 ? 's' : ''} Streak
                  </Text>
                </View>
                {/* Best Streak Badge - Shows when approaching or at personal record */}
                {bestStreak > 0 && currentStreak >= bestStreak - 2 && (
                  <View style={[styles.bestStreakBadge, {
                    backgroundColor: currentStreak >= bestStreak ? '#FEF9C3' : '#F3F4F6',
                    borderColor: currentStreak >= bestStreak ? '#FACC15' : '#E5E7EB',
                  }]}>
                    <Text style={styles.bestStreakIcon}>🏅</Text>
                    <Text style={[styles.bestStreakText, {
                      color: currentStreak >= bestStreak ? '#A16207' : '#6B7280'
                    }]}>
                      {currentStreak >= bestStreak ? 'New Record!' : `Best: ${bestStreak}`}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Ripple Effect Overlay (Part B: Micro-Transitions) */}
            <Animated.View
              style={[styles.rippleOverlay, rippleAnimatedStyle]}
              pointerEvents="none"
            />

            {/* Bottom Row: Strength Ring with Percentage */}
            <View style={styles.bottomRow}>
              <StrengthRing
                strength={strength}
                size='small'
                showPercentage={false}
                showLevel={false}
              />
              <Text
                style={[
                  styles.strengthPercentage,
                  { color: getStrengthColor() },
                ]}
              >
                {Math.round(strength)}%
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Floating XP Text (Part B: XP Gain Animation) */}
      {showFloatingXP && (
        <FloatingXPText
          value={10}
          startPosition={xpPosition}
          onComplete={() => setShowFloatingXP(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accentBar: {
    width: 6,
  },
  // Strength fill - absolute positioned background that fills based on strength %
  strengthFill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  actionButton: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: ACTION_WIDTH,
  },
  actionsContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  checkmark: {
    height: 24,
    borderRadius: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  strengthPercentage: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completedText: {
    opacity: 0.6,
  },
  container: {
    height: 88,
    position: 'relative', // As per UX spec
    marginVertical: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  habitInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 32,
  },
  statusContainer: {
    marginLeft: 8,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warningBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  warningText: {
    fontSize: 12,
  },
  // Streak Badge Styles - Prominent motivational display
  streakRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
    marginTop: 4,
  },
  streakBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakFireIcon: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  // Best Streak Badge Styles
  bestStreakBadge: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bestStreakIcon: {
    fontSize: 12,
  },
  bestStreakText: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Part B: Micro-Transitions - Ripple effect overlay
  rippleOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    marginLeft: -20,
    backgroundColor: '#10B981', // Green 500
    borderRadius: 20,
  },
});

export default HabitCard;
