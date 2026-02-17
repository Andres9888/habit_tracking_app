/**
 * TimeGroupSectionHeader — collapsible header for a time-of-day group.
 *
 * Shows group icon, label, completion progress ring, and expand/collapse chevron.
 * Follows the design system: SF Pro/Roboto, #047857 green, 16px radius, spring animations.
 */

import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { TimeGroupSectionHeaderProps } from './types';

const SPRING_CONFIG = { damping: 18, stiffness: 150 };

export function TimeGroupSectionHeader({
  group,
  isExpanded,
  onToggle,
}: TimeGroupSectionHeaderProps) {
  const rotation = useSharedValue(isExpanded ? 1 : 0);

  const handlePress = useCallback(() => {
    rotation.value = withSpring(isExpanded ? 0 : 1, SPRING_CONFIG);
    onToggle();
  }, [isExpanded, onToggle, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 90}deg` }],
  }));

  const progress =
    group.totalCount > 0 ? group.completedCount / group.totalCount : 0;
  const isComplete = progress === 1;

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={`${group.label} group, ${group.completedCount} of ${group.totalCount} complete`}
      accessibilityState={{ expanded: isExpanded }}
      className='mb-2 mt-4 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-zinc-800'
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 2,
      }}
      onPress={handlePress}
    >
      {/* Group icon */}
      <Text className='mr-3 text-[22px]'>{group.icon}</Text>

      {/* Label + count */}
      <View className='flex-1'>
        <Text className='text-[17px] font-semibold text-zinc-900 dark:text-zinc-100'>
          {group.label}
        </Text>
        <Text className='mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400'>
          {group.completedCount}/{group.totalCount} complete
        </Text>
      </View>

      {/* Progress indicator */}
      <View className='mr-3 items-center justify-center'>
        <ProgressRing progress={progress} isComplete={isComplete} size={28} />
      </View>

      {/* Chevron */}
      <Animated.Text
        className='text-[17px] text-zinc-400 dark:text-zinc-500'
        style={chevronStyle}
      >
        ▶
      </Animated.Text>
    </Pressable>
  );
}

/** Tiny SVG-free progress ring using borders. */
function ProgressRing({
  progress,
  isComplete,
  size,
}: {
  progress: number;
  isComplete: boolean;
  size: number;
}) {
  const borderColor = isComplete ? '#059669' : '#d4d4d8';
  const fillColor = isComplete ? '#059669' : '#047857';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2.5,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {progress > 0 && (
        <View
          style={{
            width: size * 0.55 * progress,
            height: size * 0.55 * progress,
            borderRadius: (size * 0.55 * progress) / 2,
            backgroundColor: fillColor,
          }}
        />
      )}
    </View>
  );
}
