/**
 * HapticTest Component
 *
 * Diagnostic tool to test expo-haptics functionality on physical device.
 * This isolates haptic testing from gesture handlers to identify issues.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Button, Text, Surface } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { fontWeights } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

export function HapticTest() {
  const theme = useAppTheme();
  const [lastResult, setLastResult] = useState<string>(
    'Tap any button to test'
  );
  const [testCount, setTestCount] = useState(0);

  const testHaptic = async (name: string, hapticFn: () => Promise<void>) => {
    const timestamp = new Date().toLocaleTimeString();

    try {
      await hapticFn();
      const successMsg = `✅ ${name} - Success at ${timestamp}`;
      setLastResult(successMsg);
      setTestCount((prev) => prev + 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorMsg = `❌ ${name} - FAILED: ${errorMessage}`;
      setLastResult(errorMsg);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={[
        styles.container,
        { backgroundColor: theme.custom.colors.light.background },
      ]}
    >
      <Surface elevation={1} style={styles.surface}>
        <Text style={styles.title} variant='headlineMedium'>
          Haptic Feedback Test
        </Text>

        <Text style={styles.subtitle} variant='bodyMedium'>
          🚨 Physical Device Only - Simulators don't support haptics
        </Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel} variant='labelLarge'>
            Last Result:
          </Text>
          <Text style={styles.statusText} variant='bodyMedium'>
            {lastResult}
          </Text>
          <Text style={styles.counter} variant='bodySmall'>
            Tests run: {testCount}
          </Text>
        </View>

        <Text style={styles.sectionTitle} variant='titleMedium'>
          Impact Feedback
        </Text>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Light Impact', () =>
              triggerHaptic('tap')
            )
          }
        >
          Test Light Impact
        </Button>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Medium Impact', () =>
              triggerHaptic('toggle')
            )
          }
        >
          Test Medium Impact
        </Button>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Heavy Impact', () =>
              triggerHaptic('heavy')
            )
          }
        >
          Test Heavy Impact
        </Button>

        <Text style={styles.sectionTitle} variant='titleMedium'>
          Selection Feedback
        </Text>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Selection', () => triggerHaptic('selection'))
          }
        >
          Test Selection
        </Button>

        <Text style={styles.sectionTitle} variant='titleMedium'>
          Notification Feedback
        </Text>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Success Notification', () =>
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            )
          }
        >
          Test Success Notification
        </Button>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Warning Notification', () =>
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              )
            )
          }
        >
          Test Warning Notification
        </Button>

        <Button
          mode='contained'
          style={styles.button}
          onPress={() =>
            testHaptic('Error Notification', () =>
              triggerHaptic('error')
            )
          }
        >
          Test Error Notification
        </Button>

        <Text style={styles.sectionTitle} variant='titleMedium'>
          Rapid Fire Test
        </Text>

        <Button
          mode='outlined'
          style={styles.button}
          onPress={async () => {
            for (let i = 0; i < 5; i++) {
              await testHaptic(`Rapid ${i + 1}`, () =>
                triggerHaptic('tap')
              );
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }}
        >
          Rapid Fire (5x Light)
        </Button>

        <View style={styles.infoBox}>
          <Text style={styles.infoText} variant='bodySmall'>
            ℹ️ Results appear above after each test
          </Text>
          <Text style={styles.infoText} variant='bodySmall'>
            ℹ️ Platform: {Platform.OS} {Platform.Version}
          </Text>
          <Text style={styles.infoText} variant='bodySmall'>
            ℹ️ expo-haptics version: 15.0.7
          </Text>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 6,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  counter: {
    opacity: 0.6,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: borderRadius.small,
    marginTop: 24,
    padding: 12,
  },
  infoText: {
    marginVertical: 2,
    opacity: 0.8,
  },
  sectionTitle: {
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
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
  surface: {
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default HapticTest;
