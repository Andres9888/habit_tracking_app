/**
 * Toast Container — renders active toasts with slide-down animation.
 *
 * Place once at the app root, above all other content.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useToast, type ToastMessage, type ToastType } from './ToastContext';

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#ECFDF5', border: '#059669', icon: '#047857' },
  error: { bg: '#FEF2F2', border: '#DC2626', icon: '#B91C1C' },
  info: { bg: '#EFF6FF', border: '#2563EB', icon: '#1D4ED8' },
  warning: { bg: '#FFFBEB', border: '#D97706', icon: '#B45309' },
};

const TOAST_ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const colors = TOAST_COLORS[toast.type];
  const icon = TOAST_ICONS[toast.type];

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  const handlePress = useCallback(() => {
    clearTimeout(timerRef.current);
    onDismiss(toast.id);
  }, [toast.id, onDismiss]);

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18).duration(280)}
      exiting={SlideOutUp.duration(200)}
      layout={Layout.springify()}
      style={[styles.toast, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}
    >
      <Pressable onPress={handlePress} style={styles.toastContent}>
        <Ionicons name={icon} size={22} color={colors.icon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.icon }]} numberOfLines={1}>
            {toast.title}
          </Text>
          {toast.message ? (
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
          ) : null}
        </View>
        <Ionicons name="close" size={18} color="#9CA3AF" style={styles.closeIcon} />
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + 8 }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
  closeIcon: {
    marginLeft: 8,
  },
});
