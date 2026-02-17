/**
 * NetworkErrorBanner - Global banner for network connectivity issues
 * Shows at top of screen when offline, dismisses when back online
 * Dark mode supported, non-intrusive design
 */
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useThemeColors } from '../../theme/ThemeContext';

const BANNER_HEIGHT = 48;
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 150,
};

export function NetworkErrorBanner() {
  const { isOnline, isChecking } = useNetworkStatus();
  const { colors, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(-BANNER_HEIGHT - insets.top);

  useEffect(() => {
    if (!isChecking && !isOnline && !visible) {
      setVisible(true);
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else if (isOnline && visible) {
      translateY.value = withSpring(-BANNER_HEIGHT - insets.top, SPRING_CONFIG, () => {
        runOnJS(setVisible)(false);
      });
    }
  }, [isOnline, isChecking, visible, insets.top, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const styles = StyleSheet.create({
    banner: {
      alignItems: 'center',
      backgroundColor: isDark ? '#DC2626' : '#EF4444',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      paddingHorizontal: 20,
      paddingTop: insets.top + 12,
      position: 'absolute',
      shadowColor: '#000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      top: 0,
      width: '100%',
      zIndex: 9999,
    },
    icon: {
      color: '#FFF',
      fontSize: 16,
      marginRight: 12,
    },
    message: {
      color: '#FFF',
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
    },
    retryButton: {
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    retryText: {
      color: '#FFF',
      fontSize: 13,
      fontWeight: '700',
    },
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, animatedStyle]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>No internet connection</Text>
      <Pressable
        accessibilityLabel="Retry connection"
        accessibilityRole="button"
        style={styles.retryButton}
        onPress={() => {
          // Trigger network refresh if needed
        }}
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </Animated.View>
  );
}
