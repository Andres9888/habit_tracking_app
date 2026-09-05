/**
 * HapticTest Component
 *
 * Diagnostic tool to test expo-haptics functionality on physical device.
 * This isolates haptic testing from gesture handlers to identify issues.
 *
 * Deliberately built from bare React Native primitives: this screen is a
 * dev-only diagnostic and was the last consumer of `react-native-paper`,
 * which is ~262KB of otherwise-unused bundle weight.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';
import { fontWeights } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

type HapticTestCase = {
  label: string;
  section: string;
  run: () => Promise<void>;
};

const TEST_CASES: HapticTestCase[] = [
  {
    label: 'Light Impact',
    section: 'Impact Feedback',
    run: () => triggerHaptic('tap'),
  },
  {
    label: 'Medium Impact',
    section: 'Impact Feedback',
    run: () => triggerHaptic('toggle'),
  },
  {
    label: 'Heavy Impact',
    section: 'Impact Feedback',
    run: () => triggerHaptic('heavy'),
  },
  {
    label: 'Selection',
    section: 'Selection Feedback',
    run: () => triggerHaptic('selection'),
  },
  {
    label: 'Success Notification',
    section: 'Notification Feedback',
    run: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  },
  {
    label: 'Warning Notification',
    section: 'Notification Feedback',
    run: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  },
  {
    label: 'Error Notification',
    section: 'Notification Feedback',
    run: () => triggerHaptic('error'),
  },
];

export function HapticTest() {
  const theme = useAppTheme();
  const [lastResult, setLastResult] = useState('Tap any button to test');
  const [testCount, setTestCount] = useState(0);

  const testHaptic = async (name: string, hapticFn: () => Promise<void>) => {
    const timestamp = new Date().toLocaleTimeString();

    try {
      await hapticFn();
      setLastResult(`✅ ${name} - Success at ${timestamp}`);
      setTestCount((previous) => previous + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setLastResult(`❌ ${name} - FAILED: ${message}`);
    }
  };

  const rapidFire = async () => {
    for (let index = 0; index < 5; index++) {
      await testHaptic(`Rapid ${index + 1}`, () => triggerHaptic('tap'));
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  let renderedSection = '';

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={[
        styles.container,
        { backgroundColor: theme.custom.colors.light.background },
      ]}
    >
      <View style={styles.surface}>
        <Text style={styles.title}>Haptic Feedback Test</Text>
        <Text style={styles.subtitle}>
          🚨 Physical Device Only - Simulators don&apos;t support haptics
        </Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Last Result:</Text>
          <Text style={styles.statusText}>{lastResult}</Text>
          <Text style={styles.counter}>Tests run: {testCount}</Text>
        </View>

        {TEST_CASES.map((testCase) => {
          const showSection = testCase.section !== renderedSection;
          renderedSection = testCase.section;

          return (
            <View key={testCase.label}>
              {showSection ? (
                <Text style={styles.sectionTitle}>{testCase.section}</Text>
              ) : null}
              <Pressable
                accessibilityRole='button'
                style={styles.button}
                onPress={() => testHaptic(testCase.label, testCase.run)}
              >
                <Text style={styles.buttonLabel}>Test {testCase.label}</Text>
              </Pressable>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Rapid Fire Test</Text>
        <Pressable
          accessibilityRole='button'
          style={[styles.button, styles.buttonOutlined]}
          onPress={rapidFire}
        >
          <Text style={[styles.buttonLabel, styles.buttonLabelOutlined]}>
            Rapid Fire (5x Light)
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Results appear above after each test
          </Text>
          <Text style={styles.infoText}>
            ℹ️ Platform: {Platform.OS} {Platform.Version}
          </Text>
          <Text style={styles.infoText}>ℹ️ expo-haptics version: 15.0.7</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: borderRadius.small,
    marginVertical: 6,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: fontWeights.semibold,
  },
  buttonLabelOutlined: {
    color: '#059669',
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderColor: '#059669',
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  counter: {
    fontSize: 13,
    opacity: 0.6,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: borderRadius.small,
    marginTop: 24,
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    marginVertical: 2,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: fontWeights.bold,
    marginBottom: 12,
    marginTop: 24,
  },
  statusBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: borderRadius.small,
    marginBottom: 16,
    padding: 16,
  },
  statusLabel: {
    fontWeight: fontWeights.bold,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
  surface: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default HapticTest;
