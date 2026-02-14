/**
 * BrandedLoadingScreen Component
 * Shows Chain Day branding during auth loading with a 10-second timeout.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { LoadingTimeoutCard } from './LoadingTimeoutCard';

const LOADING_TIMEOUT_MS = 10_000;

export function BrandedLoadingScreen() {
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🔗</Text>
        </View>
        <Text style={styles.appName}>Chain Day</Text>
        {timedOut ? (
          <LoadingTimeoutCard onRetry={handleRetry} />
        ) : (
          <ActivityIndicator
            color={colors.primary[500]}
            size='small'
            style={styles.spinner}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: colors.primary[700],
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.background,
    flex: 1,
    justifyContent: 'center',
  },
  content: { alignItems: 'center' },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  iconText: { fontSize: 28 },
  spinner: { marginTop: 8 },
});
