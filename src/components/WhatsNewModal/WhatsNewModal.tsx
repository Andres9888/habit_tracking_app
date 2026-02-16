/**
 * WhatsNewModal Component
 *
 * Displays new features and updates to users after app version bumps.
 * Shows on first launch after a version update.
 * Stores last-seen version in AsyncStorage.
 *
 * Design System Compliance:
 * - Typography: 34/22/17/13 (display/title/body/caption)
 * - Primary green: #047857 (text), #059669 (buttons)
 * - Shadows: 4px offset, 16px blur, 0.08 opacity
 * - Animation: springify().damping(18), 280ms
 * - Border radius: 16px cards, 12px buttons
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { WhatsNewModalProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function WhatsNewModal({
  visible,
  changelog,
  onDismiss,
}: WhatsNewModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  if (!visible) return null;

  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <Animated.View
          entering={SlideInDown.duration(280).springify().damping(18)}
          style={[
            styles.container,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor: isDark ? colors.card : colors.background,
                shadowColor: isDark ? '#000' : '#000',
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: isDark ? colors.text : '#047857' },
                ]}
              >
                🎉 What's New
              </Text>
              <Text style={[styles.version, { color: colors.textSecondary }]}>
                Version {changelog.version}
              </Text>
            </View>

            {/* Features List */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {changelog.features.map((feature, index) => (
                <Animated.View
                  key={index}
                  entering={FadeIn.delay(60 * (index + 1))
                    .duration(280)
                    .springify()
                    .damping(18)}
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(4, 120, 87, 0.04)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(4, 120, 87, 0.1)',
                    },
                  ]}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureText}>
                    <Text
                      style={[styles.featureTitle, { color: colors.text }]}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>

            {/* Dismiss Button */}
            <AnimatedPressable
              accessibilityLabel="Got it"
              accessibilityRole="button"
              entering={FadeIn.delay(60 * (changelog.features.length + 2))
                .duration(280)
                .springify()
                .damping(18)}
              style={({ pressed }) => [
                styles.dismissButton,
                {
                  backgroundColor: '#059669',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={onDismiss}
            >
              <Text style={styles.dismissButtonText}>Got it</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 24,
    maxWidth: 500,
    width: '100%',
  },
  content: {
    borderRadius: 16,
    maxHeight: '80%',
    padding: 24,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  dismissButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 16,
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  featureCard: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  version: {
    fontSize: 13,
    fontWeight: '500',
  },
});
