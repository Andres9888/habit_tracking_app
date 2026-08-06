/**
 * TemplateAddedToast Component
 * Action card shown after importing a habit template.
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
  variant = 'success',
  sessionImportCount = 0,
  onDismiss,
  onViewHabit,
  onViewHabits,
  onAddAnother,
  style,
}: TemplateAddedToastProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const color = templateData?.color ?? FALLBACK_COLOR;
  const viewHabit = onViewHabit ?? onViewHabits;

  const { toastStyle, iconStyle, handleDismiss, panGesture } =
    useTemplateAddedToastAnimations({ duration, onDismiss, variant, visible });

  if (!visible || !templateData) return null;

  const title =
    variant === 'already_exists'
      ? `'${templateData.name}' is already in your habits`
      : `Added '${templateData.name}' to your habits`;
  const encouragement =
    variant === 'success' && sessionImportCount > 1
      ? `Nice — you've added ${sessionImportCount} today`
      : variant === 'success'
        ? 'Nice start — keep the momentum going'
        : 'You can open it to review or track progress';
  const primaryLabel =
    variant === 'already_exists' ? 'Open existing habit' : 'View my habit';

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <View collapsable={false}>
          <Animated.View
            accessible
            testID='templates-toast'
            accessibilityLabel={title}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[
              styles.toast,
              {
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
              <View style={styles.copy}>
                <Text testID='templates-toast-name' numberOfLines={2} style={styles.nameText}>
                  {title}
                </Text>
                <Text numberOfLines={2} style={styles.subText}>
                  {encouragement}
                </Text>
              </View>
            </View>
            <View style={styles.actionColumn}>
              {viewHabit ? (
                <Pressable
                  accessibilityLabel={primaryLabel}
                  accessibilityRole='button'
                  style={[styles.actionPill, { backgroundColor: color }]}
                  onPress={() => {
                    handleDismiss();
                    viewHabit();
                  }}
                >
                  <Text style={styles.actionText}>{primaryLabel}</Text>
                </Pressable>
              ) : null}
              {onAddAnother ? (
                <Pressable
                  accessibilityLabel='Add another habit'
                  accessibilityRole='button'
                  onPress={() => {
                    handleDismiss();
                    onAddAnother();
                  }}
                >
                  <Text style={styles.addAnotherText}>Add another</Text>
                </Pressable>
              ) : null}
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default TemplateAddedToast;
