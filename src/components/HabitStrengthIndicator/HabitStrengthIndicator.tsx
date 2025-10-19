import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';

export type StrengthLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

interface HabitStrengthIndicatorProps {
  strength?: number; // 0-1 scale
  strengthLevel?: StrengthLevel;
  compact?: boolean;
  showLabel?: boolean;
}

const STRENGTH_LEVEL_CONFIG: Record<
  StrengthLevel,
  {
    emoji: string;
    label: string;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  automatic: {
    bgColor: '#4ade80',
    color: '#14532d',
    description: 'Fully automatic',
    emoji: '⚡',
    label: 'Automatic',
  },
  building: {
    bgColor: '#dcfce7',
    color: '#16a34a',
    description: 'Making progress',
    emoji: '🌿',
    label: 'Building',
  },
  developing: {
    bgColor: '#bbf7d0',
    color: '#15803d',
    description: 'Getting stronger',
    emoji: '🌳',
    label: 'Developing',
  },
  starting: {
    bgColor: '#f0fdf4',
    color: '#22c55e',
    description: 'Just beginning',
    emoji: '🌱',
    label: 'Starting Out',
  },
  strong: {
    bgColor: '#86efac',
    color: '#166534',
    description: 'Well-established',
    emoji: '💪',
    label: 'Strong',
  },
};

function getStrengthLevel(strength: number): StrengthLevel {
  if (strength < 0.2) return 'starting';
  if (strength < 0.4) return 'building';
  if (strength < 0.6) return 'developing';
  if (strength < 0.8) return 'strong';
  return 'automatic';
}

export default function HabitStrengthIndicator({
  strength = 0,
  strengthLevel,
  compact = false,
  showLabel = true,
}: HabitStrengthIndicatorProps) {
  const level = strengthLevel || getStrengthLevel(strength);
  const config = STRENGTH_LEVEL_CONFIG[level];
  const percentage = Math.round(strength * 100);

  const progressAnim = useRef(new Animated.Value(strength)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      duration: 600,
      toValue: strength,
      useNativeDriver: false,
    }).start();
  }, [strength, progressAnim]);

  if (compact) {
    const compactWidth = 64; // w-16 = 64px
    const animatedWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, compactWidth],
    });

    return (
      <View className='flex-row items-center gap-1.5'>
        <Text className='text-sm'>{config.emoji}</Text>
        <View className='h-1.5 w-16 overflow-hidden rounded-full bg-gray-200'>
          <Animated.View
            className='h-full rounded-full'
            style={{
              backgroundColor: config.color,
              width: animatedWidth,
            }}
          />
        </View>
        <Text className='text-xs font-medium text-gray-600'>{percentage}%</Text>
      </View>
    );
  }

  // For full view, we need to get the container width dynamically
  const [containerWidth, setContainerWidth] = React.useState(100);
  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth],
  });

  return (
    <View className='gap-2'>
      {showLabel && (
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-base'>{config.emoji}</Text>
            <Text className='text-sm font-semibold text-gray-900'>
              {config.label}
            </Text>
          </View>
          <Text className='text-xs font-medium text-gray-500'>
            {percentage}% Strength
          </Text>
        </View>
      )}

      <View
        className='relative h-2 w-full overflow-hidden rounded-full bg-gray-100'
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          className='h-full rounded-full'
          style={{
            backgroundColor: config.color,
            width: animatedWidth,
          }}
        />
      </View>

      {showLabel && (
        <Text className='text-xs text-gray-500'>{config.description}</Text>
      )}
    </View>
  );
}

export { STRENGTH_LEVEL_CONFIG };
