/**
 * TemplateAddedToast Component
 * Celebratory toast shown after successfully importing a habit template.
 * Shows template icon, name, and optional "View" action.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import type { TemplateAddedToastProps } from './types';
import { DEFAULT_DURATION, FALLBACK_COLOR } from './constants';
import { styles } from './styles';
import { useTemplateAddedToastAnimations } from './useTemplateAddedToastAnimations';

export function TemplateAddedToast({
  visible,
  templateData,
  duration = DEFAULT_DURATION,
  onDismiss,
  onViewHabits,
  style,
}: TemplateAddedToastProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const color = templateData?.color ?? FALLBACK_COLOR;

  const { toastStyle, iconStyle, handleDismiss, panGesture } =
    useTemplateAddedToastAnimations({ duration, onDismiss, visible });

  if (!visible || !templateData) return null;

  const label = `${templateData.name} added to your habits`;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          testID="templates-toast"
          accessibilityLabel={label}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[
            styles.toast,
            {
              backgroundColor: '#1a1a2e',
              borderLeftColor: color,
              borderLeftWidth: 4,
              ...theme.custom.shadows.card,
            },
            toastStyle,
            style,
          ]}
        >
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.iconBadge,
                { backgroundColor: `${color}25` },
                iconStyle,
              ]}
            >
              <Text style={styles.iconText}>{templateData.icon}</Text>
            </Animated.View>
            <Text testID="templates-toast-name" numberOfLines={1} style={styles.nameText}>
              {templateData.name} added!
            </Text>
          </View>
          {onViewHabits ? (
            <Pressable
              accessibilityLabel='View your habits'
              accessibilityRole='button'
              style={styles.actionPill}
              onPress={() => {
                handleDismiss();
                onViewHabits();
              }}
            >
              <Text style={styles.actionText}>View →</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default TemplateAddedToast;
