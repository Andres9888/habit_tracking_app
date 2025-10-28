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
  const [lastResult, setLastResult] = useState<string>('Tap any button to test');
  const [testCount, setTestCount] = useState(0);

  const testHaptic = async (
    name: string,
    hapticFn: () => Promise<void>
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔵 [${timestamp}] Testing: ${name}`);
    console.log('🔵 Platform:', Platform.OS);
    console.log('🔵 Device:', Platform.Version);

    try {
      await hapticFn();
      const successMsg = `✅ ${name} - Success at ${timestamp}`;
      console.log(successMsg);
      setLastResult(successMsg);
      setTestCount(prev => prev + 1);
    } catch (error) {
      const errorMsg = `❌ ${name} - FAILED: ${error}`;
      console.error(errorMsg);
      setLastResult(errorMsg);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.custom.colors.light.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Surface style={styles.surface} elevation={1}>
        <Text variant="headlineMedium" style={styles.title}>
          Haptic Feedback Test
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          🚨 Physical Device Only - Simulators don't support haptics
        </Text>

        <View style={styles.statusBox}>
          <Text variant="labelLarge" style={styles.statusLabel}>
            Last Result:
          </Text>
          <Text variant="bodyMedium" style={styles.statusText}>
            {lastResult}
          </Text>
          <Text variant="bodySmall" style={styles.counter}>
            Tests run: {testCount}
          </Text>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Impact Feedback
        </Text>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Light Impact',
            () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          )}
          style={styles.button}
        >
          Test Light Impact
        </Button>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Medium Impact',
            () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          )}
          style={styles.button}
        >
          Test Medium Impact
        </Button>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Heavy Impact',
            () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          )}
          style={styles.button}
        >
          Test Heavy Impact
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Selection Feedback
        </Text>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Selection',
            () => Haptics.selectionAsync()
          )}
          style={styles.button}
        >
          Test Selection
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Notification Feedback
        </Text>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Success Notification',
            () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          )}
          style={styles.button}
        >
          Test Success Notification
        </Button>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Warning Notification',
            () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          )}
          style={styles.button}
        >
          Test Warning Notification
        </Button>

        <Button
          mode="contained"
          onPress={() => testHaptic(
            'Error Notification',
            () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          )}
          style={styles.button}
        >
          Test Error Notification
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Rapid Fire Test
        </Text>

        <Button
          mode="outlined"
          onPress={async () => {
            console.log('🔥 Starting rapid fire test...');
            for (let i = 0; i < 5; i++) {
              await testHaptic(
                `Rapid ${i + 1}`,
                () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              );
              await new Promise(resolve => setTimeout(resolve, 200));
            }
            console.log('🔥 Rapid fire test complete');
          }}
          style={styles.button}
        >
          Rapid Fire (5x Light)
        </Button>

        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            ℹ️ Check console logs for detailed output
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            ℹ️ Platform: {Platform.OS} {Platform.Version}
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            ℹ️ expo-haptics version: 15.0.7
          </Text>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 6,
  },
  statusBox: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    marginBottom: 8,
  },
  counter: {
    opacity: 0.6,
  },
  infoBox: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoText: {
    marginVertical: 2,
    opacity: 0.8,
  },
});

export default HapticTest;
