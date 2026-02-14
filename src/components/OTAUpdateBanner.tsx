/**
 * OTA Update Banner
 *
 * Subtle, non-intrusive banner that slides in from the top
 * when an update is ready. Shows "Update available" with a
 * "Restart" button. Doesn't interrupt user mid-action.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOTAUpdates } from '../hooks/useOTAUpdates';

export function OTAUpdateBanner() {
  const { status, restart } = useOTAUpdates();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;

  const visible = status === 'ready';

  useEffect(() => {
    Animated.spring(translateY, {
      damping: 18,
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        { paddingTop: insets.top + 4, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>Update available</Text>
        <TouchableOpacity style={styles.button} onPress={restart}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#047857',
    left: 0,
    paddingBottom: 8,
    position: 'absolute',
    elevation: 4,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    top: 0,
    shadowRadius: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
