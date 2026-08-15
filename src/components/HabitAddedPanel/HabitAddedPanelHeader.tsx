/**
 * Status heading for the post-add confirmation panel.
 *
 * The copy states membership, not an event: the panel is shown both right
 * after an add and every later time the habit is reopened, so "just added" or
 * "your chain starts now" would be a lie on re-entry. It also avoids claiming
 * the habit is due today — plenty of templates are weekly.
 */

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

export function HabitAddedPanelHeader({
  checkStyle,
  headline,
  headlineTestID,
  message,
  palette,
}: HeaderProps) {
  return (
    <>
      <View style={s.header}>
        <Animated.View
          style={[s.check, { backgroundColor: palette.addedBg }, checkStyle]}
        >
          <Check
            color={palette.addedFg}
            size={iconSizes.medium}
            strokeWidth={3}
          />
        </Animated.View>
        <Text
          accessibilityRole='header'
          maxFontSizeMultiplier={1.6}
          testID={headlineTestID}
          style={[s.headline, { color: palette.textPrimary }]}
        >
          {headline}
        </Text>
      </View>
      <Text
        maxFontSizeMultiplier={1.6}
        style={[s.message, { color: palette.textSecondary }]}
      >
        {message}
      </Text>
    </>
  );
}
