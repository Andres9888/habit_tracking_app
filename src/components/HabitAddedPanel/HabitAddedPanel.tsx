import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { habitAddedPanelStyles as s } from './styles';
import { HabitAddedPanelHeader } from './HabitAddedPanelHeader';
import type { HabitAddedPanelProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitAddedPanel(p: HabitAddedPanelProps) {
  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      testID={p.testID}
      style={[
        s.panel,
        { backgroundColor: p.palette.card, borderColor: p.palette.border },
        p.style,
      ]}
    >
      <HabitAddedPanelHeader {...p} />
      <AnimatedPressable
        accessible
        accessibilityHint={p.primary.hint}
        accessibilityLabel={p.primary.label}
        accessibilityRole='button'
        accessibilityState={{ disabled: p.primary.disabled }}
        disabled={p.primary.disabled}
        testID={p.primary.testID}
        style={[
          s.primaryButton,
          { backgroundColor: p.palette.addBg },
          p.primary.disabled ? { opacity: 0.55 } : null,
          p.primary.style,
        ]}
        onPress={p.primary.onPress}
        {...p.primary.pressHandlers}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          numberOfLines={2}
          style={[s.primaryText, { color: p.palette.addFg }]}
        >
          {p.primary.label}
        </Text>
      </AnimatedPressable>
      {p.secondary ? (
        <AnimatedPressable
          accessible
          accessibilityHint={p.secondary.hint}
          accessibilityLabel={p.secondary.label}
          accessibilityRole='button'
          testID={p.secondary.testID}
          style={[s.secondaryButton, p.secondary.style]}
          onPress={p.secondary.onPress}
          {...p.secondary.pressHandlers}
        >
          <Text style={[s.secondaryText, { color: p.palette.textSecondary }]}>
            {p.secondary.label}
          </Text>
        </AnimatedPressable>
      ) : null}
    </Animated.View>
  );
}
