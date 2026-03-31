import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center gap-2.5 px-5 pb-1 pt-4'>
      <Text
        className='text-[13px] font-semibold uppercase tracking-wider'
        style={{ color: colors.text.tertiary }}
      >
        {label}
      </Text>
      <View
        className='h-px flex-1'
        style={{ backgroundColor: colors.border }}
      />
    </View>
  );
}
