/**
 * Empty state for HabitPreview
 */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

export const EmptyPreview = () => {
  const { colors } = useThemeColors();

  return (
    <View className='items-center py-4'>
      <Text className='mb-2 text-4xl'>✨</Text>
      <Text className='mb-1 text-sm font-medium' style={{ color: colors.text.secondary }}>
        Your habit will appear here
      </Text>
      <Text className='text-xs' style={{ color: colors.text.tertiary }}>
        Try: "Meditate", "Run", or "Read"
      </Text>
    </View>
  );
};
