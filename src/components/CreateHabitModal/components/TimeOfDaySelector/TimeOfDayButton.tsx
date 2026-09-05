/**
 * TimeOfDayButton Component
 * Individual button for time of day selection with press animations
 */

import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors as themeTokens } from '@/theme/colors';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { springs } from '@/theme/animations';
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
  const phaseInfo = HUBERMAN_PHASES[phase];
  const { animatedStyle, pressHandlers } = usePressAnimation({
    enableHaptics: false,
    pressScale: 0.95,
    springConfig: springs.standard,
  });

  return (
    <Pressable
      accessibilityLabel={`${phaseInfo.shortLabel} - ${phaseInfo.timeRange}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      onPress={onPress}
      {...pressHandlers}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-3 py-3'
        style={[
          {
            backgroundColor: isSelected ? themeTokens.primary[500] : '#fafaf9',
            borderColor: isSelected ? themeTokens.primary[600] : '#e7e5e4',
            borderWidth: 1.5,
          },
          animatedStyle,
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
