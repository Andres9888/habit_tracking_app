import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { habitAddedPanelStyles as s } from './styles';
import type { HabitAddedPanelProps } from './types';

type HeaderProps = Pick<
  HabitAddedPanelProps,
  'checkStyle' | 'headline' | 'message' | 'palette'
> & { headlineTestID?: string };

export function HabitAddedPanelHeader(p: HeaderProps) {
  return (
    <>
      <View style={s.header}>
        <Animated.View
          style={[s.check, { backgroundColor: p.palette.addedBg }, p.checkStyle]}
        >
          <Check color={p.palette.addedFg} size={iconSizes.medium} strokeWidth={3} />
        </Animated.View>
        <Text
          accessibilityRole='header'
          maxFontSizeMultiplier={1.6}
          testID={p.headlineTestID}
          style={[s.headline, { color: p.palette.textPrimary }]}
        >
          {p.headline}
        </Text>
      </View>
      <Text
        maxFontSizeMultiplier={1.6}
        style={[s.message, { color: p.palette.textSecondary }]}
      >
        {p.message}
      </Text>
    </>
  );
}
