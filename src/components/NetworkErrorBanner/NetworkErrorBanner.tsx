/**
 * NetworkErrorBanner - Displays when the app is offline
 * Lightweight, persistent banner that doesn't disrupt navigation
 */

import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    zIndex: 100,
  },
  icon: {
    marginRight: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export function NetworkErrorBanner() {
  const { isOnline } = useNetworkStatus();
  const { colors, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();

  if (isOnline) {
    return null;
  }

  const bannerStyles = StyleSheet.create({
    container: [
      styles.container,
      {
        backgroundColor: isDark ? '#7C2D12' : '#FED7AA',
        borderBottomColor: isDark ? '#B45309' : '#FB923C',
        marginTop: insets.top,
      },
    ],
    title: [
      styles.title,
      {
        color: isDark ? '#FED7AA' : '#92400E',
      },
    ],
    subtitle: [
      styles.subtitle,
      {
        color: isDark ? '#DBEAFE' : '#1F2937',
      },
    ],
  });

  return (
    <View style={bannerStyles.container} testID='network-error-banner'>
      <Text style={styles.icon}>📡</Text>
      <View style={styles.content}>
        <Text style={bannerStyles.title}>No internet connection</Text>
        <Text style={bannerStyles.subtitle}>
          Your data will sync once you're back online
        </Text>
      </View>
    </View>
  );
}

export default NetworkErrorBanner;
