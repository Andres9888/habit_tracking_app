/**
 * SwipeActions Component
 * Premium edit and delete action buttons revealed on swipe.
 * Features icons + text labels, rounded corners, and spring press feedback.
 */

import React, { useCallback } from 'react';
import { Pressable, View, Text } from 'react-native';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { actionStyles } from '../HabitCard.actionStyles';

interface SwipeActionsProps {
  name: string;
  translateX: SharedValue<number>;
  actionsAnimatedStyle: { opacity: number };
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Animated pressable action button with spring scale feedback */
function ActionButton({
  accessibilityLabel,
  icon,
  label,
  backgroundColor,
  onPress,
}: {
  accessibilityLabel: string;
  icon: React.ReactNode;
  label: string;
  backgroundColor: string;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  return (
    <Animated.View style={[actionStyles.actionButton, { backgroundColor }, animatedStyle]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={actionStyles.actionPressable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon}
        <Text style={actionStyles.actionLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function SwipeActions({
  name,
  translateX,
  actionsAnimatedStyle,
  onEdit,
  onDelete,
}: SwipeActionsProps) {
  const { isDark } = useThemeColors();

  const editBg = isDark ? '#2563eb' : '#3b82f6';
  const deleteBg = isDark ? '#dc2626' : '#ef4444';

  const handleEdit = useCallback(() => {
    translateX.value = withSpring(0, { damping: 18, stiffness: 150 });
    onEdit?.();
  }, [translateX, onEdit]);

  const handleDelete = useCallback(() => {
    translateX.value = withSpring(0, { damping: 18, stiffness: 150 });
    onDelete?.();
  }, [translateX, onDelete]);

  return (
    <Animated.View
      style={[actionStyles.actionsContainer, actionsAnimatedStyle]}
    >
      <View style={actionStyles.actionsRow}>
        <ActionButton
          accessibilityLabel={`Edit ${name}`}
          backgroundColor={editBg}
          icon={<Pencil color="#ffffff" size={18} strokeWidth={2.25} />}
          label="Edit"
          onPress={handleEdit}
        />
        <ActionButton
          accessibilityLabel={`Delete ${name}`}
          backgroundColor={deleteBg}
          icon={<Trash2 color="#ffffff" size={18} strokeWidth={2.25} />}
          label="Delete"
          onPress={handleDelete}
        />
      </View>
    </Animated.View>
  );
}
