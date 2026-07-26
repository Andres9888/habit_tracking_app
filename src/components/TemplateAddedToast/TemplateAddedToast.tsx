/**
 * TemplateAddedToast Component
 * Action card shown after importing a habit template.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import type { TemplateAddedToastProps } from './types';
import { DEFAULT_DURATION, FALLBACK_COLOR } from './constants';
import { styles } from './styles';
import { useTemplateAddedToastAnimations } from './useTemplateAddedToastAnimations';
import { getToastCopy } from './getToastCopy';
import { TemplateAddedToastActions } from './TemplateAddedToastActions';

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

  const { encouragement, primaryLabel, title } = getToastCopy(
    templateData,
    variant,
    sessionImportCount
  );

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
            <TemplateAddedToastActions
              color={color}
              handleDismiss={handleDismiss}
              onAddAnother={onAddAnother}
              primaryLabel={primaryLabel}
              viewHabit={viewHabit}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default TemplateAddedToast;
