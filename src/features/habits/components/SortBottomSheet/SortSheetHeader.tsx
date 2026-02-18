/**
 * SortSheetHeader — header section of the sort bottom sheet
 *
 * Extracted from SortBottomSheet to isolate header composition.
 * Includes drag handle, title, and close button.
 */

import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import type { ThemeColors } from '../../../../theme/ThemeContext';

interface SortSheetHeaderProps {
  onClose: () => void;
  themeColors: ThemeColors;
  isDark: boolean;
}

export function SortSheetHeader({
  onClose,
  themeColors,
  isDark,
}: SortSheetHeaderProps) {
  return (
    <>
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
          className='h-11 w-11 items-center justify-center rounded-full'
          style={{
            backgroundColor: isDark
              ? themeColors.gray[800]
              : themeColors.gray[100],
          }}
          onPress={onClose}
        >
          <X color={themeColors.text.secondary} size={24} />
        </Pressable>
      </View>
    </>
  );
}
