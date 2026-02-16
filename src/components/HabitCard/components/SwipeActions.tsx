/**
 * SwipeActions Component
 * Edit and Delete action buttons revealed on swipe with icons and haptic feedback
 */

import React, { useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';
import { withSpring, type SharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../theme';
import { springs } from '../../../theme/animations';
import { actionStyles } from '../HabitCard.actionStyles';

interface SwipeActionsProps {
  name: string;
  translateX: SharedValue<number>;
  actionsAnimatedStyle: { opacity: number };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SwipeActions = memo(function SwipeActions({
  name,
  translateX,
  actionsAnimatedStyle,
  onEdit,
  onDelete,
}: SwipeActionsProps) {
  const theme = useAppTheme();

  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    translateX.value = withSpring(0, springs.gesture);
    onEdit?.();
  }, [onEdit, translateX]);

  const handleDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );
    translateX.value = withSpring(0, springs.gesture);
    onDelete?.();
  }, [onDelete, translateX]);

  return (
    <Animated.View
      style={[actionStyles.actionsContainer, actionsAnimatedStyle]}
    >
      <Pressable
        accessibilityLabel={`Edit ${name}`}
        accessibilityRole='button'
        style={({ pressed }) => [
          actionStyles.actionButton,
          { backgroundColor: theme.custom.colors.secondary[500] },
          pressed && localStyles.pressed,
        ]}
        onPress={handleEdit}
      >
        <View style={localStyles.actionContent}>
          <Ionicons color='#fff' name='pencil' size={18} />
          <Text style={actionStyles.actionText}>Edit</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityLabel={`Delete ${name}`}
        accessibilityRole='button'
        style={({ pressed }) => [
          actionStyles.actionButton,
          { backgroundColor: theme.custom.colors.error },
          pressed && localStyles.pressed,
        ]}
        onPress={handleDelete}
      >
        <View style={localStyles.actionContent}>
          <Ionicons color='#fff' name='trash' size={18} />
          <Text style={actionStyles.actionText}>Delete</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  actionContent: {
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },

});
