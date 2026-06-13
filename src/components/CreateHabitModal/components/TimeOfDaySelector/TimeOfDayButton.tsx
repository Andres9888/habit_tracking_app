/**
 * TimeOfDayButton Component
 * Individual button for time of day selection with press animations
 */

import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { colors as themeTokens } from '@/theme/colors';
import {
  HUBERMAN_PHASES,
  type HubermanPhase,
} from '../../../../constants/hubermanPhases';

interface TimeOfDayButtonProps {
  phase: HubermanPhase;
  isSelected: boolean;
  onPress: () => void;
}

export const TimeOfDayButton = ({
  phase,
  isSelected,
  onPress,
}: TimeOfDayButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseInfo = HUBERMAN_PHASES[phase];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel={`${phaseInfo.shortLabel} - ${phaseInfo.timeRange}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-3 py-3'
        style={[
          {
            backgroundColor: isSelected ? themeTokens.primary[500] : '#fafaf9',
            borderColor: isSelected ? themeTokens.primary[600] : '#e7e5e4',
            borderWidth: 1.5,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text className='mb-1 text-lg'>{phaseInfo.icon}</Text>
        <Text
          className='text-sm font-semibold'
          style={{ color: isSelected ? themeTokens.text.inverse : '#1c1917' }}
        >
          {phaseInfo.shortLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
