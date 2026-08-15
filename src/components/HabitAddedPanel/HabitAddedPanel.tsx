/**
 * The single post-add surface: confirmation plus the ways forward, in one
 * panel.
 *
 * It replaces the old two-and-three-surface states (an "Added" pill above a
 * link, plus an overlay toast saying the same thing again). Confirmation and
 * navigation now live together, so nothing competes and nothing is announced
 * twice. Both actions name where they go.
 *
 * Callers own placement: the drill-down renders it inline in the footer, the
 * library renders it as a floating toast. This component owns everything
 * inside the card.
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { habitAddedPanelStyles as s } from './styles';
import { HabitAddedPanelHeader } from './HabitAddedPanelHeader';
import type { HabitAddedPanelProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitAddedPanel({
  checkStyle,
  headline,
  headlineTestID,
  message,
  palette,
  primary,
  secondary,
  style,
  testID,
}: HabitAddedPanelProps) {
  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      testID={testID}
      style={[
        s.panel,
        { backgroundColor: palette.card, borderColor: palette.border },
        style,
      ]}
    >
      <HabitAddedPanelHeader
        checkStyle={checkStyle}
        headline={headline}
        headlineTestID={headlineTestID}
        message={message}
        palette={palette}
      />
      <AnimatedPressable
        accessible
        accessibilityHint={primary.hint}
        accessibilityLabel={primary.label}
        accessibilityRole='button'
        testID={primary.testID}
        style={[
          s.primaryButton,
          { backgroundColor: palette.addBg },
          primary.style,
        ]}
        onPress={primary.onPress}
        {...primary.pressHandlers}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          numberOfLines={2}
          style={[s.primaryText, { color: palette.addFg }]}
        >
          {primary.label}
        </Text>
      </AnimatedPressable>
      {secondary ? (
        <AnimatedPressable
          accessible
          accessibilityHint={secondary.hint}
          accessibilityLabel={secondary.label}
          accessibilityRole='button'
          testID={secondary.testID}
          style={[s.secondaryButton, secondary.style]}
          onPress={secondary.onPress}
          {...secondary.pressHandlers}
        >
          <Text style={[s.secondaryText, { color: palette.textSecondary }]}>
            {secondary.label}
          </Text>
        </AnimatedPressable>
      ) : null}
    </Animated.View>
  );
}
