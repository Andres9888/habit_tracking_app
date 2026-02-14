import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

export function AuthDivider() {
  const { colors } = useThemeColors();

  return (
    <View className='my-4 flex-row items-center'>
      <View className='h-px flex-1' style={{ backgroundColor: colors.border }} />
      <Text
        className='mx-4 text-xs font-medium tracking-widest'
        style={{ color: colors.text.tertiary }}
      >
        OR
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: colors.border }} />
    </View>
  );
}
