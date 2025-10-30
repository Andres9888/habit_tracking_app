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

import React from 'react';
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
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useAppTheme } from '../../theme';
import HabitStrengthIndicator from '../HabitStrengthIndicator/HabitStrengthIndicator';
import StreakIndicator from '../StreakIndicator/StreakIndicator';
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
  completed = false,
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

  // Prevent rapid-fire toggles with debounce flag
  const [isToggling, setIsToggling] = React.useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Convex mutation for toggling completion
  const toggleCompletionMutation = useMutation(api.tracking.toggleCompletion);

  // Query current completion status for conditional haptic feedback
  // Returns true if completed, false if not completed, undefined while loading
  const isCompleted = useQuery(api.tracking.getCompletionStatus, {
    date: today,
    habitId: id,
  });

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
        console.log('🟢 SWIPE: Actions revealed - triggering haptic');
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

  // Tap gesture handler
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      console.log('🔴 TAP GESTURE BEGIN');
      cardScale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 150,
      });
    })
    .onFinalize(() => {
      console.log('🔴 TAP GESTURE FINALIZE');
      cardScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
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

        // Haptic feedback BEFORE mutation for best UX
        // Different intensity based on current completion state:
        // - If currently completed (true) → unchecking → Light haptic (softer)
        // - If not completed (false) → checking → Medium haptic (stronger)
        // - If loading (undefined) → default to Medium
        const hapticStyle =
          isCompleted === true
            ? Haptics.ImpactFeedbackStyle.Light // Unchecking
            : Haptics.ImpactFeedbackStyle.Medium; // Checking (or loading)

        console.log('🔴 Haptic style selected:', hapticStyle);
        console.log('🔴 About to call runOnJS for haptic...');

        runOnJS(() => {
          console.log('🔴🔴🔴 INSIDE runOnJS - CALLING HAPTIC NOW');
          const startTime = Date.now();

          Haptics.impactAsync(hapticStyle)
            .then(() => {
              const duration = Date.now() - startTime;
              console.log(`✅ Haptic SUCCESS! Duration: ${duration}ms`);
            })
            .catch((error) => {
              const duration = Date.now() - startTime;
              console.error(`❌ Haptic FAILED after ${duration}ms:`, error);
              console.error('❌ Error type:', typeof error);
              console.error('❌ Error message:', error?.message);
              console.error('❌ Error stack:', error?.stack);
            });
        })();

        // Set debounce flag to prevent rapid toggles
        runOnJS(setIsToggling)(true);
        console.log('🔴 Toggling flag set to true');

        // Call Convex mutation with error handling
        runOnJS(async () => {
          console.log('🔴 Starting mutation...');
          try {
            await toggleCompletionMutation({ date: today, habitId: id });
            console.log('🔴 Mutation SUCCESS');
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
        runOnJS(() => {
          console.log('🟡 LONG PRESS: Inside runOnJS - calling Heavy haptic');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            .then(() => console.log('✅ LONG PRESS haptic SUCCESS'))
            .catch((error) =>
              console.error('❌ LONG PRESS haptic FAILED:', error)
            );
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
              borderRadius: theme.custom.borderRadius.medium,
              ...theme.custom.shadows.card,
            },
            disabled && styles.disabled,
            cardAnimatedStyle,
          ]}
        >
          {/* Color Accent Bar (Left edge) */}
          <View
            style={[
              styles.accentBar,
              {
                backgroundColor: accentColor,
                borderBottomLeftRadius: theme.custom.borderRadius.medium,
                borderTopLeftRadius: theme.custom.borderRadius.medium,
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
                  <View
                    style={[
                      styles.checkmark,
                      { backgroundColor: theme.custom.colors.primary[500] },
                    ]}
                  >
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
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

            {/* Bottom Row: Strength Indicator + Streak */}
            <View style={styles.bottomRow}>
              <HabitStrengthIndicator
                showPercentage
                habitName={name}
                strength={strength}
                variant='compact'
              />
              {/* Streak Indicator (Story 1.4) */}
              <StreakIndicator
                compact
                bestStreak={bestStreak}
                currentStreak={currentStreak}
              />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  accentBar: {
    width: 4,
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
  completedText: {
    opacity: 0.6,
  },
  container: {
    height: 72,
    position: 'relative', // As per UX spec
    marginVertical: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
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
    fontSize: 24,
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
});

export default HabitCard;
