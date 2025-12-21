/**
 * SwipeableActionButton Component
 *
 * A swipeable wrapper for action buttons in the Manage tab.
 * - Swipe left reveals a delete/action area
 * - Red background slides in for destructive actions
 * - Requires full swipe or tap to confirm
 * - Supports custom swipe action (delete, archive, etc.)
 */

import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

interface SwipeableActionButtonProps {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  /** Primary label text */
  label: string;
  /** Subtitle text */
  subtitle?: string;
  /** Press handler for the button */
  onPress: () => void;
  /** Swipe action handler (called when swiped fully) */
  onSwipeAction?: () => void;
  /** Whether to show chevron */
  showChevron?: boolean;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'boost';
  /** Whether swipe is enabled */
  swipeEnabled?: boolean;
  /** Custom swipe action icon */
  swipeIcon?: React.ComponentType<{ color: string; size: number; strokeWidth: number }>;
  /** Custom swipe action label */
  swipeLabel?: string;
  /** Swipe action color scheme */
  swipeVariant?: 'destructive' | 'warning';
}

export function SwipeableActionButton({
  icon: Icon,
  label,
  subtitle,
  onPress,
  onSwipeAction,
  showChevron = false,
  variant = 'default',
  swipeEnabled = true,
  swipeIcon: SwipeIcon = Trash2,
  swipeLabel = 'Delete',
  swipeVariant = 'destructive',
}: SwipeableActionButtonProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const isDestructive = variant === 'destructive';
  const isBoost = variant === 'boost';

  // Swipe colors based on variant
  const swipeColors = swipeVariant === 'destructive'
    ? { bg: '#dc2626', text: '#ffffff', iconBg: 'rgba(255,255,255,0.2)' } // red-600
    : { bg: '#f59e0b', text: '#ffffff', iconBg: 'rgba(255,255,255,0.2)' }; // amber-500

  // Build accessible label with context
  const accessibleLabel = subtitle
    ? `${label}. ${subtitle}${isDestructive ? '. This is a destructive action.' : ''}${swipeEnabled ? '. Swipe left to reveal action.' : ''}`
    : `${label}${isDestructive ? '. This is a destructive action.' : ''}${swipeEnabled ? '. Swipe left to reveal action.' : ''}`;

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-120, 0],
      outputRange: [0, 120],
    });

    // Progressive icon scale based on swipe progress (0.8 → 1.15)
    const iconScale = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-120, -80, -40, 0],
      outputRange: [1.15, 1.05, 0.9, 0.8],
    });

    // Progressive opacity for icon (0.6 → 1.0)
    const iconOpacity = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-120, -50, 0],
      outputRange: [1, 0.85, 0.6],
    });

    return (
      <Animated.View
        style={[styles.swipeAction, { transform: [{ translateX: trans }] }]}
      >
        <Pressable
          accessibilityLabel={`${swipeLabel} ${label}`}
          accessibilityRole='button'
          style={[styles.swipeActionInner, { backgroundColor: swipeColors.bg }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            swipeableRef.current?.close();
            onSwipeAction?.();
          }}
        >
          <Animated.View
            style={[
              styles.swipeIconContainer,
              {
                backgroundColor: swipeColors.iconBg,
                opacity: iconOpacity,
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <SwipeIcon color={swipeColors.text} size={20} strokeWidth={2} />
          </Animated.View>
          <Text style={[styles.swipeLabel, { color: swipeColors.text }]}>
            {swipeLabel}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // Auto-trigger the action on full swipe
    swipeableRef.current?.close();
    onSwipeAction?.();
  };

  const button = (
    <Pressable
      accessibilityLabel={accessibleLabel}
      accessibilityRole="button"
      className={clsx(
        'flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70',
        isDestructive && 'border-red-200/60 bg-red-50/50',
        isBoost && 'border-violet-200/60 bg-gradient-to-r from-violet-50 to-indigo-50',
        !isDestructive && !isBoost && 'border-stone-200 bg-white/80'
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          isBoost && 'bg-gradient-to-br from-violet-500 to-indigo-600',
          isDestructive && 'bg-red-100',
          !isBoost && !isDestructive && 'bg-stone-100'
        )}
      >
        <Icon
          className={clsx(
            isDestructive && 'text-red-500',
            isBoost && 'text-white',
            !isDestructive && !isBoost && 'text-stone-600'
          )}
          size={20}
          strokeWidth={2.25}
        />
      </View>
      <View className="flex-1">
        <Text
          className={clsx(
            'text-base font-medium',
            isDestructive && 'text-red-600',
            isBoost && 'text-violet-900',
            !isDestructive && !isBoost && 'text-stone-800'
          )}
        >
          {label}
        </Text>
        {subtitle && (
          <Text className={clsx(
            'text-xs',
            isBoost ? 'text-violet-600' : 'text-stone-500'
          )}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight
          className={clsx(
            isDestructive && 'text-red-400',
            isBoost && 'text-violet-400',
            !isDestructive && !isBoost && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
  );

  if (!swipeEnabled || !onSwipeAction) {
    return button;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={60}
      onSwipeableOpen={handleSwipeableOpen}
    >
      {button}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeAction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  swipeActionInner: {
    alignItems: 'center',
    borderRadius: 12,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 16,
    width: 100,
  },
  swipeIconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  swipeLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

export default SwipeableActionButton;
