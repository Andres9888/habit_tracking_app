/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * SettingsRow Component
 *
 * A versatile settings row supporting navigation, toggle, and action types.
 * Features animated press feedback, haptic response, and accessibility support.
 * Uses emoji icons with tinted backgrounds for visual interest.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SettingsToggle } from './SettingsToggle';
import { ICON_COLORS, SETTINGS_COLORS } from './types';
import type {
  SettingsRowProps,
  SettingsRowNavigationProps,
  SettingsRowToggleProps,
} from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsRow(props: SettingsRowProps) {
  const {
    icon,
    iconColor,
    label,
    description,
    badge,
    disabled = false,
    isFirst = false,
    accessibilityLabel,
    accessibilityHint,
    type,
  } = props;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (type === 'navigation' || type === 'action') {
      props.onPress();
    }
  }, [disabled, type, props]);

  const handleToggle = useCallback(
    (value: boolean) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (type === 'toggle') {
        props.onToggle(value);
      }
    },
    [type, props]
  );

  const rowAccessibilityLabel =
    accessibilityLabel ??
    (type === 'toggle'
      ? label
      : `${label}${props.value ? `, ${props.value}` : ''}`);

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={rowAccessibilityLabel}
      accessibilityRole={type === 'toggle' ? 'switch' : 'button'}
      accessibilityState={
        type === 'toggle' ? { checked: props.isEnabled } : undefined
      }
      disabled={disabled && type !== 'toggle'}
      style={[
        styles.container,
        !isFirst && styles.containerBorder,
        disabled && styles.containerDisabled,
        animatedStyle,
      ]}
      onPress={type === 'toggle' ? undefined : handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: ICON_COLORS[iconColor] },
        ]}
      >
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, disabled && styles.labelDisabled]}>
            {label}
          </Text>
          {badge && (
            <View style={[styles.badge, badge === 'pro' && styles.badgePro]}>
              <Text
                style={[
                  styles.badgeText,
                  badge === 'pro' && styles.badgeTextPro,
                ]}
              >
                {badge.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* Right Side */}
      {type === 'toggle' ? (
        <SettingsToggle
          accessibilityLabel={label}
          disabled={disabled}
          isEnabled={props.isEnabled}
          onToggle={handleToggle}
        />
      ) : (
        <>
          {props.value && <Text style={styles.value}>{props.value}</Text>}
          <Text style={styles.chevron}>›</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgePro: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeText: {
    color: SETTINGS_COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextPro: {
    color: SETTINGS_COLORS.warning,
  },
  chevron: {
    color: SETTINGS_COLORS.textTertiary,
    fontSize: 18,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  containerBorder: {
    borderTopColor: SETTINGS_COLORS.cardBorder,
    borderTopWidth: 1,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  description: {
    color: SETTINGS_COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconEmoji: {
    fontSize: 18,
  },
  label: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  labelDisabled: {
    color: SETTINGS_COLORS.textTertiary,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  value: {
    color: SETTINGS_COLORS.textSecondary,
    fontSize: 15,
  },
});
