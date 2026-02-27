/**
 * ViewerHeader Component
 * Header bar for the image viewer modal with close, edit, and delete actions
 */

import React, { useCallback } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { X, Edit3, Trash2 } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressAnimation() {
  const scale = useSharedValue(1);
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 18, stiffness: 150 });
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 150 });
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return { animatedStyle, handlePressIn, handlePressOut };
}

interface ViewerHeaderProps {
  onClose: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function ViewerHeader({
  onClose,
  onToggleEdit,
  onDelete,
  isDeleting,
}: ViewerHeaderProps) {
  const insets = useSafeAreaInsets();
  const closeAnim = usePressAnimation();
  const editAnim = usePressAnimation();
  const deleteAnim = usePressAnimation();

  return (
    <View className='flex-row items-center justify-between px-4 pb-4' style={{ paddingTop: insets.top + 8 }}>
      <View className='flex-row gap-2'>
        <AnimatedPressable
          accessibilityLabel='Edit caption'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
          style={editAnim.animatedStyle}
          onPress={() => {
            triggerHaptic('tap');
            onToggleEdit();
          }}
          onPressIn={editAnim.handlePressIn}
          onPressOut={editAnim.handlePressOut}
        >
          <Edit3 className='text-white' size={20} />
        </AnimatedPressable>
        <AnimatedPressable
          accessibilityLabel='Delete image'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
          disabled={isDeleting}
          style={deleteAnim.animatedStyle}
          onPress={() => {
            triggerHaptic('tap');
            onDelete();
          }}
          onPressIn={deleteAnim.handlePressIn}
          onPressOut={deleteAnim.handlePressOut}
        >
          {isDeleting ? (
            <ActivityIndicator color='#fff' size='small' />
          ) : (
            <Trash2 className='text-white' size={20} />
          )}
        </AnimatedPressable>
      </View>
      <AnimatedPressable
        accessibilityLabel='Close image viewer'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/10'
        style={closeAnim.animatedStyle}
        onPress={() => {
          triggerHaptic('tap');
          onClose();
        }}
        onPressIn={closeAnim.handlePressIn}
        onPressOut={closeAnim.handlePressOut}
      >
        <X className='text-white' size={24} />
      </AnimatedPressable>
    </View>
  );
}
