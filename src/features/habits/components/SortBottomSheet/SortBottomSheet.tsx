/* eslint-disable max-lines */
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  CLOSE_ICON_SIZE,
  DARK_SURFACE_COLOR,
  LIGHT_SURFACE_COLOR,
  SCREEN_HEIGHT,
  SHEET_BOTTOM_PADDING,
  SHEET_ELEVATION,
  SHEET_MAX_HEIGHT_RATIO,
  SHEET_SHADOW_OFFSET,
  SHEET_SHADOW_OPACITY,
  SHEET_SHADOW_RADIUS,
  SORT_OPTIONS,
} from './constants';
import { QuickPickChips } from './QuickPickChips';
import { SortOptionRow } from './SortOptionRow';
import type { SortBottomSheetProps } from './types';
import { useSortBottomSheet } from './useSortBottomSheet';

/** iOS-style bottom sheet for selecting habit sort order */
export function SortBottomSheet({
  visible,
  onClose,
  sortMode,
  onSelectSortMode,
  reduceMotion = false,
}: SortBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useThemeColors();
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
          <Animated.View
            className='rounded-t-3xl'
            style={[
              {
                backgroundColor: themeColors.card,
                elevation: SHEET_ELEVATION,
                maxHeight: SCREEN_HEIGHT * SHEET_MAX_HEIGHT_RATIO,
                paddingBottom: insets.bottom + SHEET_BOTTOM_PADDING,
                shadowColor: isDark ? '#000000' : '#1c1917',
                shadowOffset: SHEET_SHADOW_OFFSET,
                shadowOpacity: SHEET_SHADOW_OPACITY,
                shadowRadius: SHEET_SHADOW_RADIUS,
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
              <Text
                className='text-[17px] font-bold'
                style={{ color: themeColors.text.primary }}
              >
                Sort Habits
              </Text>
              <Pressable
                accessibilityHint='Close sort options'
                accessibilityLabel='Close'
                accessibilityRole='button'
                className='h-10 w-10 items-center justify-center rounded-full'
                style={{
                  backgroundColor: isDark ? DARK_SURFACE_COLOR : LIGHT_SURFACE_COLOR,
                }}
                onPress={handleDismiss}
              >
                <X color={themeColors.text.secondary} size={CLOSE_ICON_SIZE} />
              </Pressable>
            </View>

            <QuickPickChips sortMode={sortMode} onSelect={handleSelectSort} />

            <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
              {SORT_OPTIONS.map((option) => (
                <SortOptionRow
                  key={option.value}
                  description={option.description}
                  Icon={option.Icon}
                  iconBgColors={option.iconBgColors}
                  selected={sortMode === option.value}
                  title={option.label}
                  onPress={() => handleSelectSort(option.value)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default SortBottomSheet;
