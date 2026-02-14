/* eslint-disable max-lines */
/**
 * QuickActionsSheet Component
 * Bottom sheet with quick actions for habit management
 */

import React, { useCallback } from 'react';
import { Pressable, Modal, Dimensions } from 'react-native';
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
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '../../theme/ThemeContext';
import type { QuickActionsSheetProps } from './types';
import { SheetHeader } from './SheetHeader';
import { ActionsList } from './ActionsList';

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [visible, translateY]);

  const handleDismiss = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
        runOnJS(handleDismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
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
          className='absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-xl'
          entering={SlideInDown.springify().damping(18).stiffness(150)}
          exiting={SlideOutDown.springify().damping(20).stiffness(200)}
          style={[{ backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }, sheetAnimatedStyle]}
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
