/**
 * SwipeActions Component
 * Edit and Delete action buttons revealed on swipe
 */

import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { withSpring, type SharedValue } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
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

  return (
    <Animated.View
      style={[actionStyles.actionsContainer, actionsAnimatedStyle]}
    >
      <Pressable
        accessibilityLabel={`Edit ${name}`}
        accessibilityRole='button'
        className='active:opacity-80'
        style={[
          actionStyles.actionButton,
          { backgroundColor: theme.custom.colors.secondary[500] },
        ]}
        onPress={() => {
          translateX.value = withSpring(0);
          onEdit?.();
        }}
      >
        <Text style={actionStyles.actionText}>Edit</Text>
      </Pressable>

      <Pressable
        accessibilityLabel={`Delete ${name}`}
        accessibilityRole='button'
        className='active:opacity-80'
        style={[
          actionStyles.actionButton,
          { backgroundColor: theme.custom.colors.error },
        ]}
        onPress={() => {
          translateX.value = withSpring(0);
          onDelete?.();
        }}
      >
        <Text style={actionStyles.actionText}>Delete</Text>
      </Pressable>
    </Animated.View>
  );
});
