/* eslint-disable max-lines */
/**
 * QuickActionsSheet Component
 * Bottom sheet with quick actions for habit management
 */

import React, { useCallback } from 'react';
import { Pressable, Modal, Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import type { QuickActionsSheetProps } from './types';
import { SheetHeader } from './SheetHeader';
import { ActionsList } from './ActionsList';
import { springs } from '@/theme/animations';
import { triggerHaptic } from '@/utils/haptics';

const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  const { colors } = useThemeColors();
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
      triggerHaptic('tap');
    }
  }, [visible, translateY]);

  const handleDismiss = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, springs.standard);
        runOnJS(handleDismiss)();
      } else {
        translateY.value = withSpring(0, springs.standard);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!habit) {
    return null;
  }

  const handleAction = (action?: () => void) => {
    onClose();
    setTimeout(() => {
      action?.();
    }, 150);
  };

  return (
    <Modal
      accessibilityViewIsModal
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
        <View collapsable={false}>
          <Animated.View
            className='absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-xl'
            entering={SlideInDown.springify().damping(18).stiffness(150)}
            exiting={SlideOutDown.springify().damping(20).stiffness(200)}
            style={[{ paddingBottom: insets.bottom + 16, backgroundColor: colors.surface }, sheetAnimatedStyle]}
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
        </View>
      </GestureDetector>
    </Modal>
  );
};

export default QuickActionsSheet;
