import { Modal, Pressable, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalCloseButton } from '@/components/ui/ModalCloseButton';
import { shadows } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { SCREEN_HEIGHT } from './constants';
import { SortCardGrid } from './SortCardGrid';
import type { SortBottomSheetProps } from './types';
import { useSortBottomSheet } from './useSortBottomSheet';
import { SCREEN } from '../../../../constants';

/** iOS-style bottom sheet for selecting habit sort order */
export function SortBottomSheet({
  visible,
  onClose,
  sortMode,
  onSelectSortMode,
  reduceMotion = false,
}: SortBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
  const {
    panGesture,
    backdropStyle,
    sheetStyle,
    handleSelectSort,
    handleDismiss,
  } = useSortBottomSheet({ onClose, onSelectSortMode, reduceMotion, visible });

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end'>
        <Pressable
          accessible={false}
          className='absolute inset-0'
          onPress={handleDismiss}
        >
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <View collapsable={false}>
            <Animated.View
              className='rounded-t-3xl'
              style={[
                {
                  backgroundColor: themeColors.surface,
                  maxHeight: SCREEN_HEIGHT * SCREEN.maxHeightPercent,
                  paddingBottom: insets.bottom + 16,
                  ...shadows.modal,
                },
                sheetStyle,
              ]}
            >
              <View className='items-center py-3'>
                <View
                  className='h-1 w-10 rounded-full'
                  style={{ backgroundColor: themeColors.gray[300] }}
                />
              </View>

              <View className='flex-row items-center justify-between px-5 pb-4'>
                <Text style={[typography.button, { color: themeColors.text.primary }]}>
                  Sort Habits
                </Text>
                <ModalCloseButton onClose={handleDismiss} />
              </View>

              <SortCardGrid sortMode={sortMode} onSelect={handleSelectSort} />
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default SortBottomSheet;
