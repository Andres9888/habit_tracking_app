/**
 * HapticTest Component
 *
 * Diagnostic tool to test expo-haptics functionality on physical device.
 * This isolates haptic testing from gesture handlers to identify issues.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';

export function HapticTest() {
  const theme = useAppTheme();
  const [lastResult, setLastResult] = useState<string>(
    'Tap any button to test'
  );
  const [testCount, setTestCount] = useState(0);

  const testHaptic = async (name: string, hapticFn: () => Promise<void>) => {
    const timestamp = new Date().toLocaleTimeString();
    if (__DEV__) console.log(`🔵 [${timestamp}] Testing: ${name}`);
    if (__DEV__) console.log('🔵 Platform:', Platform.OS);
    if (__DEV__) console.log('🔵 Device:', Platform.Version);

    try {
      await hapticFn();
      const successMsg = `✅ ${name} - Success at ${timestamp}`;
      if (__DEV__) console.log(successMsg);
      setLastResult(successMsg);
      setTestCount((prev) => prev + 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorMsg = `❌ ${name} - FAILED: ${errorMessage}`;
      if (__DEV__) console.error(errorMsg);
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
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
            testHaptic('Selection', () => Haptics.selectionAsync())
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
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
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
            if (__DEV__) console.log('🔥 Starting rapid fire test...');
            for (let i = 0; i < 5; i++) {
              await testHaptic(`Rapid ${i + 1}`, () =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              );
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
            if (__DEV__) console.log('🔥 Rapid fire test complete');
          }}
        >
          Rapid Fire (5x Light)
        </Button>

        <View style={styles.infoBox}>
          <Text style={styles.infoText} variant='bodySmall'>
            ℹ️ Check console logs for detailed output
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
    borderRadius: 8,
    marginTop: 24,
    padding: 12,
  },
  infoText: {
    marginVertical: 2,
    opacity: 0.8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 24,
  },
  statusBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  statusLabel: {
    fontWeight: 'bold',
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
    borderRadius: 12,
    padding: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default HapticTest;
