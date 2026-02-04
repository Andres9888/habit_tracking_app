/**
 * SettingsSection Component
 *
 * A grouped container for related settings rows with staggered entrance animations.
 * Supports default and danger variants for visual distinction.
 * Respects reduced motion preferences for accessibility.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { SETTINGS_COLORS } from './types';
import type { SettingsSectionProps } from './types';

export function SettingsSection({
  title,
  icon,
  variant = 'default',
  index = 0,
  children,
}: SettingsSectionProps) {
  const reducedMotion = useReducedMotion();
  const delay = reducedMotion ? 0 : index * 50;

  const isDanger = variant === 'danger';

  return (
    <Animated.View
      entering={
        reducedMotion ? undefined : FadeInDown.delay(delay).duration(300)
      }
      style={styles.container}
    >
      <View style={styles.header}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text
          accessibilityRole='header'
          style={[styles.title, isDanger && styles.titleDanger]}
        >
          {title}
        </Text>
      </View>
      <View style={[styles.card, isDanger && styles.cardDanger]}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SETTINGS_COLORS.card,
    borderColor: SETTINGS_COLORS.cardBorder,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardDanger: {
    backgroundColor: SETTINGS_COLORS.cardDanger,
    borderColor: SETTINGS_COLORS.cardDangerBorder,
  },
  container: {
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 16,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    color: SETTINGS_COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  titleDanger: {
    color: SETTINGS_COLORS.textDanger,
  },
});
