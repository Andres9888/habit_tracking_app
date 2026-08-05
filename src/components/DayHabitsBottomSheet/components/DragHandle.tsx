import { View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

/**
 * Visual drag handle indicator for the bottom sheet
 */
export function DragHandle() {
  const { colors } = useThemeColors();

  return (
    <View className='items-center py-3'>
      <View className='h-1 w-10 rounded-full' style={{ backgroundColor: colors.border }} />
    </View>
  );
}
