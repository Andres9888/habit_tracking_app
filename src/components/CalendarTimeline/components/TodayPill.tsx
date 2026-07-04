import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { CHIP_BG, CHIP_TEXT, PRESS } from './WeekNavRow.constants';
import { s } from './WeekNavRow.styles';

interface TodayPillProps {
  entranceStyle: StyleProp<ViewStyle>;
  onJumpToToday: () => void;
}

/** Animated "Today" pill shown on past weeks to jump back. */
export const TodayPill: React.FC<TodayPillProps> = ({
  entranceStyle,
  onJumpToToday,
}) => (
  <Animated.View style={entranceStyle}>
    <AnimatedPressable
      accessibilityHint='Jump back to the current week'
      accessibilityLabel='Today'
      accessibilityRole='button'
      animationConfig={PRESS.today}
      onPress={onJumpToToday}
    >
      <View style={[s.solidChip, { backgroundColor: CHIP_BG }]}>
        <Text style={[s.chipText, { color: CHIP_TEXT }]}>Today</Text>
        <ArrowRight
          color={CHIP_TEXT}
          size={iconSizes.micro}
          strokeWidth={2.5}
        />
      </View>
    </AnimatedPressable>
  </Animated.View>
);
