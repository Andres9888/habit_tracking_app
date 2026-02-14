/**
 * QuickActionsSheet Component
 * Bottom sheet with quick actions for habit management
 */

import React, { useCallback } from 'react';
import { Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { QuickActionsSheetProps } from './types';
import { SheetHeader } from './SheetHeader';
import { ActionsList } from './ActionsList';
import { usePanGesture } from './usePanGesture';

export const QuickActionsSheet = ({
  habit,
  onClose,
  onComplete,
  onDelete,
  onEdit,
  onMentalBoost,
  onPause,
  onViewCalendar,
  onViewDetails,
  visible,
}: QuickActionsSheetProps) => {
  const insets = useSafeAreaInsets();

  const handleDismiss = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  const { panGesture, sheetAnimatedStyle, translateY } =
    usePanGesture(handleDismiss);

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [visible, translateY]);

  if (!habit) return null;

  const handleAction = (action?: () => void) => {
    onClose();
    setTimeout(() => {
      action?.();
    }, 150);
  };

  return (
    <Modal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        className='absolute inset-0 bg-black/50'
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Pressable
          accessibilityLabel='Close quick actions'
          accessibilityRole='button'
          className='flex-1'
          onPress={onClose}
        />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className='absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-xl'
          entering={SlideInDown.springify().damping(18).stiffness(150)}
          exiting={SlideOutDown.springify().damping(20).stiffness(200)}
          style={[{ paddingBottom: insets.bottom + 16 }, sheetAnimatedStyle]}
        >
          <SheetHeader
            habitIcon={habit.icon}
            habitName={habit.name}
            onClose={onClose}
          />
          <ActionsList
            completed={habit.completed ?? false}
            onComplete={() => handleAction(onComplete)}
            onDelete={() => handleAction(onDelete)}
            onEdit={() => handleAction(onEdit)}
            onMentalBoost={() => handleAction(onMentalBoost)}
            onPause={() => handleAction(onPause)}
            onViewCalendar={() => handleAction(onViewCalendar)}
            onViewDetails={
              onViewDetails ? () => handleAction(onViewDetails) : undefined
            }
          />
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

export default QuickActionsSheet;
